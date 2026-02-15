import { LuUpload } from "react-icons/lu"
import { VscGithubAlt } from "react-icons/vsc"
import { LuLogOut } from "react-icons/lu"
import { BiPhotoAlbum } from "react-icons/bi"
import { FaRegUser } from "react-icons/fa6"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import api from "../services/api"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import styles from "./Navbar.module.css"

function Navbar({ setFiles }) {
  const [token, setToken] = useState(Cookies.get("auth-token"))
  const [albumId, setAlbumId] = useState(null)
  const navigate = useNavigate()

  // Fetch user's album ID when component mounts
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
  }, [token])

  const logoutHandler = () => {
    setToken(Cookies.remove("auth-token", { path: "/" }))
    setFiles([])
    setAlbumId(null)
  }

  const handleAlbumClick = () => {
    if (albumId) {
      navigate(`/album/${albumId}`)
    }
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={styles.profile}>
                <FaRegUser />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              className={styles.dropdownContent}
              sideOffset={5}
              align="center"
            >
              <DropdownMenu.Item asChild>
                <button
                  className={styles.dropdownItem}
                  onClick={handleAlbumClick}
                  disabled={!albumId}
                >
                  <span className={styles.album}>
                    آلبوم
                    <BiPhotoAlbum />
                  </span>
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button className={styles.dropdownItem} onClick={logoutHandler}>
                  <span className={styles.logout}>
                    خروج
                    <LuLogOut />
                  </span>
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
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
