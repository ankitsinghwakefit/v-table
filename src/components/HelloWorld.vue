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
    </v-card>

    <!-- Dialog Popup -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          User Details
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Name:</strong> {{ selectedUser.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Email:</strong> {{ selectedUser.email }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Status:</strong> {{ selectedUser.status }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Joined:</strong> {{ selectedUser.joined }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Role:</strong> {{ selectedUser.role }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      dialog: false,
      selectedUser: {},
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
    openRowDetails(item) {
      this.selectedUser = item
      this.dialog = true
    }
  }
}
</script>
