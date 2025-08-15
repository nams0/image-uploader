const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

const validation = (user, setErrors) => {
  if (!user.email) setErrors((prevState) => ({ ...prevState, email: true }))

  if (!user.password)
    setErrors((prevState) => ({ ...prevState, password: true }))
  return
}

export default validation
