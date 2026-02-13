import { useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./ImageCard.module.css"

function ImageCard({
  fileInfo,
  index,
  previewUrls,
  setPreviewUrls,
  setFiles,
  isFromRedux,
}) {
  const store = useSelector((store) => store.uploader)

  if (!fileInfo) {
    return null
  }

  const isUploaded =
    isFromRedux || store.fileInfos.some((info) => info.name === fileInfo.name)

  // Create object URLs when component mounts
  useEffect(() => {
    // Check if fileInfo is a File object and not from Redux
    if (!isFromRedux && fileInfo instanceof File) {
      // Create a unique key for this file
      const previewKey = fileInfo.name

      if (!previewUrls[previewKey]) {
        const newUrl = URL.createObjectURL(fileInfo)
        setPreviewUrls((prev) => ({
          ...prev,
          [previewKey]: newUrl,
        }))
      }
    }
  }, []) // Remove dependencies to only run once on mount

  // Clean up the object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (fileInfo?.name && previewUrls[fileInfo.name]) {
        URL.revokeObjectURL(previewUrls[fileInfo.name])
      }
    }
  }, [])

  const handleRemoveFile = (fileName) => {
    // Only allow removal of local files, not uploaded ones
    if (!isFromRedux) {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName),
      )

      if (previewUrls[fileName]) {
        URL.revokeObjectURL(previewUrls[fileName])
        setPreviewUrls((prev) => {
          const newUrls = { ...prev }
          delete newUrls[fileName]
          return newUrls
        })
      }
    }
  }

  // Get the appropriate image source
  const getImageSource = () => {
    // For Redux store files, use the URL if available
    if (isFromRedux && fileInfo.url) {
      return fileInfo.url
    }

    if (isFromRedux && store.downloadUrls && store.downloadUrls.length > 0) {
      // Try to find a matching URL - Fixed: check if url exists before using includes
      const matchingUrl = store.downloadUrls.find((url) => {
        if (url && typeof url === "string") {
          return url.includes(fileInfo.name)
        }
        return false
      })
      if (matchingUrl) return matchingUrl
    }

    // For local files, use preview URL
    if (previewUrls[fileInfo.name]) {
      return previewUrls[fileInfo.name]
    }

    return "/placeholder-image.jpg"
  }

  return (
    <div className={styles.imageItem}>
      <img
        src={getImageSource()}
        alt={fileInfo.name || "Image"}
        className={styles.imagePreview}
        onError={(e) => {
          console.error("Image failed to load:", fileInfo.name)
          e.target.src = "/placeholder-image.jpg"
        }}
      />
      <div className={styles.imageInfo}>
        <p className={styles.imageName}>{fileInfo.name || "Unknown"}</p>
        <div className={styles.imageStatus}>
          {isUploaded ? (
            <span className={styles.uploadedBadge}>آپلود شده</span>
          ) : (
            <span className={styles.pendingBadge}>در انتظار آپلود</span>
          )}
        </div>
        {store.uploadProgress[fileInfo.name] !== undefined &&
          store.uploadProgress[fileInfo.name] < 100 && (
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
        {/* Only show remove button for local files and when setFiles is available */}
        {!isFromRedux && setFiles && typeof setFiles === "function" && (
          <button
            className={styles.removeButton}
            onClick={() => handleRemoveFile(fileInfo.name)}
          >
            حذف
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageCard
