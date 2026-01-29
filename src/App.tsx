// src/App.tsx
import { Route, Routes } from "react-router-dom"
import { Suspense, lazy } from "react"

// 🔥 Lazy-loaded pages (code splitting)
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Profile = lazy(() => import("./pages/Profile"))
const AuthCallback = lazy(() => import("./pages/AuthCallback"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Upload = lazy(() => import("./pages/Upload"))
const EditorPage = lazy(() => import("./pages/Editor")) // ← HEAVY 3D PAGE
const Dashboard = lazy(() => import("./pages/Dashboard"))

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Suspense shows fallback while a page chunk loads */}
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
