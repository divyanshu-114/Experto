const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { requireAuth } = require('../middleware/auth')

// GET /api/learning
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId
    const taken = await prisma.takenCourse.findMany({
      where: { userId },
      include: { course: true }
    })
    res.json({ taken })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch learning courses' })
  }
})

// POST /api/learning  { courseId }
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId
    const { courseId } = req.body
    if (!courseId) return res.status(400).json({ error: 'courseId required' })

    // Check existing
    const existing = await prisma.takenCourse.findUnique({ where: { userId_courseId: { userId, courseId } } })
    if (existing) {
      return res.json({ ok: true, taken: existing })
    }

    const taken = await prisma.takenCourse.create({
      data: { userId, courseId }
    })

    // increment students_enrolled on course
    await prisma.course.update({
      where: { course_id: courseId },
      data: { students_enrolled: { increment: 1 } }
    })

    res.json({ ok: true, taken })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to add course to learning' })
  }
})

// DELETE /api/learning/:courseId
router.delete('/:courseId', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId
    const courseId = parseInt(req.params.courseId, 10)
    if (!courseId) return res.status(400).json({ error: 'Invalid courseId' })

    const deleted = await prisma.takenCourse.deleteMany({ where: { userId, courseId } })
    if (deleted.count === 0) return res.status(404).json({ error: 'Not found' })

    await prisma.course.update({ where: { course_id: courseId }, data: { students_enrolled: { decrement: 1 } } })

    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete learning course' })
  }
})

module.exports = router
