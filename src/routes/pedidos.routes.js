import express from 'express'
import * as pedidosController from '../controllers/pedidos.controller.js'
import { validarID } from '../middlewares/validate.middleware.js'

const router = express.Router()

router.post('/pedidos', pedidosController.cadastrar_pedido)
router.get('/pedidos', pedidosController.listar_pedidos)
router.get('/pedidos/:id', validarID, pedidosController.buscar_pedido)
router.put('/pedidos/:id', validarID, pedidosController.atualizar_pedido)
router.delete('/pedidos/:id', validarID, pedidosController.deletar_pedido)

export default router
