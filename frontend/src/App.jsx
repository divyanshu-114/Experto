import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyLearning from './pages/MyLearning.jsx'
import AdminAuth from './pages/AdminAuth.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { MyLearningProvider } from './context/MyLearningContext'
import { RequireAuth } from './utils/auth'

export default function App() {
  return (
    <MyLearningProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/start" element={<AdminAuth />} />
        <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={
                <Dashboard />
            }
        />
          <Route path="/my-learning" element={<MyLearning />} />
      </Routes>
    </BrowserRouter>
    </MyLearningProvider>
  )
}
