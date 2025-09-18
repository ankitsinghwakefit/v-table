<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <div>
          <span class="headline">Users</span>
        </div>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dense
          style="max-width:300px"
        />
      </v-card-title>

      <!-- Outer wrapper: only horizontal scrolling -->
      <div class="table-responsive">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :items-per-page="10"
          class="my-data-table elevation-1"
          disable-sort-by-default
        >
          <!-- Email clickable -->
          <template slot="item.email" slot-scope="props">
            <a :href="`mailto:${props.item.email}`">{{ props.item.email }}</a>
          </template>

          <!-- Status with icon -->
          <template slot="item.status" slot-scope="props">
            <v-chip :color="props.item.status === 'Active' ? 'green' : 'red'" dark small>
              <v-icon left small>
                {{ props.item.status === 'Active' ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ props.item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </div>

      <!-- Keep default footer (pagination) visible below the scroll area -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="exportToExcel" small>
          <v-icon left>mdi-file-excel</v-icon>
          Export Excel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx"

export default {
  name: "ScrollableTable",
  data() {
    return {
      search: "",
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
    }
  }
}
</script>

<style>
/* <-- Put this in a global (non-scoped) style block or in a global CSS file --> */

/* Outer wrapper: only horizontal scroll */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* ensure wrapper doesn't create a new stacking context that breaks sticky */
  position: relative;
}

/* Force the inner table to be wide enough to trigger horizontal scroll.
   Using a fixed min-width for demo; you may set min-width based on your column count
   or use min-width: max-content if you want table width to match content width. */
.table-responsive .v-data-table__wrapper table {
  min-width: 1200px; /* increase if you need a wider table */
}

/* Make header cells sticky (stick to the top of the scrolling container).
   We target the actual thead th produced by Vuetify. */
.table-responsive .v-data-table__wrapper thead th {
  position: sticky;
  top: 0;                 /* distance from top of the scroll container */
  background: white;      /* set background so header doesn't appear transparent */
  z-index: 5;             /* keep header above table body */
  /* optional visual separation */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.06);
}

/* If your header has icons or sort controls, keep them above body cells */
.table-responsive .v-data-table__wrapper thead th .v-icon,
.table-responsive .v-data-table__wrapper thead th .v-btn {
  z-index: 6;
}

/* In case Vuetify or your layout adds transforms/filters on parents (which break sticky),
   ensure no transform on ancestors of the table. If you cannot remove transforms,
   sticky won't work — see troubleshooting notes below. */
</style>
