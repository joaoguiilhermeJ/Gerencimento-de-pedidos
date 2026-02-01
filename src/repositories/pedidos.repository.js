import { Pedido, ItemPedido, Produto, Cliente } from "../models/index.js";
import { QueryTypes } from "sequelize";
import sequelize from '../config/database.js';


export async function cadastrar_pedido_com_procedure(dados) {
  // Garantir que o tipo existe antes de cadastrar (caso o banco tenha sido resetado)
  await sequelize.query(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_item_pedido') THEN
            CREATE TYPE tipo_item_pedido AS (idProduto INT, quantidade INT);
        END IF;
    END $$;
  `);

  // Monta string do array ::tipo_item_pedido[]
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
  const resultado = await Pedido.findByPk(id, {
    include: [{ model: Cliente }]
  });
  if (!resultado) return { rows: [] };

  const itens = await ItemPedido.findAll({
    where: { idPedido: id },
    include: [{ 
      model: Produto,
      attributes: ['nomeProduto']
    }]
  });

  const pedidoJson = resultado.toJSON();
  pedidoJson.itens = itens.map(item => {
    const itemJson = item.toJSON();
    if (item.Produto) {
      itemJson.produto_nome = item.Produto.nomeProduto;
    }
    return itemJson;
  });

  return { rows: [pedidoJson] };
}

export async function atualizar_pedido(id, dados) {
  const atualizacao = {};

  if (dados.idCliente !== undefined) atualizacao.idCliente = dados.idCliente;
  if (dados.local !== undefined) atualizacao.local = dados.local;
  if (dados.horaPedido !== undefined) atualizacao.horaPedido = dados.horaPedido;
  if (dados.horaEntrega !== undefined) atualizacao.horaEntrega = dados.horaEntrega;
  if (dados.valorTotal !== undefined) atualizacao.valorTotal = dados.valorTotal;

  if (Object.keys(atualizacao).length === 0) {
    const existente = await Pedido.findByPk(id);
    return { rows: existente ? [existente.toJSON()] : [] };
  }

  const [afetados] = await Pedido.update(atualizacao, { where: { idPedido: id } });

  if (afetados === 0) return { rows: [] };

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

export async function listar_todos_os_itens() {
  const resultado = await ItemPedido.findAll({
    include: [
      { model: Produto, attributes: ['nomeProduto'] },
      { model: Pedido, attributes: ['horaPedido', 'idCliente', 'local', 'horaEntrega'] }
    ]
  })
  return { rows: resultado.map(i => i.toJSON()) }
}

