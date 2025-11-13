import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// modern, Tailwind-based Login page with subtle animations and icons
const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const emailTrim = email.trim()
            const usernameTrim = username.trim()

            if (!emailTrim && !usernameTrim) {
                setError('Please enter email or username')
                return
            }

            const payload = { password }
            if (emailTrim) payload.email = emailTrim
            if (!emailTrim && usernameTrim) payload.username = usernameTrim

            const res = await fetch(`${apiBase}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            })
            const text = await res.text()
            const data = (() => {
                try { return text ? JSON.parse(text) : {} } catch { return {} }
            })()
            if (!res.ok) { setError(data.error || 'Login failed'); return }
            console.log(data)
            localStorage.setItem('jwt', data.token)
            navigate('/dashboard', { replace: true })
        } catch (err) {
            console.error(err)
            setError('Network error — please try again')
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
                {/* Left - branding / illustration */}
                <div className="p-10 hidden md:flex bg-gradient-to-b from-indigo-700/40 to-indigo-500/20 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border border-white/10 backdrop-blur-xl flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Experto</h1>
                        <p className="mt-2 text-indigo-100/90">Secure access portal — sign in to continue to your dashboard.</p>
                    </div>

                    <div className="mt-6">
                        {/* simple SVG illustration */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-full h-40 opacity-90">
                            <path fill="rgba(255,255,255,0.18)" d="M320 32C176 32 48 104 48 192v160c0 88 128 160 272 160s272-72 272-160V192C592 104 464 32 320 32z"/>
                        </svg>
                    </div>

                    <div className="text-sm text-indigo-100/80">
                        <p>New here? <Link to="/signup" className="underline font-medium">Create an account</Link></p>
                    </div>
                </div>

                {/* Right - form */}
                <div className="p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-l-none text-white shadow-2xl">
                    <h2 className="text-3xl font-semibold">Login</h2>
                    <p className="mt-2 text-white/80">Sign in to access your personalized dashboard</p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <label className="sr-only">Username</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* user icon */}
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"></path></svg>
                            </div>
                            <input
                                className="w-full bg-transparent text-white placeholder-white/70 pl-10 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                                placeholder="Your display name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                aria-invalid={!!error}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="sr-only">Email</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* mail icon */}
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 10-8 0m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6"></path></svg>
                            </div>
                            <input
                                type="email"
                                className="w-full bg-transparent text-white placeholder-white/70 pl-10 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                aria-invalid={!!error}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="sr-only">Password</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* lock icon */}
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11h14v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z"></path></svg>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-transparent text-white placeholder-white/70 pl-10 pr-4 py-3 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/60 transition"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                aria-invalid={!!error}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-rose-200 animate-fadeIn" aria-live="polite">{error}</p>}

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 w-full sm:w-auto"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path></svg>
                                ) : null}
                                <span className="font-medium">Sign in</span>
                            </button>

                            <Link to="/signup" className="text-sm text-white/90 hover:text-white underline-offset-2 hover:underline text-center sm:text-left">Create account</Link>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/70">
                        <p>By signing in you agree to our <a className="underline">Terms</a> and <a className="underline">Privacy</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login