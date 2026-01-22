import * as clienteRepository from '../repositories/cliente.repository.js'

export async function cadastrar_cliente(dados) {
    const nomeCliente = String(dados.nomeCliente ?? '').trim()
    const contato = String(dados.contato ?? '').trim()
    const documento = String(dados.documento ?? '').trim()

    if (!nomeCliente) throw new Error('nomeCliente é obrigatório')
    if (!contato) throw new Error('contato é obrigatório')
    if (!documento) throw new Error('documento é obrigatório')

    const result = await clienteRepository.cadastrar_cliente({ nomeCliente, contato, documento })
    return result.rows[0]
}

export async function listar_clientes() {
    const result = await clienteRepository.listar_clientes()
    return result.rows
}

export async function buscar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const result = await clienteRepository.buscar_cliente(idCliente)
    return result.rows[0]
}

export async function atualizar_cliente(id, dados) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const nomeCliente = dados.nomeCliente ? String(dados.nomeCliente).trim() : undefined
    const contato = dados.contato ? String(dados.contato).trim() : undefined
    const documento = dados.documento ? String(dados.documento).trim() : undefined

    if (nomeCliente === '') throw new Error('nomeCliente não pode ser vazio')
    if (contato === '') throw new Error('contato não pode ser vazio')
    if (documento === '') throw new Error('documento não pode ser vazio')

    const dadosAtualizar = {}
    if (nomeCliente) dadosAtualizar.nomeCliente = nomeCliente
    if (contato) dadosAtualizar.contato = contato
    if (documento) dadosAtualizar.documento = documento

    const result = await clienteRepository.atualizar_cliente(idCliente, dadosAtualizar)
    return result.rows[0]
}

export async function deletar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const result = await clienteRepository.deletar_cliente(idCliente)
    return result.rows[0]
}
