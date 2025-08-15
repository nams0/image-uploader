import { LuUpload } from "react-icons/lu"
import { VscGithubAlt } from "react-icons/vsc"

import styles from "./Navbar.module.css"

import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LuUpload />
        اشتراک پیک
      </div>
      <div>
        <button>
          Namso
          <VscGithubAlt strokeWidth="1px" />
        </button>
        <Link to="/login" className={styles.login}>ورود</Link>
      </div>
    </div>
  )
}

export default Navbar
