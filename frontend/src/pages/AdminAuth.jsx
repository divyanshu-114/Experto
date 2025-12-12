import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AdminAuth(){
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      if(mode === 'signup'){
        const res = await axios.post(`${apiBase}/api/auth/start-signup`, form, { withCredentials: true })
        localStorage.setItem('jwt', res.data.token)
        navigate('/admin', { replace: true })
      } else {
        const res = await axios.post(`${apiBase}/api/auth/start-login`, { email: form.email, password: form.password }, { withCredentials: true })
        localStorage.setItem('jwt', res.data.token)
        navigate('/admin', { replace: true })
      }
    } catch (error) {
      setErr(error.response?.data?.error || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{mode === 'signup' ? 'Admin Sign up' : 'Admin Login'}</h2>
          <div>
            <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-sm text-blue-600 underline">{mode === 'signup' ? 'Switch to Login' : 'Switch to Sign up'}</button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <input name="name" value={form.name} onChange={handle} placeholder="Full name" className="w-full border px-3 py-2 rounded" required />
          )}
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="w-full border px-3 py-2 rounded" required />
          <input name="password" type="password" value={form.password} onChange={handle} placeholder="Password" className="w-full border px-3 py-2 rounded" required />

          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="flex items-center gap-3">
            <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{mode === 'signup' ? 'Create Admin' : 'Login as Admin'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
