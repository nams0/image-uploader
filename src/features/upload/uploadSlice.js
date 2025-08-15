import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  uploading: false,
  uploaded: false,
  fileUrl: "",
  downloadUrl: "",
  fileInfo: null,
  error: "",
  uploadProgress: 0,
}

const slice = createSlice({
  name: "uploader",
  initialState,
  reducers: {
    setUploading: (state, action) => {
      state.uploading = action.payload
    },
    setUploaded: (state, action) => {
      state.uploaded = action.payload
    },
    setFileUrl: (state, action) => {
      state.fileUrl = action.payload
    },
    setDownloadUrl: (state, action) => {
      state.downloadUrl = action.payload
    },
    setFileInfo: (state, action) => {
      state.fileInfo = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
  },
})

export default slice.reducer

export const {
  setUploading,
  setUploaded,
  setFileUrl,
  setDownloadUrl,
  setFileInfo,
  setError,
  setUploadProgress,
} = slice.actions
