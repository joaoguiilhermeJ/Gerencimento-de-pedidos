import { Produto } from '../models/Produto.js'


export async function cadastrar_produto(dados) {
  const resultado = await Produto.create({
    nomeProduto: dados.nomeProduto,  
    tipo: dados.tipo,
    valor: dados.valor,
    quantidade: dados.quantidade,
    status: dados.status
  })

  return { rows: [resultado.toJSON()] }
}


export async function listar_produtos() {
    const resultado = await Produto.findAll()
    return { rows: resultado.map(p => p.toJSON()) }
}

export async function buscar_produto(id) {
    const resultado = await Produto.findByPk(id)
    return resultado ? { rows: [resultado.toJSON()] } : { rows: [] }
}

export async function atualizar_produto(id, dados) {
  const atualizacao = {}

  if (dados.nomeProduto !== undefined) {
    atualizacao.nomeProduto = dados.nomeProduto
  }
  if (dados.tipo !== undefined) {
    atualizacao.tipo = dados.tipo
  }
  if (dados.valor !== undefined) {
    atualizacao.valor = dados.valor
  }
  if (dados.quantidade !== undefined) {
    atualizacao.quantidade = dados.quantidade
  }
  if (dados.status !== undefined) {
    atualizacao.status = dados.status
  }

  await Produto.update(atualizacao, { where: { id } })

  const resultado = await Produto.findByPk(id)
  return { rows: [resultado.toJSON()] }
}


export async function deletar_produto(id) {
    await Produto.destroy({
        where: { idProduto: id }
    })
    return { rows: [{ id }] }
}
