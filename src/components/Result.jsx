import { useSelector } from "react-redux"
import { useState, useEffect } from "react"

import styles from "./Result.module.css"

function Result({ file }) {
  const store = useSelector((store) => store.uploader)
  const [previewUrl, setPreviewUrl] = useState("") // State for the preview URL

  // Create object URL when file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Clean up the object URL when component unmounts
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [file])

  return (
    <div>
      <h4>عکس آپلود شده</h4>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          {previewUrl && <img src={previewUrl} alt="عکس آپلود شده" />}
        </div>
        {store.uploaded && (
          <div className="result">
            <h3>آپلود موفق!</h3>
            <div className="file-info">
              <p>نام فایل: {store.fileInfo.originalName}</p>
              <p>
                حجم فایل: {(store.fileInfo.size / (1024 * 1024)).toFixed(2)}{" "}
                مگابایت
              </p>
              <p>
                تاریخ آپلود:{" "}
                {new Date(store.fileInfo.uploadDate).toLocaleString("fa-IR")}
              </p>
            </div>

            <p>لینک عکس:</p>
            <input
              type="text"
              value={store.fileUrl}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={() => navigator.clipboard.writeText(store.fileUrl)}
            >
              کپی لینک
            </button>
            <p>
              <a href={store.fileUrl} target="_blank" rel="noopener noreferrer">
                مشاهده عکس
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result
