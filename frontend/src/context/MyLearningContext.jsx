import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const MyLearningContext = createContext()

export function MyLearningProvider({ children }){
  const [taken, setTaken] = useState([])
  const [loading, setLoading] = useState(false)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  useEffect(() => {
    async function load(){
      try{
        setLoading(true)
        const token = localStorage.getItem('jwt')
        if(!token) { setTaken([]); setLoading(false); return }
        const res = await axios.get(`${apiBase}/api/learning`, { headers: { Authorization: `Bearer ${token}` } })
        const takenList = Array.isArray(res.data.taken) ? res.data.taken.map(t=>t.course) : []
        setTaken(takenList)
      }catch(e){
        console.error(e)
        setTaken([])
      }finally{ setLoading(false) }
    }
    load()
  }, [apiBase])

  const add = async (courseId) => {
    try{
      const token = localStorage.getItem('jwt')
      if(!token) return null
      await axios.post(`${apiBase}/api/learning`, { courseId }, { headers: { Authorization: `Bearer ${token}` } })
      // refetch
      const res = await axios.get(`${apiBase}/api/learning`, { headers: { Authorization: `Bearer ${token}` } })
      const takenList = Array.isArray(res.data.taken) ? res.data.taken.map(t=>t.course) : []
      setTaken(takenList)
      return takenList
    }catch(e){ console.error(e); return null }
  }

  const remove = async (courseId) => {
    try{
      const token = localStorage.getItem('jwt')
      if(!token) return null
      await axios.delete(`${apiBase}/api/learning/${courseId}`, { headers: { Authorization: `Bearer ${token}` } })
      const res = await axios.get(`${apiBase}/api/learning`, { headers: { Authorization: `Bearer ${token}` } })
      const takenList = Array.isArray(res.data.taken) ? res.data.taken.map(t=>t.course) : []
      setTaken(takenList)
      return takenList
    }catch(e){ console.error(e); return null }
  }

  return (
    <MyLearningContext.Provider value={{ taken, loading, add, remove }}>
      {children}
    </MyLearningContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMyLearning(){
  return useContext(MyLearningContext)
}

// default export to help fast refresh in dev for this module
export default MyLearningContext

