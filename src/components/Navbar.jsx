import { LuUpload } from "react-icons/lu"
import { VscGithubAlt } from "react-icons/vsc"
import { LuLogOut } from "react-icons/lu"
import { BiPhotoAlbum } from "react-icons/bi"

import { FaRegUser } from "react-icons/fa6"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import styles from "./Navbar.module.css"
import { useState } from "react"

function Navbar({ setFiles }) {
  const [token, setToken] = useState(Cookies.get("auth-token"))

  const logoutHandler = () => {
    setToken(Cookies.remove("auth-token", { path: "/" }))
    setFiles([])
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
                <Link to="/album" className={styles.dropdownItem}>
                  <span className={styles.album}>
                    آلبوم
                    <BiPhotoAlbum />
                  </span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <p className={styles.dropdownItem} onClick={logoutHandler}>
                  <span className={styles.logout}>
                    خروج
                    <LuLogOut />
                  </span>
                </p>
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
