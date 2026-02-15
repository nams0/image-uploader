import { LuUpload } from "react-icons/lu"
import { VscGithubAlt } from "react-icons/vsc"
import { LuLogOut } from "react-icons/lu"
import { BiPhotoAlbum } from "react-icons/bi"
import { FaRegUser } from "react-icons/fa6"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useState, useEffect, useRef } from "react"
import api from "../services/api"

import styles from "./Navbar.module.css"

function Navbar({ files, setFiles }) {
  const [token, setToken] = useState(Cookies.get("auth-token"))
  const [albumId, setAlbumId] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchUserAlbum = async () => {
      if (!token) return

      try {
        const data = await api.get("/api/albums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (data?.id) {
          setAlbumId(data.id)
        }
      } catch (err) {
        console.error("Error fetching album:", err)
      }
    }

    fetchUserAlbum()
  }, [token, files])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const logoutHandler = () => {
    setToken(Cookies.remove("auth-token", { path: "/" }))
    setFiles([])
    setAlbumId(null)
    setDropdownOpen(false)
  }

  const handleAlbumClick = () => {
    if (albumId) {
      navigate(`/album/${albumId}`)
      setDropdownOpen(false)
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LuUpload />
        اشتراک پیک
      </div>
      <div className={styles.btnsContainer}>
        <a
          href="https://github.com/nams0"
          target="_blank"
          className={styles.githubBtn}
        >
          Namso
          <VscGithubAlt strokeWidth="1px" />
        </a>

        {token ? (
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button className={styles.profile} onClick={toggleDropdown}>
              <FaRegUser />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownContent}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleAlbumClick}
                  disabled={!albumId}
                >
                  <span className={styles.album}>
                    <BiPhotoAlbum />
                    آلبوم
                  </span>
                </button>
                <button className={styles.dropdownItem} onClick={logoutHandler}>
                  <span className={styles.logout}>
                    <LuLogOut />
                    خروج
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.login}>
            ورود
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
