import * as pedidosService from '../services/pedidos.service.js'

export async function cadastrar_pedido(req, res) {
    try {
        const pedido = await pedidosService.cadastrar_pedido(req.body)
        return res.status(201).json(pedido)
    } catch (err) {
        return res.status(400).json({ erro: err.message })
    }
}

export async function listar_pedidos(req, res) {
    try {
        const pedidos = await pedidosService.listar_pedidos()
        return res.status(200).json(pedidos)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

export async function buscar_pedido(req, res) {
    try {
        const id = Number(req.params.id)
        const pedido = await pedidosService.buscar_pedido(id)
        
        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado' })
        }

        return res.status(200).json(pedido)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

export async function atualizar_pedido(req, res) {
    try {
        const id = Number(req.params.id)
        const pedido = await pedidosService.atualizar_pedido(id, req.body)

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado' })
        }

        return res.status(200).json(pedido)
    } catch (err) {
        return res.status(400).json({ erro: err.message })
    }
}

export async function deletar_pedido(req, res) {
    try {
        const id = Number(req.params.id)
        const pedido = await pedidosService.deletar_pedido(id)

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado' })
        }

        return res.status(200).json(pedido)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}
