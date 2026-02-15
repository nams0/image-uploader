import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import styles from "./Result.module.css"
import { BsImages } from "react-icons/bs"
import ImageCard from "./ImageCard"
import { resetUploads } from "../features/upload/uploadSlice"
import e2p from "../utils/e2p"

function Result({ files = [], setFiles }) {
  const store = useSelector((store) => store.uploader)
  const dispatch = useDispatch()
  const [previewUrls, setPreviewUrls] = useState({})

  const handleRemoveAll = () => {
    setFiles([])

    // Clean up ALL preview URLs
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls({})
    dispatch(resetUploads())
  }

  // Create a combined list with unique identifiers
  const createAllFilesList = () => {
    const combinedFiles = []
    const addedFileNames = new Set()

    store.fileInfos.forEach((file, index) => {
      const fileWithMeta = {
        ...file,
        uniqueKey: `redux_${file.name}_${index}`,
        isFromRedux: true,
      }
      combinedFiles.push(fileWithMeta)
      addedFileNames.add(file.name)
    })

    // Add local files that aren't already in Redux
    files.forEach((file, index) => {
      if (!addedFileNames.has(file.name)) {
        // Make sure to pass the actual File object
        const fileWithMeta =
          file instanceof File ? file : new File([file], file.name)
        combinedFiles.push({
          ...fileWithMeta,
          name: file.name,
          uniqueKey: `local_${file.name}_${index}`,
          isFromRedux: false,
          localIndex: index,
        })
      }
    })

    return combinedFiles
  }

  const allFiles = createAllFilesList()

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
                  ? `${e2p(allFiles.length)} عکس در آلبوم`
                  : "هنوز عکسی آپلود نشده"}
              </p>
            </div>
          </div>

          {allFiles.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className={styles.removeAllButton}
            >
              حذف همه
            </button>
          )}
        </div>

        {allFiles.length > 0 ? (
          <div className={styles.imagesGrid}>
            {allFiles.map((file) => {
              if (!file) return null

              // Pass the actual File object for local files
              const fileToPass = file.isFromRedux
                ? file
                : files.find((f) => f.name === file.name) || file

              return (
                <ImageCard
                  key={file.uniqueKey}
                  fileInfo={fileToPass}
                  index={file.localIndex || 0}
                  previewUrls={previewUrls}
                  setPreviewUrls={setPreviewUrls}
                  setFiles={setFiles}
                  isFromRedux={file.isFromRedux}
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
