const findFormats = (fileName) => {
  return fileName.toUpperCase().split(".").pop()
}

export default findFormats
