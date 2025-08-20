import Dropzone from "../components/Dropzone"

import styles from "./MainPage.module.css"

import Navbar from "../components/Navbar"
import Result from "../components/Result"

import { useState } from "react"

import { BsImages } from "react-icons/bs"

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

        <div className={styles.albumContainer}>
          <div className={styles.albumTitle}>
            <div className={styles.albumTitleContainer}>
              <div className={styles.albumTitleIcon}>
                <BsImages />
              </div>
              <div className={styles.albumInfo}>
                <p>عکس های شما</p>
                <p className={styles.albumInfoCount}>هنوز عکسی آپلود نشده</p>
              </div>
            </div>

            <button>حذف همه</button>
          </div>

          <div className={styles.emptyResult}>
            <div className={styles.emptyResultIcon}>
              <BsImages />
            </div>
            <div className={styles.emptyResultText}>
              <p className={styles.emptyResultTitle}>هنوز عکسی آپلود نشده</p>
              <p>اولین عکستو به کمک بخش بالا آپلود کن</p>
              <div className={styles.emptyResultFeatures}>
                <p>✓ بگیر و رها کن</p>
                <p>✓ انتخاب چندین عکس</p>
                <p>✓ ردیابی فرایند</p>
              </div>
            </div>
          </div>
          {file && <Result file={file} setFile={setFile} />}
        </div>
      </div>
    </div>
  )
}

export default MainPage
