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

function Dropzone({ files, setFiles }) {
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 3 * 1024 * 1024, // 3MB
    onDrop: (acceptedFiles) => {
      dispatch(setError(""))
      console.log(acceptedFiles)
      handleUpload()
      // Add new files to existing files
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
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
    if (!files || files.length === 0) return

    dispatch(setUploading(true))
    dispatch(setError(""))

    // Upload all files
    for (const file of files) {
      // Skip if file is already uploaded
      if (store.fileInfos.some((info) => info.name === file.name)) {
        continue
      }

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
            dispatch(
              setUploadProgress({
                fileName: file.name,
                progress: percentCompleted,
              })
            )
          },
        })

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

  return (
    <div>
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

      {store.error && <p className="error">{store.error}</p>}
    </div>
  )
}

export default Dropzone
