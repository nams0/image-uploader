import { useDropzone } from "react-dropzone"

import { useDispatch, useSelector } from "react-redux"

import {
  setUploading,
  setUploaded,
  addFileUrl,
  addDownloadUrl,
  addFileInfo,
  setError,
  setUploadProgress,
} from "../features/upload/uploadSlice"

import api from "../services/api"

import { LuUpload } from "react-icons/lu"
import { CiImageOn } from "react-icons/ci"

import styles from "./Dropzone.module.css"

import Cookies from "js-cookie"

import { useNavigate } from "react-router-dom"

function Dropzone({ files, setFiles }) {
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const token = Cookies.get("auth-token")

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    onDrop: (acceptedFiles) => {
      if (!token) {
        navigate("/login")
        return
      }
      dispatch(setError(""))
      console.log(acceptedFiles)

      // Add new files to existing files
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0].errors[0].code === "file-too-large") {
        dispatch(setError("حجم فایل نباید بیشتر از 3 مگابایت باشد"))
      } else if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
        dispatch(setError("فقط فایل‌های تصویری مجاز هستند"))
      } else {
        dispatch(setError("خطا در آپلود فایل"))
      }
    },
  })

  const handleUpload = async () => {
    if (!files || files.length === 0) return
    
    const formData = new FormData()

    dispatch(setUploading(true))
    dispatch(setError(""))

    // Upload all files
    for (const file of files) {
      // Skip if file is already uploaded
      if (store.fileInfos.some((info) => info.name === file.name)) {
        continue
      }

      formData.append("images", file)

      try {
        const response = await api.post("/api/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (ProgressEvent) => {
            const percentCompleted = Math.round(
              (ProgressEvent.loaded * 100) / ProgressEvent.total
            )
            dispatch(
              setUploadProgress({
                fileName: file.name,
                progress: percentCompleted,
              })
            )
          },
        })

        console.log(response)
        dispatch(addFileUrl(response.url))
        dispatch(addDownloadUrl(response.downloadUrl))
        dispatch(addFileInfo({ ...response.fileInfo, name: file.name }))
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
        break // Stop uploading if there's an error
      }
    }

    dispatch(setUploaded(true))
    dispatch(setUploading(false))
  }

  const clickHandler = () => {
    if (!token) navigate("/login")
  }

  return (
    <div>
      {!token ? (
        <div
          {...getRootProps()}
          className={styles.dropzone}
          onClick={clickHandler}
        >
          <LuUpload className={styles.uploadIcon} />
          <input {...getInputProps()} multiple />
          <p className={styles.dropzoneText}>عکس‌ها را اینجا رها کنید</p>
          <p>یا برای انتخاب کلیک کنید</p>
          <div className={styles.selectButton}>
            <CiImageOn strokeWidth={0.5} />
            <p>انتخاب عکس‌ها</p>
          </div>
          <p className="limit-info">حداکثر حجم هر فایل: ۳ مگابایت</p>
        </div>
      ) : (
        <div {...getRootProps()} className={styles.dropzone}>
          <LuUpload className={styles.uploadIcon} />
          <input {...getInputProps()} multiple />
          <p className={styles.dropzoneText}>عکس‌ها را اینجا رها کنید</p>
          <p>یا برای انتخاب کلیک کنید</p>
          <div className={styles.selectButton}>
            <CiImageOn strokeWidth={0.5} />
            <p>انتخاب عکس‌ها</p>
          </div>
          <p className="limit-info">حداکثر حجم هر فایل: ۳ مگابایت</p>
        </div>
      )}

      {store.error && <p className="error">{store.error}</p>}

      <button onClick={handleUpload} disabled={store.uploading}>
        {store.uploading ? "در حال آپلود..." : `آپلود ${files.length} عکس`}
      </button>
    </div>
  )
}

export default Dropzone
