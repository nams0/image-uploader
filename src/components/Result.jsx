import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import styles from "./Result.module.css"
import { BsImages } from "react-icons/bs"
import ImageCard from "./ImageCard"

function Result({ files, setFiles }) {
  const store = useSelector((store) => store.uploader)
  const [previewUrls, setPreviewUrls] = useState({})

  const handleRemoveAll = () => {
    setFiles([])
    // Also clean up the preview URLs
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls({})
  }

  // Combine uploaded files with selected but not uploaded files with duplicate prevention
  const allFiles = [
    ...store.fileInfos,
    ...files.filter(
      (file) => !store.fileInfos.some((info) => info.name === file.name)
    ),
  ]

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
              <p className={styles.albumInfoCount}>
                {allFiles.length > 0
                  ? `${allFiles.length} عکس در آلبوم`
                  : "هنوز عکسی آپلود نشده"}
              </p>
            </div>
          </div>

          {allFiles.length > 0 && (
            <button onClick={handleRemoveAll}>حذف همه</button>
          )}
        </div>

        {allFiles.length > 0 ? (
          <div className={styles.imagesGrid}>
            {allFiles.map((file, index) => {
              // Fix: Ensure fileInfo is always a valid object
              if (!file) return null;
              
              const fileInfo = file.name 
                ? file // It's already a file object
                : { name: `عکس ${index + 1}`, ...file } // Create a proper object

              return (
                <ImageCard
                  key={fileInfo.name || `file-${index}`}
                  fileInfo={fileInfo}
                  index={index}
                  previewUrls={previewUrls}
                  setPreviewUrls={setPreviewUrls}
                  setFiles={setFiles}
                />
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyResult}>
            <div className={styles.emptyResultIcon}>
              <BsImages />
            </div>
            <div className={styles.emptyResultText}>
              <p className={styles.emptyResultTitle}>هنوز عکسی آپلود نشده</p>
              <p>عکس‌های خود را به کمک بخش بالا آپلود کنید</p>
              <div className={styles.emptyResultFeatures}>
                <p>✓ بگیر و رها کن</p>
                <p>✓ انتخاب چندین عکس</p>
                <p>✓ ردیابی فرایند</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result