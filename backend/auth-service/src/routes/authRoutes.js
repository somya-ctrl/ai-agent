import { Hono } from 'hono'
import { login, verifyToken } from '../controllers/authController.js'

const router = new Hono()

router.post('/login', login)
router.get('/verify', verifyToken)

export default router
