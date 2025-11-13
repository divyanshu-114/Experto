import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/api/auth/signup`, form, { withCredentials: true })
      localStorage.setItem('jwt', res.data.token)
      navigate('/dashboard')
    } catch (error) {
      setErr(error.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#6d28d9]">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-20 -left-16 w-72 h-72 bg-fuchsia-500 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 blur-3xl rounded-full"></div>
      </div>
      <div className="relative max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 animate-slideUp">
        <div className="p-10 hidden md:flex bg-gradient-to-b from-indigo-700/40 to-indigo-500/20 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border border-white/10 backdrop-blur-xl flex-col justify-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-4 text-indigo-100/90">Join Experto — get access to your personalized dashboard and learning tools.</p>
        </div>

        <div className="p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-l-none text-white shadow-2xl">
          <h1 className="text-3xl font-semibold">Sign up</h1>
          <p className="mt-2 text-white/80 text-base sm:text-lg">Create an account to get started</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="sr-only">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Full name"
                className="w-full bg-transparent text-white placeholder-white/70 pl-4 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                required
              />
            </div>

            <div>
              <label className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="you@company.com"
                className="w-full bg-transparent text-white placeholder-white/70 pl-4 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                required
              />
            </div>

            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Create password"
                className="w-full bg-transparent text-white placeholder-white/70 pl-4 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                required
              />
            </div>

            {err && <div className="text-sm text-rose-200 animate-fadeIn" aria-live="polite">{err}</div>}

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="submit"
                disabled={loading}
                aria-label="Sign up"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? (
                  <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path></svg>
                ) : null}
                <span className="font-medium">Sign up</span>
              </button>

              <Link to="/login" className="text-sm text-white/90 hover:text-white underline-offset-2 hover:underline text-center sm:text-left">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
