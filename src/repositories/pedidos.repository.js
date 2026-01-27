import { Pedido } from "../models/Pedido.js";
import { QueryTypes } from "sequelize";
import sequelize from '../config/database.js'
import { ItemPedido } from '../models/ItemPedido.js'


export async function cadastrar_pedido_com_procedure(dados) {
  // dados.itens: [{ idProduto, quantidade }, ...]

  // Monta string do array ::tipo_item_pedido[]
  // Ex.: ARRAY[ (1,2), (3,1) ]::tipo_item_pedido[]
  const itensArrayLiteral =
    "ARRAY[" +
    dados.itens
      .map((i) => `(${Number(i.idProduto)}, ${Number(i.quantidade)})`)
      .join(", ") +
    "]::tipo_item_pedido[]";

  const sql = `
    CALL cadastrar_pedido(
      :idCliente,
      :local,
      ${itensArrayLiteral}
    )
  `;

  // Se a procedure não faz SELECT, não há linhas de retorno
  await sequelize.query(sql, {
    replacements: {
      idCliente: dados.idCliente,
      local: dados.local,
    },
    type: QueryTypes.RAW,
  });

  const [rows] = await sequelize.query(sql, {
    replacements: { idCliente: dados.idCliente, local: dados.local },
    type: QueryTypes.SELECT,
  });

  return { rows };
}

export async function listar_pedidos() {
  const resultado = await Pedido.findAll();
  return { rows: resultado.map((p) => p.toJSON()) };
}

export async function buscar_pedido(id) {
  const resultado = await Pedido.findByPk(id);
  return resultado ? { rows: [resultado.toJSON()] } : { rows: [] };
}

export async function atualizar_pedido(id, dados) {
  const atualizacao = {};

  // Usa !== undefined para permitir 0 / false
  if (dados.idProduto !== undefined) atualizacao.idProduto = dados.idProduto;
  if (dados.idCliente !== undefined) atualizacao.idCliente = dados.idCliente;
  if (dados.local !== undefined) atualizacao.local = dados.local;
  if (dados.horaPedido !== undefined) atualizacao.horaPedido = dados.horaPedido;
  if (dados.horaEntrega !== undefined)
    atualizacao.horaEntrega = dados.horaEntrega;
  if (dados.valorTotal !== undefined) atualizacao.valorTotal = dados.valorTotal;

  // Se não tiver nada para atualizar, evita UPDATE vazio
  if (Object.keys(atualizacao).length === 0) {
    const existente = await Pedido.findByPk(id);
    if (!existente) {
      return { rows: [] };
    }
    return { rows: [existente.toJSON()] };
  }

  const [afetados] = await Pedido.update(atualizacao, { where: { id } });

  if (afetados === 0) {
    // nenhum registro com esse id
    return { rows: [] };
  }

  const resultado = await Pedido.findByPk(id);
  return { rows: [resultado.toJSON()] };
}

export async function deletar_pedido(id) {
  await ItemPedido.destroy({
    where: { idPedido: id }
  })
  await Pedido.destroy({
    where: { idPedido: id }
  })

  return { rows: [{ id }] }
}


export async function entregar_pedido(idPedido, local) {
  await sequelize.query(
    'CALL entregar_pedido(:idPedido, :local)',
    {
      replacements: { idPedido, local },
      type: QueryTypes.RAW
    }
  )

  // buscar o pedido atualizado para retornar
  const resultado = await Pedido.findByPk(idPedido)
  return { rows: [resultado.toJSON()] }
}

