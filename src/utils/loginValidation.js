const validation = (user, setErrors) => {
  let isValid = true
  const newErrors = {}
  if (!user.email) {
    newErrors.email = true
    isValid = false
  }

  if (!user.password) {
    newErrors.password = true
    isValid = false
  }
  setErrors(newErrors)
  return isValid
}

export default validation
