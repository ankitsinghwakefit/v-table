<template>
  <v-container>
    <!-- Search -->
    <v-text-field
      v-model="search"
      label="Search"
      prepend-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <!-- Export button -->
    <v-btn color="success" class="mb-4" @click="exportToExcel">
      <v-icon left>mdi-file-excel</v-icon>
      Export to Excel
    </v-btn>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, 20],
        'show-first-last-page': true
      }"
      show-expand
      single-expand
      class="elevation-1"
    >
      <!-- Custom cell: clickable link -->
      <template v-slot:[`item.name`]="{ item }">
        <a :href="'https://example.com/user/' + item.id" target="_blank">
          {{ item.name }}
        </a>
      </template>

      <!-- Custom cell: icon + text -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="item.status === 'Active' ? 'green' : 'red'" dark small>
          <v-icon left>
            {{ item.status === 'Active' ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Expanded row shows children in same table style -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
            :headers="headers"
            :items="item.children"
            hide-default-footer
            dense
          >
            <!-- Apply same slots for children -->

            <template v-slot:[`item.name`]="{ item }">
              <a :href="'https://example.com/user/' + item.id" target="_blank">
                {{ item.name }}
              </a>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-chip :color="item.status === 'Active' ? 'green' : 'red'" dark small>
                <v-icon left>
                  {{ item.status === 'Active' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx"

export default {
  data() {
    return {
      search: "",
      itemsPerPage: 10,
      headers: [
        { text: "ID", value: "id", sortable: true },
        { text: "Name", value: "name", sortable: true },
        { text: "Email", value: "email", sortable: true },
        { text: "Status", value: "status", sortable: true }
      ],
      items: [
        {
          id: 1,
          name: "Alice",
          email: "alice@example.com",
          status: "Active",
          children: [
            { id: 11, name: "Alice Jr", email: "alice.jr@example.com", status: "Active" },
            { id: 12, name: "Alice Kid", email: "alice.kid@example.com", status: "Inactive" }
          ]
        },
        {
          id: 2,
          name: "Bob",
          email: "bob@example.com",
          status: "Inactive",
          children: [
            { id: 21, name: "Bobby", email: "bobby@example.com", status: "Active" }
          ]
        },
        {
          id: 3,
          name: "Charlie",
          email: "charlie@example.com",
          status: "Active",
          children: [
            { id: 31, name: "Charlie Jr", email: "charlie.jr@example.com", status: "Active" },
            { id: 32, name: "C Kid", email: "c.kid@example.com", status: "Inactive" }
          ]
        }
      ]
    }
  },
  methods: {
    exportToExcel() {
      const flatten = []

      this.items.forEach(item => {
        flatten.push({
          ID: item.id,
          Name: item.name,
          Email: item.email,
          Status: item.status
        })
        if (item.children) {
          item.children.forEach(child => {
            flatten.push({
              ID: child.id,
              Name: child.name,
              Email: child.email,
              Status: child.status
            })
          })
        }
      })

      const worksheet = XLSX.utils.json_to_sheet(flatten)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "TableData")
      XLSX.writeFile(workbook, "table-data.xlsx")
    }
  }
}
</script>
