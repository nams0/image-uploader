import styles from "./LoginForm.module.css"

import { FiEye, FiEyeOff } from "react-icons/fi"
import { FiMail } from "react-icons/fi"
import { MdOutlineLock, MdErrorOutline } from "react-icons/md"

import { IoArrowBack } from "react-icons/io5"

import { Link, useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import validation from "../utils/loginValidation"

import api from "../services/api"

import Cookies from "js-cookie"

function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const token = Cookies.get("auth-token")
    if (token) navigate("/", { replace: true })
  }, [])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value.trim()
    setUser({ ...user, [name]: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    const isValid = validation(user, setErrors)
    if (isValid) {
      try {
        const { token } = await api.post("/api/auth/login", user, {
          headers: { "Content-Type": "application/json" },
        })

        Cookies.set("auth-token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
          path: "/",
        })

        navigate("/", { replace: true })
      } catch (error) {
        setErrors({ fetchError: error.response.data.message })
      }
    }
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
            {!errors.email ||
              (!errors.password && <p>لطفا همه فیلدها را پر کنید</p>)}
            {errors.fetchError && <p>{errors.fetchError}</p>}
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
