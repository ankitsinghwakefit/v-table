<template>
  <v-container>
    <v-card>
      <v-card-title>
        Users Table
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <!-- Horizontal Scroll Wrapper -->
      <div style="overflow-x: auto;">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          class="elevation-1"
          @click:row="openRowDetails"
        >
          <!-- Email Column -->
          <template slot="item.email" slot-scope="props">
            <a :href="`mailto:${props.item.email}`">{{ props.item.email }}</a>
          </template>

          <!-- Status Column -->
          <template slot="item.status" slot-scope="props">
            <v-chip :color="props.item.status === 'Active' ? 'green' : 'red'" dark>
              <v-icon left>
                {{ props.item.status === 'Active' ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ props.item.status }}
            </v-chip>
          </template>
        </v-data-table>

      </div>
      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="primary" @click="exportToExcel" small>
           <v-icon left>mdi-file-excel</v-icon>
           Export Excel
         </v-btn>
       </v-card-actions>
    </v-card>


    <!-- Dialog Popup -->
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
      dialog: false,
      selectedUser: {},
      selectedIndex: null, // track which row we clicked
      editUser: {}, // editable copy
      headers: [
        { text: "Name", value: "name", sortable: true },
        { text: "Email", value: "email", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Joined", value: "joined", sortable: true },
        { text: "Department", value: "department" },
        { text: "Role", value: "role" },
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
  created() {
    // generate demo rows
    for (let i = 1; i <= 30; i++) {
      this.users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        status: i % 2 === 0 ? "Active" : "Inactive",
        joined: "2023-01-01",
        department: "Engineering",
        role: i % 2 === 0 ? "Developer" : "Designer",
        location: "Dubai",
        phone: `+971-555-000${i}`,
        e1: `X1-${i}`,
        e2: `X2-${i}`,
        e3: `X3-${i}`
      })
    }
  },
  methods: {
    exportToExcel() {
      // export full dataset
      const ws = XLSX.utils.json_to_sheet(this.users)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Users")
      XLSX.writeFile(wb, "users.xlsx")
    },
    openRowDetails(item) {
      this.selectedUser = item
      this.dialog = true
    },
    saveUser() {
      if (this.selectedIndex !== null) {
        this.$set(this.users, this.selectedIndex, Object.assign({}, this.editUser))
      }
      this.dialog = false
    }
  }
}
</script>
