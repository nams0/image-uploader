const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

const validation = (user, setErrors) => {
  if (!user.username) {
    setErrors({ username: true })
  }
  if (!user.email)
    setErrors((prevState) => ({
      ...prevState,
      email: true,
    }))
  if (!user.password)
    setErrors((prevState) => ({
      ...prevState,
      password: true,
    }))
  if (!user.confirmPassword)
    setErrors((prevState) => ({
      ...prevState,
      confirmPassword: true,
    }))

  if (!user.username || !user.email || !user.password || !user.confirmPassword)
    return setErrors((prevState) => ({ ...prevState, fillInputs: true }))

  if (!emailRegex.test(user.email))
    return setErrors((prevState) => ({
      ...prevState,
      email: true,
      incorrectEmail: true,
    }))

  if (passwordRegex.test(user.password))
    return setErrors((prevState) => ({
      ...prevState,
      password: true,
      incorrectPassword: true,
    }))

  if (user.password !== user.confirmPassword)
    return setErrors((prevState) => ({
      ...prevState,
      confirmPassword: true,
      incorrectConfirmPassword: true,
    }))
}

export default validation
