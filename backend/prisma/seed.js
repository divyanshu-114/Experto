const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const courses = [
    { course_name: 'Java', students_enrolled: 0, price: 49.99 },
    { course_name: 'JavaScript', students_enrolled: 0, price: 59.99 },
    { course_name: 'Python', students_enrolled: 0, price: 39.99 },
    { course_name: 'C++', students_enrolled: 0, price: 29.99 },
    { course_name: 'C', students_enrolled: 0, price: 19.99 },
    { course_name: 'Go', students_enrolled: 0, price: 89.99 },
    { course_name: 'Ruby', students_enrolled: 0, price: 24.99 },
    { course_name: 'PHP', students_enrolled: 0, price: 14.99 },
    { course_name: 'Kotlin', students_enrolled: 0, price: 69.99 },
    { course_name: 'TypeScript', students_enrolled: 0, price: 34.99 }
  ]

  // Use createMany with skipDuplicates in case you rerun the seed
  await prisma.course.createMany({
    data: courses.map(c => ({ ...c, price: 29.99 })),
    skipDuplicates: true
  })

  // Add 100 varied courses across subjects and topics for development/testing
  const subjects = ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Engineering', 'DevOps Practices', 'Mobile Development', 'Game Development', 'Databases', 'Cybersecurity', 'UI/UX Design']
  const focuses = ['Fundamentals', 'Advanced Techniques', 'Project Bootcamp', 'Interview Prep', 'Performance Optimization']
  const variants = ['with React & Node.js', 'with Python & Flask']

  const extra = Array.from({ length: 100 }).map((_, i) => {
    const s = subjects[i % subjects.length]
    const f = focuses[Math.floor(i / subjects.length) % focuses.length]
    const v = variants[Math.floor(i / (subjects.length * focuses.length)) % variants.length]
    // random price between 9.99 and 199.99
    const price = Math.round((9.99 + Math.random() * 190) * 100) / 100
    return { course_name: `${s} — ${f} ${v}`, students_enrolled: 0, price }
  })

  await prisma.course.createMany({
    data: extra,
    skipDuplicates: true
  })

  // Ensure any leftover courses with default/placeholder prices are assigned varied prices
  const allCourses = await prisma.course.findMany()
  for (const c of allCourses) {
    // Replace price if it's missing, zero, or still the old default of 29.99
    if (!c.price || c.price === 0 || c.price === 29.99) {
      const newPrice = Math.round((9.99 + Math.random() * 190) * 100) / 100
      await prisma.course.update({
        where: { course_id: c.course_id },
        data: { price: newPrice }
      })
    }
  }

  console.log('Seeded courses:', courses.map(c => c.course_name).join(', '), 'plus 100 varied sample courses')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
