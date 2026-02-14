import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { MdContentCopy, MdCheck } from "react-icons/md"

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
  const [albumUrl, setAlbumUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()
  const token = Cookies.get("auth-token")

  const albumUrlConstructor = (albumUrl) => setAlbumUrl(`http://localhost:3000/album/${albumUrl.split("share/")[1]}`)

  const handleUpload = async () => {
    if (!files || files.length === 0) return

    const formData = new FormData()

    dispatch(setUploading(true))
    dispatch(setError(""))

    // Append all files to FormData
    for (const file of files) {
      if (store.fileInfos.some((info) => info.name === file.name)) {
        continue
      }
      formData.append("images", file)
    }

    try {
      //  Upload all images at once
      const data = await api.post("/api/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (ProgressEvent) => {
          const percentCompleted = Math.round(
            (ProgressEvent.loaded * 100) / ProgressEvent.total,
          )
          // Optional: dispatch overall progress
        },
      })

      console.log("Upload data:", data)

      // Extract albumUrl from response
      if (data?.albumUrl) {
        albumUrlConstructor(data.albumUrl)
      }

      // Add all uploaded images to Redux with proper name mapping
      data.images?.forEach((img) => {
        dispatch(addFileUrl(img.url))
        dispatch(addDownloadUrl(img.downloadUrl))
        dispatch(
          addFileInfo({
            ...img,
            name: img.originalName || img.filename || "Unknown", // Map to 'name'
          }),
        )
      })

      // Clear local files after successful upload
      setFiles([])

      dispatch(setUploaded(true))
    } catch (err) {
      console.error("Upload error:", err)
      if (err.response) {
        if (err.response.status === 429) {
          dispatch(
            setError(
              "تعداد درخواست‌های شما زیاد بوده است. لطفاً یک ساعت دیگر تلاش کنید",
            ),
          )
        } else {
          dispatch(
            setError(
              "خطا در آپلود فایل: " + (err.response.data?.error || err.message),
            ),
          )
        }
      } else {
        dispatch(setError("خطا در اتصال به سرور"))
      }
    } finally {
      dispatch(setUploading(false))
    }
  }

  // Copy to clipboard handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(albumUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

        {/* Show album link after upload */}
        {store.uploaded && albumUrl && (
          <div className={styles.shareContainer}>
            <p className={styles.shareLabel}>لینک آلبوم شما:</p>
            <div className={styles.shareBox}>
              <input
                type="text"
                value={albumUrl}
                readOnly
                className={styles.shareInput}
              />
              <button
                onClick={handleCopyLink}
                className={styles.copyBtn}
                title="کپی لینک"
              >
                {copied ? <MdCheck size={20} /> : <MdContentCopy size={20} />}
              </button>
            </div>
            <p className={styles.shareHint}>
              {copied
                ? "✅ لینک کپی شد!"
                : "این لینک را با دیگران به اشتراک بگذارید"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPage
