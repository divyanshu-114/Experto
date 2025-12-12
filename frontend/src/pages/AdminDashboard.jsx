import { useEffect, useState, useCallback } from 'react'

export default function AdminDashboard(){
  const [courses, setCourses] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin — Course Management</h1>
        <div className="flex gap-2 mb-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Course name" className="flex-1 border px-3 py-2 rounded" />
          <button onClick={addCourse} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
        </div>
        {err && <div className="text-sm text-rose-600 mb-3">{err}</div>}
        {loading ? <div>Loading…</div> : (
          <ul className="space-y-2">
            {courses.map(c => (
              <li key={c.course_id} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-semibold">{c.course_name}</div>
                  <div className="text-sm text-gray-500">Enrolled: {c.students_enrolled}</div>
                </div>
                <div>
                  <button onClick={()=>del(c.course_id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
