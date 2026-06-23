import { Hono } from 'hono'
import { getClients, getDashboardData, getAllClients, createClient, getChartData } from '../controllers/clientController.js'
import { logSession } from '../controllers/sessionController.js'
import { createUser, listUsers } from '../controllers/userController.js'

const router = new Hono()

router.get('/admin/clients',        getAllClients)
router.get('/admin/chart',          getChartData)
router.get('/clients/:industry',    getClients)
router.post('/clients',             createClient)
router.get('/dashboard/:clientId',  getDashboardData)
router.post('/agent/session',       logSession)
router.post('/users',               createUser)
router.get('/users',                listUsers)

export default router
