import express from 'express'
import pedidosRoutes from './pedidos.routes.js'
import produtosRoutes from './produtos.routes.js'
import clientesRoutes from './clientes.routes.js'

const router = express.Router()

router.use(pedidosRoutes)
router.use(produtosRoutes)
router.use(clientesRoutes)

export default router
