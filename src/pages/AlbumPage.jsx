import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import styles from "./AlbumPage.module.css"
import { BsDownload, BsShare, BsImages, BsTrash3 } from "react-icons/bs"
import { TbFaceIdError } from "react-icons/tb"
import { LuUpload } from "react-icons/lu"
import e2p from "../utils/e2p"

function AlbumPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const token = Cookies.get("auth-token")

  useEffect(() => {
    fetchAlbumData()
  }, [albumId])

  const fetchAlbumData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:5000/api/albums/share/${albumId}`,
      )
      setAlbum(response.data)

      // Check if current user owns this album
      if (token) {
        try {
          const userAlbumRes = await axios.get(
            "http://localhost:5000/api/albums",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          setIsOwner(userAlbumRes.data?.id === parseInt(albumId))
        } catch (err) {
          setIsOwner(false)
        }
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching album:", err)
      setError("آلبوم یافت نشد یا خطایی رخ کرده است")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAlbum = async () => {
    try {
      await axios.delete("http://localhost:5000/api/albums", {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate("/")
    } catch (err) {
      alert("خطا در حذف آلبوم. لطفاً دوباره تلاش کنید.")
    }
  }

  const handleDownload = async (image) => {
    try {
      const response = await axios.get(
        `http://localhost:5000${image.downloadUrl}`,
        { responseType: "blob" },
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", image.originalName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading image:", err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadAll = async () => {
    for (const image of album.images) {
      await handleDownload(image)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری آلبوم...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <TbFaceIdError className={styles.errorIcon} />
        <h2>{error}</h2>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          بازگشت به صفحه اصلی
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate("/")} className={styles.logo}>
          <LuUpload />
        </button>

        <div className={styles.headerActions}>
          <button onClick={handleShare} className={styles.shareButton}>
            <BsShare />
            {copied ? "کپی شد!" : "اشتراک‌گذاری"}
          </button>

          {album?.images?.length > 1 && (
            <button
              onClick={handleDownloadAll}
              className={styles.downloadAllButton}
            >
              <BsDownload />
              دانلود همه
            </button>
          )}
        </div>
      </div>

      <div className={styles.album}>
        {/* Album Info */}
        <div className={styles.albumInfo}>
          <div className={styles.albumDetails}>
            <div className={styles.albumIcon}>
              <BsImages />
            </div>
            <div className={styles.info}>
              <p>{e2p(album?.totalImages) || 0} عکس</p>
              <p className={styles.albumDate}>
                {album?.images?.[0]?.uploadDate &&
                  new Date(album.images[0].uploadDate).toLocaleDateString(
                    "fa-IR",
                  )}
              </p>
            </div>
          </div>
          {/* Delete Button - Only for Owner */}
          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteAlbumBtn}
              title="حذف آلبوم"
            >
              <BsTrash3 />
            </button>
          )}
        </div>

        {/* Image Grid */}
        <div className={styles.imageGrid}>
          {album?.images?.map((image) => (
            <div key={image.id} className={styles.imageCard}>
              <img
                src={image.url}
                alt={image.originalName}
                className={styles.image}
                onClick={() => setSelectedImage(image)}
              />
              <div className={styles.imageOverlay}>
                <p className={styles.imageName}>{image.originalName}</p>
                <p className={styles.imageSize}>
                  {(image.size / 1024).toFixed(2)}
                  <span className={styles.unit}>KB</span>
                </p>
                <button
                  onClick={() => handleDownload(image)}
                  className={styles.downloadButton}
                >
                  <BsDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <div className={styles.lightboxContent}>
            <img
              src={selectedImage.url}
              alt={selectedImage.originalName}
              className={styles.lightboxImage}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(selectedImage)
              }}
              className={styles.lightboxDownload}
            >
              <BsDownload /> دانلود
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              className={styles.lightboxClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className={styles.deleteModal}
            onClick={(e) => e.stopPropagation()}
          >
            <BsTrash3 className={styles.deleteIcon} />
            <h3>حذف آلبوم</h3>
            <p>آیا مطمئن هستید که می‌خواهید کل آلبوم را حذف کنید؟</p>
            <p className={styles.warning}>این عمل قابل بازگشت نیست!</p>
            <div className={styles.modalActions}>
              <button onClick={handleDeleteAlbum} className={styles.confirmBtn}>
                بله، حذف کن
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelBtn}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlbumPage
