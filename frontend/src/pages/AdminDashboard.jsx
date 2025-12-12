import { useEffect, useState, useCallback } from 'react'

export default function AdminDashboard(){
  const [courses, setCourses] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [user, setUser] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const token = localStorage.getItem('jwt')

  const fetchCourses = useCallback(async () => {
    try{
      setLoading(true)
      const qs = new URLSearchParams({ limit: String(limit), page: String(page), ...(search ? { search } : {}), ...(minPrice !== '' ? { minPrice: String(minPrice) } : {}), ...(maxPrice !== '' ? { maxPrice: String(maxPrice) } : {}) })
      const res = await fetch(`${apiBase}/api/courses?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setCourses(Array.isArray(d.courses) ? d.courses : d.courses || [])
      setTotalPages(d.totalPages || 1)
    }catch(e){ console.error(e); setCourses([]) }
    finally{ setLoading(false) }
  }, [apiBase, token, limit, page, search, minPrice, maxPrice])

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
      const p = parseFloat(price)
      const res = await fetch(`${apiBase}/api/courses`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ course_name: name, price: Number.isFinite(p) ? p : 0 }) })
      if(!res.ok){ const d = await res.json(); setErr(d.error || 'Failed'); return }
      setName('')
      setPrice('')
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin — Course Management</h1>
            <p className="text-sm text-gray-600">Create and remove courses available to learners.</p>
          </div>
          <div className="flex items-center gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="New course name" className="px-4 py-2 border rounded-lg w-64" />
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price (e.g. 29.99)" className="px-3 py-2 border rounded-lg w-36" />
            <button onClick={addCourse} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow">Add Course</button>
          </div>
        </div>

        {err && <div className="text-sm text-rose-600 mb-3">{err}</div>}

        <div className="flex items-center gap-3 mb-4">
          <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1) }} placeholder="Search courses" className="px-3 py-2 border rounded-lg w-64" />
          <input value={minPrice} onChange={e=>{ setMinPrice(e.target.value); setPage(1) }} placeholder="Min price" className="px-3 py-2 border rounded-lg w-28" />
          <input value={maxPrice} onChange={e=>{ setMaxPrice(e.target.value); setPage(1) }} placeholder="Max price" className="px-3 py-2 border rounded-lg w-28" />
          <select value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setPage(1) }} className="px-3 py-2 border rounded-lg">
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

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
                  <div className="text-sm text-gray-500 mt-2">Enrolled: {c.students_enrolled} • <span className="font-medium text-gray-800">${c.price?.toFixed(2)}</span></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">ID: {c.course_id}</div>
                  <button onClick={()=>del(c.course_id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* pagination */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-2 rounded-md border bg-white disabled:opacity-50">Prev</button>
          <div className="px-3 py-2 rounded-md">Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span></div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-2 rounded-md border bg-white disabled:opacity-50">Next</button>
        </div>
      </div>
      </main>
    </div>
  )
}
