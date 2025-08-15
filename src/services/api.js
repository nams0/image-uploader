import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000",
})

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (reject) => {
    return Promise.reject(reject)
  }
)

api.interceptors.request.use(
  (request) => {
    return request
  },
  (reject) => {
    return Promise.reject(reject)
  }
)

export default api
