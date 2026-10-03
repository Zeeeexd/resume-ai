import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import AnalysisResult from './pages/AnalysisResult'
import History from './pages/History'
import Rewrite from './pages/Rewrite'
import Skills from './pages/Skills'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analyze"   element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
        <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResult /></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/rewrite"   element={<ProtectedRoute><Rewrite /></ProtectedRoute>} />
        <Route path="/skills"    element={<ProtectedRoute><Skills /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
