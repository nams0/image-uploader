import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import Dropzone from "../components/Dropzone"
import Navbar from "../components/Navbar"
import Result from "../components/Result"

import Cookies from "js-cookie"
import api from "../services/api"

import styles from "./MainPage.module.css"

import {
  setUploading,
  setUploaded,
  addFileUrl,
  addDownloadUrl,
  addFileInfo,
  setError,
  setUploadProgress,
} from "../features/upload/uploadSlice"

const MainPage = () => {
  const [files, setFiles] = useState([])
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()
  const token = Cookies.get("auth-token")

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
              (ProgressEvent.loaded * 100) / ProgressEvent.total,
            )
            dispatch(
              setUploadProgress({
                fileName: file.name,
                progress: percentCompleted,
              }),
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
                "تعداد درخواست‌های شما زیاد بوده است. لطفاً یک ساعت دیگر تلاش کنید",
              ),
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

  return (
    <div>
      <Navbar setFiles={setFiles} />
      <div className={styles.container}>
        <h2 className={styles.title}>عکس‌های مورد نظرت رو آپلود کن</h2>
        <p className={styles.description}>
          تصاویر خود را بکشید و رها کنید یا برای انتخاب کلیک کنید. ما از همه
          قالب‌های رایج تصویر پشتیبانی می‌کنیم فرایند آپلود را به صورت آنی با
          پیش‌نمایش‌ ارائه می‌دهیم
        </p>
        <Dropzone setFiles={setFiles} />
        <Result files={files} setFiles={setFiles} />

        {files.length > 0 && (
          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={store.uploading}
          >
            {store.uploading ? "در حال آپلود..." : `آپلود ${files.length} عکس`}
          </button>
        )}
      </div>
    </div>
  )
}

export default MainPage
