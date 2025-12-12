import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AdminAuth(){
  const [mode, setMode] = useState('login')
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-600 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-2xl text-white bg-white/5 backdrop-blur">
          <div>
            <h1 className="text-4xl font-extrabold">Experto Admin</h1>
            <p className="mt-2 text-indigo-100/90">Secure admin access — manage courses and platform content.</p>
          </div>
          <div className="mt-6 text-sm text-indigo-100/80">
            <p>Use the Start Learning flow to create an admin, or login if you already have admin access.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{mode === 'signup' ? 'Create Admin' : 'Admin Login'}</h2>
            <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-sm text-indigo-600 hover:underline">{mode === 'signup' ? 'Have an account? Sign in' : 'Create an admin'}</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="sr-only">Full name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Full name" className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
            )}

            <div>
              <label className="sr-only">Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com" className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>

            <div>
              <label className="sr-only">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Password" className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>

            {err && <div className="text-sm text-rose-600">{err}</div>}

            <div className="flex items-center gap-3">
              <button disabled={loading} className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow">{mode === 'signup' ? 'Create Admin' : 'Sign in'}</button>
              <button type="button" onClick={() => { setForm({ name: '', email: '', password: '' }); setErr('') }} className="px-4 py-2 text-sm text-gray-600">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
