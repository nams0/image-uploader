import { FiUser, FiMail } from "react-icons/fi"
import { MdOutlineLock, MdErrorOutline } from "react-icons/md"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { IoArrowBack } from "react-icons/io5"

import styles from "./SignupForm.module.css"

import { useState, useRef } from "react"
import validation from "../utils/signupValidation"

import autoAnimate from "@formkit/auto-animate"

import api from "../services/api"

const usernameRegex = /[^A-Za-z0-9_]/g
const englishRegex = /[^A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g

function SignupForm() {
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
  const formRef = useRef(null)

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
        email: value.replace(englishRegex, ""),
      }))
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setErrors({})
    validation(user, setErrors)
    console.log(user)

    if (Object.keys(errors).length === 0) {
      api
        .post("/api/auth/register", user, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
    }
  }

  return (
    <div>
      <div ref={autoAnimate}>
        {Object.keys(errors).length > 0 && (
          <div className={styles.errorBox}>
            <MdErrorOutline />
            {errors.fillInputs && <p>لطفا همه فیلدها را پر کنید</p>}
            {errors.incorrectEmail && <p>ایمیل وارد شده صحیح نیست</p>}
            {errors.incorrectPassword && (
              <p>رمز عبور وارد شده مطابق الگو نیست</p>
            )}
            {errors.incorrectConfirmPassword && (
              <p> رمز عبور تکرار شده درست نیست</p>
            )}
          </div>
        )}
      </div>
      <div className={styles.formContainer}>
        <form ref={formRef}>
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
