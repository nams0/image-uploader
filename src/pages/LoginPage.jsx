import LoginForm from "../components/LoginForm"

import styles from "./LoginPage.module.css"

function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <h3 className={styles.loginTitle}>خوش اومدی !</h3>
      <p className={styles.loginDesc}>برای ادامه کار لطفا وارد حسابت شو</p>
      <LoginForm />
    </div>
  )
}

export default LoginPage
