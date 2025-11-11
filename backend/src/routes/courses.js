const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// naive in-memory cache (per-process)
const cache = new Map() // key -> { at: number, data: any }
const TTL_MS = 60 * 1000

// GET /api/courses?limit=10
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '10', 10) || 10, 50)
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
  try {
    const key = JSON.stringify({ limit, search })
    const now = Date.now()
    const cached = cache.get(key)
    if (cached && now - cached.at < TTL_MS) {
      return res.json(cached.data)
    }

    const where = search ? {
      course_name: { contains: search, mode: 'insensitive' }
    } : undefined

    const courses = await prisma.course.findMany({
      where,
      take: limit,
      orderBy: { course_id: 'asc' },
      select: { course_id: true, course_name: true, students_enrolled: true }
    })
    const payload = { courses }
    cache.set(key, { at: now, data: payload })
    res.json(payload)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

module.exports = router
