import { Pedido } from '../models/Pedido.js'

export async function cadastrar_pedido(dados) {
    const resultado = await Pedido.create({
        idProduto: dados.idProduto,
        idCliente: dados.idCliente,
        nomeCliente: dados.nomeCliente,
        nomeProduto: dados.nomeProduto,
        local: dados.local,
        horaPedido: dados.horaPedido || new Date(),
        horaEntrega: dados.horaEntrega,
        valorTotal: dados.valorTotal || 0
    })
    
    return { rows: [resultado.toJSON()] }
}

export async function listar_pedidos() {
    const resultado = await Pedido.findAll()
    return { rows: resultado.map(p => p.toJSON()) }
}

export async function buscar_pedido(id) {
    const resultado = await Pedido.findByPk(id)
    return resultado ? { rows: [resultado.toJSON()] } : { rows: [] }
}

export async function atualizar_pedido(id, dados) {
    const atualizacao = {}
    if (dados.idProduto) atualizacao.idProduto = dados.idProduto
    if (dados.idCliente) atualizacao.idCliente = dados.idCliente
    if (dados.local) atualizacao.local = dados.local
    if (dados.horaPedido) atualizacao.horaPedido = dados.horaPedido
    if (dados.horaEntrega !== undefined) atualizacao.horaEntrega = dados.horaEntrega
    if (dados.valorTotal !== undefined) atualizacao.valorTotal = dados.valorTotal
    
    await Pedido.update(atualizacao, {
        where: { id }
    })
    
    const resultado = await Pedido.findByPk(id)
    return { rows: [resultado.toJSON()] }
}

export async function deletar_pedido(id) {
    await Pedido.destroy({
        where: { id }
    })
    return { rows: [{ id }] }
}
