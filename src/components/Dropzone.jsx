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

  const handleUpload = async () => {
    if (!file) return

    dispatch(setUploading(true))
    dispatch(setError(""))

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          const percentCompleted = Math.round(
            (ProgressEvent.loaded * 100) / ProgressEvent.total
          )
          dispatch(setUploadProgress(percentCompleted))
        },
      })

      dispatch(setFileUrl(response.url))
      dispatch(setDownloadUrl(response.downloadUrl))
      dispatch(setFileInfo(response.fileInfo))
      dispatch(setUploaded(true))
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          dispatch(
            setError(
              "تعداد درخواست‌های شما زیاد بوده است. لطفاً یک ساعت دیگر تلاش کنید"
            )
          )
        } else {
          dispatch(setError("خطا در آپلود فایل: " + err.response.error))
        }
      } else {
        dispatch(setError("خطا در اتصال به سرور"))
      }
    } finally {
      dispatch(setUploading(false))
    }
  }
  return (
    <div>
      <div {...getRootProps()} className={styles.dropzone}>
        <LuUpload className={styles.uploadIcon} />
        <input {...getInputProps()} />
        <p className={styles.dropzoneText}>عکس را اینجا رها کنید</p>
        <p>یا برای انتخاب کلیک کنید</p>
        <div className={styles.selectButton}>
          <CiImageOn strokeWidth={0.5} />
          <p>انتخاب عکس</p>
        </div>
        <p className="limit-info">حداکثر حجم فایل: ۳ مگابایت</p>
      </div>

      {store.error && <p className="error">{store.error}</p>}

      {file && !store.uploaded && (
        <button onClick={handleUpload} disabled={store.uploading}>
          {store.uploading ? "در حال آپلود..." : "آپلود عکس"}
        </button>
      )}
    </div>
  )
}

export default Dropzone
