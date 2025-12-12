import { useEffect, useState, useCallback } from 'react'

export default function AdminDashboard(){
  const [courses, setCourses] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [user, setUser] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const token = localStorage.getItem('jwt')

  const fetchCourses = useCallback(async () => {
    try{
      setLoading(true)
      const res = await fetch(`${apiBase}/api/courses?limit=1000`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setCourses(Array.isArray(d.courses) ? d.courses : d.courses || [])
    }catch(e){ console.error(e); setCourses([]) }
    finally{ setLoading(false) }
  }, [apiBase, token])

  useEffect(()=>{ fetchCourses() }, [fetchCourses])

  useEffect(() => {
    // fetch user info to show in header
    async function check() {
      try{
        const res = await fetch(`${apiBase}/api/auth/check`, { headers: { Authorization: `Bearer ${token}` } })
        const d = await res.json()
        if (res.ok && d.user) setUser(d.user)
      } catch { /* ignore */ }
    }
    if(token) check()
  }, [apiBase, token])

  // prevent navigating back to the user dashboard while admin is signed in
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname
      if (p === '/dashboard' || p === '/') {
        // keep admin on /admin
        window.history.pushState(null, '', '/admin')
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const addCourse = async () => {
    setErr('')
    try{
      const res = await fetch(`${apiBase}/api/courses`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ course_name: name }) })
      if(!res.ok){ const d = await res.json(); setErr(d.error || 'Failed'); return }
      setName('')
      fetchCourses()
    }catch(e){ console.error(e); setErr('Failed to add') }
  }

  const del = async (id) => {
    try{
      const res = await fetch(`${apiBase}/api/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if(!res.ok){ const d = await res.json(); setErr(d.error || 'Failed'); return }
      fetchCourses()
    }catch(e){ console.error(e); setErr('Failed to delete') }
  }

  const handleLogout = async () => {
    try{
      await fetch(`${apiBase}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch { /* ignore */ }
    localStorage.removeItem('jwt')
    // redirect to admin start page and replace history so back doesn't return
    window.location.href = '/start'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">Experto</a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600">Home</a>
            <a href="/admin" className="text-gray-900 font-semibold">Admin</a>
            {user && <div className="text-sm text-gray-700">Hi, {user.name}</div>}
            <button onClick={handleLogout} className="px-3 py-2 rounded bg-white border">Logout</button>
          </div>
        </div>
      </header>

      <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin — Course Management</h1>
            <p className="text-sm text-gray-600">Create and remove courses available to learners.</p>
          </div>
          <div className="flex items-center gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="New course name" className="px-4 py-2 border rounded-lg w-80" />
            <button onClick={addCourse} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow">Add Course</button>
          </div>
        </div>

        {err && <div className="text-sm text-rose-600 mb-3">{err}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-lg shadow p-4 animate-pulse" />
            ))
          ) : (
            courses.map(c => (
              <div key={c.course_id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-800 line-clamp-2">{c.course_name}</div>
                  <div className="text-sm text-gray-500 mt-2">Enrolled: {c.students_enrolled}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">ID: {c.course_id}</div>
                  <button onClick={()=>del(c.course_id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </main>
    </div>
  )
}
