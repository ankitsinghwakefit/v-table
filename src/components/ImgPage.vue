<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>
        File Upload with API + Progress
      </v-card-title>

      <v-card-text>
        <!-- File input -->
        <v-file-input
            v-model="fileInput"
            multiple
            label="Select files"
            show-size
            counter
            prepend-icon="mdi-upload"
            outlined
            @change="prepareSelectedFiles"
            ></v-file-input>


        <!-- Selected files (before upload) -->
        <div v-if="files.length" class="mt-4">
          <h3>Selected Files:</h3>
          <v-list two-line>
            <v-list-item v-for="(file, index) in files" :key="index">
              <v-list-item-avatar>
                <v-icon v-if="!file.preview">mdi-file</v-icon>
                <v-img v-else :src="file.preview" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ file.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatSize(file.size) }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="removeSelectedFile(index)" :disabled="isUploading">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>

        <!-- Upload progress -->
        <div v-if="uploadingFiles.length" class="mt-4">
          <h3>Uploading...</h3>
          <v-list>
            <v-list-item v-for="(file, index) in uploadingFiles" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ file.name }}</v-list-item-title>
                <v-progress-linear
                  :value="file.progress"
                  height="8"
                  color="blue"
                  striped
                  rounded
                ></v-progress-linear>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>

        <!-- Uploaded files -->
        <div v-if="uploadedFiles.length" class="mt-4">
          <h3>Uploaded Files:</h3>
          <v-list two-line>
            <v-list-item v-for="(file, index) in uploadedFiles" :key="index">
              <v-list-item-avatar>
                <v-icon v-if="!isImage(file)">mdi-file</v-icon>
                <v-img v-else :src="file.preview" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ file.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ file.size }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="removeUploadedFile(index)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          @click="uploadFiles"
          :disabled="!files.length || isUploading"
        >
          <v-icon left>mdi-cloud-upload</v-icon>
          <span v-if="!isUploading">Upload</span>
          <span v-else>Uploading...</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
        fileInput: [],   // raw files from v-file-input
        files: [],       // processed files with preview
        uploadingFiles: [],
        uploadedFiles: [],
        isUploading: false
    }
  },
  methods: {
    prepareSelectedFiles(selected) {
    if (!selected || !selected.length) return

    // Convert to preview objects
    const newFiles = Array.from(selected).map(file => {
      let preview = null
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file)
      }
      return Object.assign(file, { preview })
    })

    // Append instead of replacing
    this.files = [...this.files, ...newFiles]

    // Clear v-file-input model so it can re-trigger @change for same file
    this.fileInput = []
  },

    async uploadFiles() {
      if (!this.files.length) return
      this.isUploading = true

      // move files to uploading list
      this.uploadingFiles = this.files.map(f => ({
        file: f,
        name: f.name,
        progress: 0
      }))
      this.files = []

      for (let fileObj of this.uploadingFiles) {
        await this.uploadSingleFile(fileObj)
      }

      this.uploadingFiles = []
      this.isUploading = false
    },

    async uploadSingleFile(fileObj) {
      const formData = new FormData()
      formData.append("file", fileObj.file)
        console.log('formData', formData)
      try {
        const response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: e => {
            fileObj.progress = Math.round((e.loaded * 100) / e.total)
          }
        })

        this.uploadedFiles.push({
          name: fileObj.file.name,
          size: this.formatSize(fileObj.file.size),
          type: fileObj.file.type,
          preview: fileObj.file.preview || null
        })

        console.log("Uploaded:", response.data)
      } catch (error) {
        console.error("Upload failed:", error)
        alert(`Upload failed for ${fileObj.name}`)
      }
    },

    formatSize(bytes) {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    },
    isImage(file) {
      return file.type && file.type.startsWith("image/")
    },
    removeSelectedFile(index) {
      this.files.splice(index, 1)
    },
    removeUploadedFile(index) {
      this.uploadedFiles.splice(index, 1)
    }
  }
}
</script>
