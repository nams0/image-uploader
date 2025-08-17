const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

const validation = (user, setErrors) => {
  let isValid = true
  const newErrors = {}

  if (!user.username) {
    newErrors.username = true
    isValid = false
  }
  if (!user.email) {
    newErrors.email = true
    isValid = false
  }
  if (!user.password) {
    newErrors.password = true
    isValid = false
  }
  if (!user.confirmPassword) {
    newErrors.confirmPassword = true
    isValid = false
  }

  if (
    !user.username ||
    !user.email ||
    !user.password ||
    !user.confirmPassword
  ) {
    newErrors.fillInputs = true
    isValid = false
  }

  if (user.email && !emailRegex.test(user.email)) {
    newErrors.email = true
    newErrors.incorrectEmail = true
    isValid = false
  }

  if (user.password && !passwordRegex.test(user.password)) {
    newErrors.password = true
    newErrors.incorrectPassword = true
    isValid = false
  }

  if (user.password !== user.confirmPassword) {
    newErrors.confirmPassword = true
    newErrors.incorrectConfirmPassword = true
    isValid = false
  }

  setErrors(newErrors)
  return isValid
}

export default validation
