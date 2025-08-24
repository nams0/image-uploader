import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import styles from "./Result.module.css"
import { BsImages } from "react-icons/bs"

function Result({ files, setFiles }) {
  const store = useSelector((store) => store.uploader)
  const [previewUrls, setPreviewUrls] = useState({})

  // Create object URLs when files change
  useEffect(() => {
    if (files && files.length > 0) {
      const urls = {}
      files.forEach((file) => {
        if (!previewUrls[file.name]) {
          urls[file.name] = URL.createObjectURL(file)
        } else {
          urls[file.name] = previewUrls[file.name]
        }
      })
      setPreviewUrls(urls)
    }
  }, [files])

  // Clean up the object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const handleRemoveAll = () => {
    setFiles([])
    // Also clean up the preview URLs
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls({})
  }

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))

    // Clean up the preview URL
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName])
      const newUrls = { ...previewUrls }
      delete newUrls[fileName]
      setPreviewUrls(newUrls)
    }
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
              const fileInfo =
                typeof file === "object"
                  ? file
                  : { name: file.name || `عکس ${index + 1}` }
              const isUploaded = store.fileInfos.some(
                (info) => info.name === fileInfo.name
              )

              return (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={previewUrls[fileInfo.name] || "/placeholder-image.jpg"}
                    alt={fileInfo.name}
                    className={styles.imagePreview}
                  />
                  <div className={styles.imageInfo}>
                    <p className={styles.imageName}>{fileInfo.name}</p>
                    <div className={styles.imageStatus}>
                      {isUploaded ? (
                        <span className={styles.uploadedBadge}>آپلود شده</span>
                      ) : (
                        <span className={styles.pendingBadge}>
                          در انتظار آپلود
                        </span>
                      )}
                    </div>
                    {store.uploadProgress[fileInfo.name] !== undefined && (
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${store.uploadProgress[fileInfo.name]}%`,
                            }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>
                          {store.uploadProgress[fileInfo.name]}%
                        </span>
                      </div>
                    )}
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveFile(fileInfo.name)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
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
