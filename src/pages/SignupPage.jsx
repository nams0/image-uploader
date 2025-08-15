import SignupForm from "../components/SignupForm"

import styles from "./SignupPage.module.css"

function SignupPage() {
  return (
    <div className={styles.signupContainer}>
      <h3 className={styles.signupTitle}>حساب خودت رو بساز</h3>
      <p className={styles.signupDesc}>
        امروز به اشتراک پیک بپیوند و عکس های خودت رو آپلود کن
      </p>
      <div>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage
