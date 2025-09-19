<template>
  <v-container fluid>
    <v-card>
      <!-- Top Pagination + Items Per Page + Search -->
       <div>Showing {{ pagedUsers.length }} / {{ filteredUsers.length }} items</div>
      <v-card-title class="d-flex align-center">
        <span class="mr-4">Users Table</span>

        <!-- Pagination -->
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="5"
        ></v-pagination>

        <!-- Items per page dropdown -->
        <v-select
          v-model="itemsPerPage"
          :items="[5, 10, 15, 20]"
          label="Items per page"
          dense
          hide-details
          style="width:120px; margin-left: 16px;"
          @change="page = 1"
        ></v-select>

        <v-spacer></v-spacer>

        <!-- Search -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dense
          style="max-width: 250px;"
          @input="page = 1"
        />
      </v-card-title>

      <!-- Horizontal Scroll -->
      <div class="table-responsive">
        <v-data-table
          :headers="headers"
          :items="pagedUsers"
          class="elevation-1"
          hide-default-footer
          disable-pagination
          @click:row="openRowDetails"
        >
          <!-- Email -->
          <template slot="item.email" slot-scope="props">
            <a :href="`mailto:${props.item.email}`">{{ props.item.email }}</a>
          </template>

          <!-- Status -->
          <template slot="item.status" slot-scope="props">
            <v-chip :color="props.item.status === 'Active' ? 'green' : 'red'" dark>
              <v-icon left small>
                {{ props.item.status === 'Active' ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ props.item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </div>

      <!-- Bottom Pagination + Export -->
      <v-card-actions class="d-flex align-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          total-visible="5"
        ></v-pagination>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="exportToExcel" small>
          <v-icon left>mdi-file-excel</v-icon>
          Export Excel
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Editable Modal -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          Edit User
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="editForm">
            <v-text-field v-model="editUser.name" label="Name"></v-text-field>
            <v-text-field v-model="editUser.email" label="Email"></v-text-field>
            <v-select
              v-model="editUser.status"
              :items="['Active', 'Inactive']"
              label="Status"
            ></v-select>
            <v-text-field v-model="editUser.joined" label="Joined"></v-text-field>
            <v-text-field v-model="editUser.role" label="Role"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="primary" @click="saveUser">Save</v-btn>
          <v-btn text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx"

export default {
  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 5,
      dialog: false,
      selectedIndex: null,
      editUser: {},
      headers: [
        { text: "Name", value: "name", sortable: true },
        { text: "Email", value: "email", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Joined", value: "joined", sortable: true },
        { text: "Role", value: "role", sortable: true },
        { text: "Department", value: "department" },
        { text: "Location", value: "location" },
        { text: "Phone", value: "phone" },
        // Add more columns if you want to test horizontal scrolling
        { text: "Extra 1", value: "e1" },
        { text: "Extra 2", value: "e2" },
        { text: "Extra 3", value: "e3" }
      ],
      users: []
    }
  },
  watch: {
  itemsPerPage() {
    this.page = 1
  },
  search() {
    this.page = 1
  }
},
  created() {
    for (let i = 1; i <= 50; i++) {
      this.users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        status: i % 2 === 0 ? "Active" : "Inactive",
        joined: "2023-01-01",
        role: i % 2 === 0 ? "Developer" : "Designer",
        department: "Engineering",
        location: "Dubai",
        phone: `+971-555-000${i}`,
        e1: `X1-${i}`,
        e2: `X2-${i}`,
        e3: `X3-${i}`
      })
    }
  },
  computed: {
    filteredUsers() {
      if (!this.search) return this.users
      const term = this.search.toLowerCase()
      return this.users.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.status.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      )
    },
    pageCount() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
    },
    pagedUsers() {
      console.log('this.itemsPerPage',this.page, this.itemsPerPage, (this.page - 1) * this.itemsPerPage)
      const start = (this.page - 1) * this.itemsPerPage
      return this.filteredUsers.slice(start, start + this.itemsPerPage)
    }
  },
  methods: {
    openRowDetails(item) {
      this.selectedIndex = this.users.indexOf(item)
      this.editUser = Object.assign({}, item)
      this.dialog = true
    },
    saveUser() {
      if (this.selectedIndex !== null) {
        this.$set(this.users, this.selectedIndex, Object.assign({}, this.editUser))
      }
      this.dialog = false
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.users)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Users")
      XLSX.writeFile(wb, "users.xlsx")
    }
  }
}
</script>

<style>
.table-responsive {
  overflow-x: auto;
}
.table-responsive .v-data-table__wrapper table {
  min-width: 800px; /* ensures horizontal scroll if many columns */
}
.v-data-table-header {
  background-color: aquamarine;
}
</style>
