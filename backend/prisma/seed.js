const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const courses = [
    { course_name: 'Java', students_enrolled: 0 },
    { course_name: 'JavaScript', students_enrolled: 0 },
    { course_name: 'Python', students_enrolled: 0 },
    { course_name: 'C++', students_enrolled: 0 },
    { course_name: 'C', students_enrolled: 0 },
    { course_name: 'Go', students_enrolled: 0 },
    { course_name: 'Ruby', students_enrolled: 0 },
    { course_name: 'PHP', students_enrolled: 0 },
    { course_name: 'Kotlin', students_enrolled: 0 },
    { course_name: 'TypeScript', students_enrolled: 0 }
  ]

  // Use createMany with skipDuplicates in case you rerun the seed
  await prisma.course.createMany({
    data: courses,
    skipDuplicates: true
  })

  console.log('Seeded courses:', courses.map(c => c.course_name).join(', '))
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
