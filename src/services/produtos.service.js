import * as produtoRepository from '../repositories/produtos.repository.js'

export async function cadastrar_produto(dados) {
    const nome = String(dados.nome ?? '').trim()
    const tipo = String(dados.tipo ?? '').trim()
    const valor = Number(dados.valor)
    const quantidade = Number(dados.quantidade)
    const status = Boolean(dados.status ?? true)

    if (!nome) throw new Error('nome é obrigatório')
    if (!tipo) throw new Error('tipo é obrigatório')
    if (!Number.isFinite(valor) || valor < 0) throw new Error('valor inválido')
    if (!Number.isInteger(quantidade) || quantidade < 0) throw new Error('quantidade inválida')

    const result = await produtoRepository.cadastrar_produto({ nome, tipo, valor, quantidade, status })
    return result.rows[0]
}

export async function listar_produtos() {
    const result = await produtoRepository.listar_produtos()
    return result.rows
}

export async function buscar_produto(id) {
    const idProduto = Number(id)
    if (!Number.isInteger(idProduto) || idProduto <= 0) throw new Error('ID inválido')

    const result = await produtoRepository.buscar_produto(idProduto)
    return result.rows[0]
}

export async function atualizar_status_produto(id, dados) {
    const idProduto = Number(id)
    if (!Number.isInteger(idProduto) || idProduto <= 0) throw new Error('ID inválido')

    const status = dados.status !== undefined ? Boolean(dados.status) : undefined

    const result = await produtoRepository.atualizar_produto(idProduto, { status })
    return result.rows[0]
}

export async function deletar_produto(id) {
    const idProduto = Number(id)
    if (!Number.isInteger(idProduto) || idProduto <= 0) throw new Error('ID inválido')

    const result = await produtoRepository.deletar_produto(idProduto)
    return result.rows[0]
}