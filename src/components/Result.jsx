import { useSelector } from "react-redux"
import { useState, useEffect } from "react"

import styles from "./Result.module.css"

import { BsImages } from "react-icons/bs"

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
      <div className={styles.albumContainer}>
        <div className={styles.albumTitle}>
          <div className={styles.albumTitleContainer}>
            <div className={styles.albumTitleIcon}>
              <BsImages />
            </div>
            <div className={styles.albumInfo}>
              <p>عکس های شما</p>
              <p className={styles.albumInfoCount}>هنوز عکسی آپلود نشده</p>
            </div>
          </div>

          <button>حذف همه</button>
        </div>

        <div className={styles.emptyResult}>
          <div className={styles.emptyResultIcon}>
            <BsImages />
          </div>
          <div className={styles.emptyResultText}>
            <p className={styles.emptyResultTitle}>هنوز عکسی آپلود نشده</p>
            <p>اولین عکستو به کمک بخش بالا آپلود کن</p>
            <div className={styles.emptyResultFeatures}>
              <p>✓ بگیر و رها کن</p>
              <p>✓ انتخاب چندین عکس</p>
              <p>✓ ردیابی فرایند</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
