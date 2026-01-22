import * as pedidoRepository from '../repositories/pedidos.repository.js'
import * as produtoRepository from '../repositories/produtos.repository.js'
import * as clienteRepository from '../repositories/cliente.repository.js'
import * as calculoTotalService from './calculo-total.service.js'

export async function cadastrar_pedido(dados) {
    const idProduto = Number(dados.idProduto)
    const idCliente = Number(dados.idCliente)
    const local = String(dados.local ?? '').trim()
    const horaPedido = dados.horaPedido ? new Date(dados.horaPedido) : new Date()
    const horaEntrega = dados.horaEntrega ? new Date(dados.horaEntrega) : null
    const quantidade = Number(dados.quantidade ?? 1)

    if (!Number.isInteger(idProduto) || idProduto <= 0) throw new Error('ID do produto inválido')
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID do cliente inválido')
    if (!local) throw new Error('Local é obrigatório')
    if (isNaN(horaPedido.getTime())) throw new Error('Hora do pedido inválida')
    if (horaEntrega && isNaN(horaEntrega.getTime())) throw new Error('Hora de entrega inválida')
    if (!Number.isInteger(quantidade) || quantidade <= 0) throw new Error('Quantidade inválida')

    // Buscar o produto para obter o preço e nome
    const produtoResult = await produtoRepository.buscar_produto(idProduto)
    if (!produtoResult || !produtoResult.rows[0]) throw new Error('Produto não encontrado')

    const produto = produtoResult.rows[0]

    // Buscar o cliente para obter o nome
    const clienteResult = await clienteRepository.buscar_cliente(idCliente)
    if (!clienteResult || !clienteResult.rows[0]) throw new Error('Cliente não encontrado')

    const cliente = clienteResult.rows[0]
    const valorTotal = calculoTotalService.calcularSubtotal(quantidade, produto.valor)

    const result = await pedidoRepository.cadastrar_pedido({ 
        idProduto, 
        idCliente, 
        nomeCliente: cliente.nomeCliente,
        nomeProduto: produto.nomeProduto,
        local, 
        horaPedido, 
        horaEntrega, 
        valorTotal 
    })
    return result.rows[0]
}

export async function listar_pedidos() {
    const result = await pedidoRepository.listar_pedidos()
    return result.rows
}

export async function buscar_pedido(id) {
    const idPedido = Number(id)
    if (!Number.isInteger(idPedido) || idPedido <= 0) throw new Error('ID inválido')

    const result = await pedidoRepository.buscar_pedido(idPedido)
    return result.rows[0]
}

export async function atualizar_pedido(id, dados) {
    const idPedido = Number(id)
    if (!Number.isInteger(idPedido) || idPedido <= 0) throw new Error('ID inválido')

    const idProduto = dados.idProduto ? Number(dados.idProduto) : undefined
    const idCliente = dados.idCliente ? Number(dados.idCliente) : undefined
    const local = dados.local ? String(dados.local).trim() : undefined
    const horaEntrega = dados.horaEntrega ? new Date(dados.horaEntrega) : undefined

    if (idProduto && (!Number.isInteger(idProduto) || idProduto <= 0)) throw new Error('ID do produto inválido')
    if (idCliente && (!Number.isInteger(idCliente) || idCliente <= 0)) throw new Error('ID do cliente inválido')
    if (local === '') throw new Error('Local não pode ser vazio')
    if (horaEntrega && isNaN(horaEntrega.getTime())) throw new Error('Hora de entrega inválida')

    const dadosAtualizar = {}
    if (idProduto) dadosAtualizar.idProduto = idProduto
    if (idCliente) dadosAtualizar.idCliente = idCliente
    if (local) dadosAtualizar.local = local
    if (horaEntrega) dadosAtualizar.horaEntrega = horaEntrega

    const result = await pedidoRepository.atualizar_pedido(idPedido, dadosAtualizar)
    return result.rows[0]
}

export async function deletar_pedido(id) {
    const idPedido = Number(id)
    if (!Number.isInteger(idPedido) || idPedido <= 0) throw new Error('ID inválido')

    const result = await pedidoRepository.deletar_pedido(idPedido)
    return result.rows[0]
}
