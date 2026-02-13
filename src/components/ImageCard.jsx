import { useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./ImageCard.module.css"

function ImageCard({ fileInfo, index, previewUrls, setPreviewUrls, setFiles }) {
  const store = useSelector((store) => store.uploader)
  
  // Add safety check for fileInfo
  if (!fileInfo) {
    return null;
  }

  const isUploaded = store.fileInfos.some((info) => info.name === fileInfo.name)

  // Create object URLs when files change
  useEffect(() => {
    if (fileInfo && fileInfo.name && fileInfo instanceof File) {
      if (!previewUrls[fileInfo.name]) {
        const newUrl = URL.createObjectURL(fileInfo)
        setPreviewUrls(prev => ({
          ...prev,
          [fileInfo.name]: newUrl
        }))
      }
    }
  }, [fileInfo, fileInfo?.name, previewUrls, setPreviewUrls])

  // Clean up the object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (fileInfo?.name && previewUrls[fileInfo.name]) {
        URL.revokeObjectURL(previewUrls[fileInfo.name])
      }
    }
  }, [])

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))

    // Clean up the preview URL
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName])
      setPreviewUrls(prev => {
        const newUrls = { ...prev }
        delete newUrls[fileName]
        return newUrls
      })
    }
  }

  return (
    <div className={styles.imageItem}>
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
            <span className={styles.pendingBadge}>در انتظار آپلود</span>
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
}

export default ImageCard