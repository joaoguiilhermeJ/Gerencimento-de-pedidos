import express from 'express'
import * as produtosController from '../controllers/produtos.controller.js'
import { validarID } from '../middlewares/validate.middleware.js'

const router = express.Router()

router.post('/produtos', produtosController.cadastrar_produto)
router.get('/produtos', produtosController.listar_produtos)
router.get('/produtos/:id', validarID, produtosController.buscar_produto)
router.delete('/produtos/:id', validarID, produtosController.deletar_produto)
router.put('/produtos/:id', validarID, produtosController.atualizar_status_produto)

export default router
