import { Cliente } from '../models/Cliente.js'

export async function cadastrar_cliente(dados) {
    const resultado = await Cliente.create({
        nomeCliente: dados.nomeCliente,
        contato: dados.contato,
        documento: dados.documento
    })
    
    return { rows: [resultado.toJSON()] }
}

export async function listar_clientes() {
    const resultado = await Cliente.findAll()
    return { rows: resultado.map(c => c.toJSON()) }
}

export async function buscar_cliente(id) {
    const resultado = await Cliente.findByPk(id)
    return resultado ? { rows: [resultado.toJSON()] } : { rows: [] }
}

export async function atualizar_cliente(id, dados) {
    const atualizacao = {}
    if (dados.nomeCliente) atualizacao.nomeCliente = dados.nomeCliente
    if (dados.contato) atualizacao.contato = dados.contato
    if (dados.documento) atualizacao.documento = dados.documento

    await Cliente.update(atualizacao, {
        where: { id }
    })
    
    const resultado = await Cliente.findByPk(id)
    return { rows: [resultado.toJSON()] }
}

export async function deletar_cliente(id) {
    await Cliente.destroy({
        where: { idCliente: id }
    })
    return { rows: [{ id }] }
}
