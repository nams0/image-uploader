import { useState } from "react"

import { useDropzone } from "react-dropzone"

import { useDispatch, useSelector } from "react-redux"

import {
  setUploading,
  setUploaded,
  setFileUrl,
  setDownloadUrl,
  setFileInfo,
  setError,
  setUploadProgress,
} from "../features/upload/uploadSlice"

import api from "../services/api"

import { LuUpload } from "react-icons/lu"
import { CiImageOn } from "react-icons/ci"

import styles from "./Dropzone.module.css"

function Dropzone({ file, setFile }) {
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024, // 3MB
    onDrop: (acceptedFiles) => {
      dispatch(setError(""))
      console.log(acceptedFiles)
      setFile(acceptedFiles[0])
      dispatch(setUploaded(false))
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0].size > 3 * 1024 * 1024) {
        dispatch(setError("حجم فایل نباید بیشتر از 3 مگابایت باشد"))
      } else if (!rejectedFiles[0].type.startsWith("image/")) {
        dispatch(setError("فقط فایل‌های تصویری مجاز هستند"))
      } else {
        dispatch(setError("خطا در آپلود فایل"))
      }
    },
  })
}

export default Dropzone
