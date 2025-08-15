import { Route, Routes, Navigate } from "react-router-dom"
import MainPage from "./pages/MainPage"

import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
