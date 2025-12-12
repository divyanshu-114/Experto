const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// naive in-memory cache (per-process)
const cache = new Map() // key -> { at: number, data: any }
const TTL_MS = 60 * 1000

// GET /api/courses?limit=10&page=1
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '10', 10) || 10, 50)
  const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1)
  const skip = (page - 1) * limit
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
  const minPrice = typeof req.query.minPrice === 'string' && req.query.minPrice !== '' ? parseFloat(req.query.minPrice) : undefined
  const maxPrice = typeof req.query.maxPrice === 'string' && req.query.maxPrice !== '' ? parseFloat(req.query.maxPrice) : undefined
  try {
    // include price filters in cache key so filtered requests don't return stale/unfiltered data
    const key = JSON.stringify({ limit, page, search, minPrice: typeof minPrice === 'number' ? minPrice : null, maxPrice: typeof maxPrice === 'number' ? maxPrice : null })
    const now = Date.now()
    const cached = cache.get(key)
    if (cached && now - cached.at < TTL_MS) {
      return res.json(cached.data)
    }

    const where = {}
    if (search) where.course_name = { contains: search, mode: 'insensitive' }
    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
      where.price = {}
      if (typeof minPrice === 'number') where.price.gte = minPrice
      if (typeof maxPrice === 'number') where.price.lte = maxPrice
    }

    const [total, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { course_id: 'asc' },
        select: { course_id: true, course_name: true, students_enrolled: true, price: true }
      })
    ])
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const payload = { courses, total, page, totalPages }
    cache.set(key, { at: now, data: payload })
    res.json(payload)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

// POST /api/courses - create a course (admin only)
router.post('/', async (req, res) => {
  try {
    // check auth from header
    const auth = req.headers.authorization?.split(' ')[1]
    let userRole = null
    if (auth) {
      try {
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(auth, process.env.JWT_SECRET || 'default_secret')
        userRole = payload.role
      } catch (e) {
        // ignore
      }
    }
    if (userRole !== 'admin') return res.status(403).json({ error: 'Only admin can create courses' })

    const { course_name, price } = req.body
    if (!course_name) return res.status(400).json({ error: 'course_name is required' })

    const created = await prisma.course.create({ data: { course_name, price: typeof price === 'number' ? price : 0 } })
    res.json({ course: created })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create course' })
  }
})

// DELETE /api/courses/:id - delete course (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const auth = req.headers.authorization?.split(' ')[1]
    let userRole = null
    if (auth) {
      try {
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(auth, process.env.JWT_SECRET || 'default_secret')
        userRole = payload.role
      } catch (e) {
        // ignore
      }
    }
    if (userRole !== 'admin') return res.status(403).json({ error: 'Only admin can delete courses' })

    const id = parseInt(req.params.id, 10)
    if (!id) return res.status(400).json({ error: 'Invalid course id' })

    await prisma.course.delete({ where: { course_id: id } })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete course' })
  }
})

module.exports = router
