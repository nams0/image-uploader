import { FiUser, FiMail } from "react-icons/fi"
import { MdOutlineLock, MdErrorOutline } from "react-icons/md"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { IoArrowBack } from "react-icons/io5"

import styles from "./SignupForm.module.css"

import { useState } from "react"
import validation from "../utils/signupValidation"

import api from "../services/api"

import { motion } from "framer-motion"

import { replace, useNavigate } from "react-router-dom"

import Cookies from "js-cookie"

const usernameRegex = /[^A-Za-z0-9_]/g
const englishRegex = /[^A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g

function SignupForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const handleShowPassword = (password) => {
    password === "password"
      ? setShowPassword((prevState) => ({
          ...prevState,
          password: !prevState.password,
        }))
      : setShowPassword((prevState) => ({
          ...prevState,
          confirmPassword: !prevState.confirmPassword,
        }))
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value.trim()
    if (name === "username") {
      setUser((prevState) => ({
        ...prevState,
        username: value.replace(usernameRegex, ""),
      }))
    } else if (name === "email") {
      setUser((prevState) => ({
        ...prevState,
        email: value.toLowerCase().replace(englishRegex, ""),
      }))
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    const isValid = validation(user, setErrors)
    console.log(isValid)

    if (isValid) {
      try {
        const { token } = await api.post("/api/auth/register", user, {
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
        setErrors({ fetchError: error.response.data.error })
      }
    }
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
            {errors.fillInputs && <p>لطفا همه فیلدها را پر کنید</p>}
            {errors.incorrectEmail && !errors.fillInputs && (
              <p>ایمیل وارد شده صحیح نیست</p>
            )}
            {errors.incorrectPassword && !errors.fillInputs && (
              <p>رمز عبور وارد شده مطابق الگو نیست</p>
            )}
            {errors.incorrectConfirmPassword && !errors.fillInputs && (
              <p> رمز عبور تکرار شده درست نیست</p>
            )}
            {errors.fetchError && <p>{errors.fetchError}</p>}
          </motion.div>
        )}
      </motion.div>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.inputContainer}>
            <p>
              نام کاربری<span>*</span>
            </p>
            <div
              className={errors.username ? styles.inputError : styles.inputs}
            >
              <FiUser />
              <input
                type="text"
                name="username"
                value={user.username}
                placeholder="نام کاربری را وارد کنید"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <p>
              ایمیل<span>*</span>
            </p>
            <div className={errors.email ? styles.inputError : styles.inputs}>
              <FiMail />
              <input
                type="text"
                name="email"
                value={user.email}
                placeholder="ایمیل را وارد کنید"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <p>
              رمز عبور<span>*</span>
            </p>
            <div
              className={errors.password ? styles.inputError : styles.inputs}
            >
              <MdOutlineLock />
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={user.password}
                placeholder="رمز عبور را وارد کنید"
                onChange={handleChange}
              />

              {showPassword.password ? (
                <FiEyeOff onClick={() => handleShowPassword("password")} />
              ) : (
                <FiEye onClick={() => handleShowPassword("password")} />
              )}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <p>
              تکرار رمز عبور<span>*</span>
            </p>
            <div
              className={
                errors.confirmPassword ? styles.inputError : styles.inputs
              }
            >
              <MdOutlineLock />
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={user.confirmPassword}
                placeholder="تکرار رمز عبور را وارد کنید"
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && submitHandler(e)}
              />

              {showPassword.confirmPassword ? (
                <FiEyeOff
                  onClick={() => handleShowPassword("confirmPassword")}
                />
              ) : (
                <FiEye onClick={() => handleShowPassword("confirmPassword")} />
              )}
            </div>
          </div>
        </form>
        <div className={styles.info}>
          <p>* لطفا همه فیلد ها را به زبان انگلیسی پر کنید</p>
          <p>* نام کاربری فقط میتواند شامل حروف انگلیسی، عدد و خط تیره باشد</p>
          <p>
            * رمز عبور باید حداقل 8 کاراکتر باشد، دارای اعداد، حروف بزرگ و کوچک
            باشد و کاراکترهای خاص
          </p>
        </div>
        <button className={styles.submitBtn} onClick={submitHandler}>
          ساخت حساب
          <IoArrowBack />
        </button>
      </div>
    </div>
  )
}

export default SignupForm
