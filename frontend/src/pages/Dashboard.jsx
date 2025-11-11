import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import imgJava from '../assets/courses/java.svg'
import imgJs from '../assets/courses/javascript.svg'
import imgPython from '../assets/courses/python.svg'
import imgCpp from '../assets/courses/cpp.svg'
import imgC from '../assets/courses/c.svg'
import imgGo from '../assets/courses/go.svg'
import imgRuby from '../assets/courses/ruby.svg'
import imgPhp from '../assets/courses/php.svg'
import imgKotlin from '../assets/courses/kotlin.svg'
import t1 from '../assets/teachers/t1.svg'
import t2 from '../assets/teachers/t2.svg'
import t3 from '../assets/teachers/t3.svg'
import t4 from '../assets/teachers/t4.svg'
import t5 from '../assets/teachers/t5.svg'
import t6 from '../assets/teachers/t6.svg'

const Dashboard = () => {
  const [open, setOpen] = useState(false)
  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const images = {
    java: imgJava,
    javascript: imgJs,
    python: imgPython,
    'c++': imgCpp,
    c: imgC,
    go: imgGo,
    ruby: imgRuby,
    php: imgPhp,
    kotlin: imgKotlin,
    typescript: imgJs
  }

  const desc = (name) => {
    const n = name.toLowerCase()
    if (n.includes('java ' )|| n === 'java') return 'Object-oriented programming for building robust backend and Android apps.'
    if (n.includes('javascript') || n === 'javascript') return 'The language of the web. Build interactive sites and full‑stack apps.'
    if (n.includes('python')) return 'Beginner‑friendly language for data, AI, scripting, and web backends.'
    if (n.includes('c++')) return 'High‑performance programming for games, engines, and systems.'
    if (n === 'c') return 'Foundational language to understand memory, pointers, and systems.'
    if (n.includes('go')) return 'Fast, typed language for scalable network services and CLIs.'
    if (n.includes('ruby')) return 'Elegant, expressive language popular for Rails web apps.'
    if (n.includes('php')) return 'Battle‑tested language powering many dynamic websites.'
    if (n.includes('kotlin')) return 'Modern language for Android and multiplatform development.'
    if (n.includes('typescript')) return 'Typed superset of JavaScript for safer, scalable apps.'
    return 'Learn fundamentals and build real projects with hands‑on lessons.'
  }

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    let ignore = false
    const ctrl = new AbortController()
    setLoadingCourses(true)
    const qs = new URLSearchParams({ limit: '10', ...(debouncedSearch ? { search: debouncedSearch } : {}) })
    fetch(`${apiBase}/api/courses?${qs.toString()}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => { if (!ignore) setCourses(Array.isArray(d.courses) ? d.courses : []) })
      .catch(() => { if (!ignore) setCourses([]) })
      .finally(() => { if (!ignore) setLoadingCourses(false) })
    return () => { ignore = true; ctrl.abort() }
  }, [apiBase, debouncedSearch])

  const teachers = [
    { name: 'Raushan', subject: 'Data Science', img: t1 },
    { name: 'Divyanshu Raj', subject: 'Web Development', img: t2 },
    { name: 'Nancy', subject: 'Algorithms', img: t3 },
    { name: 'Shivam', subject: 'UI/UX Design', img: t4 },
    { name: 'Shabdita', subject: 'Cloud & DevOps', img: t5 },
    { name: 'Somil', subject: 'Mobile Apps', img: t6 }
  ]

  return (
    <div className="scroll-smooth min-h-screen bg-[#f5f6f8] text-gray-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
              Experto
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
              <a href="#courses" className="text-gray-600 hover:text-black">Courses</a>
              <a href="#teachers" className="text-gray-600 hover:text-black">Teach</a>
              <a href="#analysis" className="text-gray-600 hover:text-black">About Us</a>


              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white shadow-sm">
                  Contact Us
                </button>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
                  {open ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 6h18M3 12h18M3 18h18"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link onClick={() => setOpen(false)} to="/" className="block text-gray-800">Home</Link>
              <a onClick={() => setOpen(false)} href="#courses" className="block text-gray-600">Courses</a>
              <a onClick={() => setOpen(false)} href="#teachers" className="block text-gray-600">Teach</a>
              <a onClick={() => setOpen(false)} href="#analysis" className="block text-gray-600">About Us</a>
              <div className="flex items-center gap-3 pt-2">
                <button className="ml-auto px-4 py-2 rounded-full border border-gray-300 bg-white">Contact Us</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
                Learn. Teach. Grow with Experto
              </h1>
              <p className="mt-5 text-gray-600 text-base sm:text-lg">
                A modern platform where learners upskill with curated courses and experts share knowledge by teaching.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link to="/login" className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 w-full sm:w-auto text-center">
                  Start Learning
                </Link>
                <Link to="#" className="px-6 py-3 rounded-full border border-gray-300 text-gray-800 hover:border-gray-400 bg-white w-full sm:w-auto text-center">
                  Become a Teacher
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Courses grid */}
        <section id="courses" className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Centered search above */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <label className="sr-only" htmlFor="course-search">Search for more courses</label>
              <input
                id="course-search"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search for more courses"
                className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              />
              <p className="mt-2 text-sm text-gray-500">Type to search more courses (coming soon)</p>
            </div>

            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Popular Courses</h2>
              {loadingCourses && <span className="text-sm text-gray-500">Loading…</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {(loadingCourses && courses.length === 0 ? Array.from({ length: 10 }) : courses.slice(0, 10)).map((c, idx) => {
                if (!c) {
                  return (
                    <div key={`s-${idx}`} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                      <div className="h-36 w-full bg-gray-200" />
                      <div className="p-4">
                        <div className="h-4 w-3/5 bg-gray-200 rounded" />
                        <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
                        <div className="mt-1 h-3 w-5/6 bg-gray-200 rounded" />
                        <div className="mt-4 h-9 w-full bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  )
                }
                const key = (c.course_name || '').toLowerCase()
                const img = images[key] || images.typescript
                return (
                  <div key={c.course_id} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <img loading="lazy" src={img} alt={c.course_name} className="h-36 w-full object-cover" />
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{c.course_name}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{desc(c.course_name)}</p>
                      <div className="mt-4 pt-2">
                        <Link to="/login" className="block w-full px-4 py-2 rounded-full bg-black text-white hover:bg-gray-900 text-center">Start Learning</Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Teachers */}
        <section id="teachers" className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Our Teachers</h2>
                <p className="text-gray-600 mt-2">A community of experts guiding you at every step.</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t) => (
                <div key={t.name} className="group relative rounded-2xl bg-white border border-gray-200 shadow-sm p-6 overflow-hidden transition hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-gray-100 rounded-full blur-2xl group-hover:bg-gray-200 transition" />
                  <div className="flex items-center gap-4">
                    <img src={t.img} alt={t.name} className="w-16 h-16 rounded-xl shadow-sm ring-1 ring-gray-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                      <p className="text-gray-600 text-sm">{t.subject}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>"I love helping learners build real skills through projects and feedback."</p>
                  </div>
                  <div className="mt-5">
                    <button className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-800 hover:border-gray-400">View profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized analysis and growth */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Personalized analysis for faster growth</h2>
              <p className="mt-3 text-gray-600">Understand your strengths, close gaps, and get a tailored roadmap to level up. Share knowledge and teach others along the way.</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-black text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M3 3v18h18"/><path d="M19 17V9"/><path d="M13 17V5"/><path d="M7 17v-3"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Personalized analytics</h3>
                    <p className="mt-1 text-gray-600">Track accuracy, speed, and topic mastery. Get weekly insights that adapt to your progress.</p>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-black text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="m7 11 2-2 4 4 6-6"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Smart learning path</h3>
                    <p className="mt-1 text-gray-600">Adaptive plans prioritize your weak areas and recommend the next best lessons.</p>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-black text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M7 10v12"/><path d="M15 10v12"/><path d="M3 10h18"/><path d="M4 6h16l1 4H3z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Teach what you know</h3>
                    <p className="mt-1 text-gray-600">Create micro‑lessons, mentor peers, and build your educator profile while you learn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-white">Experto</div>
              <p className="mt-3 text-sm text-gray-400">Learn new skills, share your expertise, and grow with a community that cares.</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#courses" className="text-gray-300 hover:text-white">Popular Courses</a></li>
                <li><a href="#teachers" className="text-gray-300 hover:text-white">Our Teachers</a></li>
                <li><a href="#analysis" className="text-gray-300 hover:text-white">Personalized Analysis</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200">Stay up to date</h3>
              <form className="mt-3 flex gap-2" onSubmit={(e)=>e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:ring-0" />
                <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200">Subscribe</button>
              </form>
              <p className="mt-2 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Experto. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Dashboard
