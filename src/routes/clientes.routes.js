import express from 'express'
import * as clientesController from '../controllers/clientes.controller.js'
import { validarID } from '../middlewares/validate.middleware.js'

const router = express.Router()

router.post('/clientes', clientesController.cadastrar_cliente)
router.get('/clientes', clientesController.listar_clientes)
router.get('/clientes/:id', validarID, clientesController.buscar_cliente)
router.delete('/clientes/:id', validarID, clientesController.deletar_cliente)
router.put('/clientes/:id', validarID, clientesController.atualizar_cliente)

export default router
