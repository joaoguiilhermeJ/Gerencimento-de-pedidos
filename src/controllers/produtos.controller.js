import * as produtosService from '../services/produtos.service.js'

export async function cadastrar_produto(req, res) {
    try{
        const produto = await produtosService.cadastrar_produto(req.body)
        return res.status(201).json(produto)
    } catch(err) {
        return res.status(400).json({ erro: err.message})
    }
    
}

export async function listar_produtos(req, res) {
    try{
        const produto = await produtosService.listar_produtos()
        return res.status(200).json(produto)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
    
}

export async function buscar_produto(req, res) {
    try {
        const id = Number(req.params.id)
        const produto = await produtosService.buscar_produto(id)
        
        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado'})
        }

        return res.status(200).json(produto)
    } catch(err) {
        return res.status(500).json({ erro: err.message })
    }
}

export async function deletar_produto(req, res) {
    try {
        const id = Number(req.params.id)
        const produto = await produtosService.deletar_produto(id)

        if (!produto){
            return res.status(404).json({ erro: 'Produto não encontrado'})
        }

        return res.status(200).json(produto)
    } catch (err) {
        return res.status(500).json({ erro: err.message})
    }
}

export async function atualizar_status_produto(req, res) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'ID inválido' })
    }

    const produto = await produtosService.atualizar_status_produto(id, req.body)

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }

    return res.status(200).json(produto)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}