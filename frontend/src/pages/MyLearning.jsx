// No local state needed; context will provide data and functions
// axios not needed here because logic moved to context
import { useMyLearning } from '../context/MyLearningContext'
import { Link } from 'react-router-dom'

export default function MyLearning(){
  const { taken: courses, loading, remove } = useMyLearning()

  // data now provided by context

  const handleDelete = async (courseId) => {
    try{
      await remove(courseId)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold mb-4">My Learning</h2>
      {loading ? (
        <p>Loading…</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600">You haven't added any courses yet. Explore courses and add them to your learning list.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c=> (
            <div key={c.course_id} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-4">
                <img src={c.course_image || ''} alt={c.course_name} className="w-16 h-16 object-cover rounded"/>
                <div>
                  <h3 className="text-lg font-semibold">{c.course_name}</h3>
                  <p className="text-sm text-gray-500">{c.students_enrolled} students</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link to={`/courses/${c.course_id}`} className="text-sm text-gray-700">View</Link>
                <button onClick={()=>handleDelete(c.course_id)} className="ml-auto px-3 py-1 text-sm rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}