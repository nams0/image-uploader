import { configureStore } from "@reduxjs/toolkit"

import uploaderReducer from "../features/upload/uploadSlice"

import logger from "redux-logger"

const store = configureStore({
  reducer: { uploader: uploaderReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
