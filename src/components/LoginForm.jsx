import styles from "./LoginForm.module.css"

import { FiEye, FiEyeOff } from "react-icons/fi"
import { FiMail } from "react-icons/fi"
import { MdOutlineLock, MdErrorOutline } from "react-icons/md"

import { IoArrowBack } from "react-icons/io5"

import { Link } from "react-router-dom"

import { useState } from "react"

import { motion } from "framer-motion"

import validation from "../utils/loginValidation"

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  console.log(user)
  console.log(errors)

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value.trim()
    setUser({ ...user, [name]: value })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setErrors({})
    validation(user, setErrors)
  }

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState)
  }

  return (
    <div>
      <motion.div
        className={styles.errorBox}
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{
          opacity: Object.keys(errors).length > 0 ? 1 : 0,
          y: Object.keys(errors).length > 0 ? 0 : -20,
          height: Object.keys(errors).length > 0 ? "auto" : 0,
        }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {Object.keys(errors).length > 0 && (
          <motion.div
            style={{ display: "flex" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <MdErrorOutline />
            <p>لطفا همه فیلدها را پر کنید</p>
          </motion.div>
        )}
      </motion.div>

      <div className={styles.formContainer}>
        <form>
          <div className={styles.inputContainer}>
            <p>ایمیل</p>
            <div className={errors.email ? styles.inputError : styles.inputs}>
              <FiMail />
              <input
                type="text"
                name="email"
                placeholder="ایمیل را وارد کنید"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <p>رمز عبور</p>
            <div
              className={errors.password ? styles.inputError : styles.inputs}
            >
              <MdOutlineLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="رمز عبور را وارد کنید"
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => e.key === "Enter" && submitHandler(e)}
              />
              {showPassword ? (
                <FiEyeOff onClick={handleShowPassword} />
              ) : (
                <FiEye onClick={handleShowPassword} />
              )}
            </div>
          </div>
        </form>
        <button className={styles.submitBtn} onClick={submitHandler}>
          ورود به حساب
          <IoArrowBack />
        </button>
        <p>
          حساب نداری؟ <Link to="/signup">اینجا ثبت نام کن</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
