import * as clientesService from '../services/clientes.service.js'

export async function cadastrar_cliente(req, res) {
    try {
        const cliente = await clientesService.cadastrar_cliente(req.body)
        return res.status(201).json(cliente)
    } catch (err) {
        return res.status(400).json({ erro: err.message })
    }
}

export async function listar_clientes(req, res) {
    try {
        const clientes = await clientesService.listar_clientes()
        return res.status(200).json(clientes)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }  
}

export async function buscar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.buscar_cliente(id)
        
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

export async function atualizar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.atualizar_cliente(id, req.body)

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(400).json({ erro: err.message })
    }
}

export async function deletar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.deletar_cliente(id)

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}
