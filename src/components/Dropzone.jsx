import { useDropzone } from "react-dropzone"

import { useDispatch, useSelector } from "react-redux"

import { setError } from "../features/upload/uploadSlice"

import { LuUpload } from "react-icons/lu"
import { CiImageOn } from "react-icons/ci"

import styles from "./Dropzone.module.css"

import Cookies from "js-cookie"

import { useNavigate } from "react-router-dom"

function Dropzone({ setFiles }) {
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
    </div>
  )
}

export default Dropzone
