import Dropzone from "../components/Dropzone"

import styles from "./MainPage.module.css"

import Navbar from "../components/Navbar"
import Result from "../components/Result"

import { useState } from "react"

const MainPage = () => {
  const [file, setFile] = useState(null)

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>عکس مورد نظرت رو آپلود کن</h2>
        <p className={styles.description}>
          تصاویر خود را بکشید و رها کنید یا برای انتخاب کلیک کنید. ما از همه
          قالب‌های رایج تصویر پشتیبانی می‌کنیم فرایند آپلود را به صورت آنی با
          پیش‌نمایش‌ ارائه می‌دهیم
        </p>
        <Dropzone file={file} setFile={setFile} />
        <Result />
      </div>
    </div>
  )
}

export default MainPage
