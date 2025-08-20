import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  uploading: false,
  uploaded: false,
  fileUrls: [],
  downloadUrls: [],
  fileInfos: [],
  error: "",
  uploadProgress: {}, // Object to track progress of each file
}

export const uploadSlice = createSlice({
  name: "uploader",
  initialState,
  reducers: {
    setUploading: (state, action) => {
      state.uploading = action.payload
    },
    setUploaded: (state, action) => {
      state.uploaded = action.payload
    },
    addFileUrl: (state, action) => {
      state.fileUrls.push(action.payload)
    },
    addDownloadUrl: (state, action) => {
      state.downloadUrls.push(action.payload)
    },
    addFileInfo: (state, action) => {
      state.fileInfos.push(action.payload)
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUploadProgress: (state, action) => {
      const { fileName, progress } = action.payload
      state.uploadProgress[fileName] = progress
    },
    resetUploads: (state) => {
      state.fileUrls = []
      state.downloadUrls = []
      state.fileInfos = []
      state.uploadProgress = {}
      state.uploaded = false
    },
  },
})

export const {
  setUploading,
  setUploaded,
  addFileUrl,
  addDownloadUrl,
  addFileInfo,
  setError,
  setUploadProgress,
  resetUploads,
} = uploadSlice.actions

export default uploadSlice.reducer
