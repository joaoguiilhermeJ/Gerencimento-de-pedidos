import * as pedidoRepository from "../repositories/pedidos.repository.js";
import * as produtoRepository from "../repositories/produtos.repository.js";
import * as clienteRepository from "../repositories/cliente.repository.js";

export async function cadastrar_pedido(dados) {
  const idCliente = Number(dados.idCliente);
  const local = String(dados.local ?? "").trim();
  const itens = dados.itens; // array de { idProduto, quantidade }

  if (!Number.isInteger(idCliente) || idCliente <= 0) {
    throw new Error("ID do cliente inválido");
  }
  if (!local) {
    throw new Error("Local é obrigatório");
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error("Itens são obrigatórios");
  }

  for (const item of itens) {
    const idProduto = Number(item.idProduto);
    const quantidade = Number(item.quantidade);
    if (!Number.isInteger(idProduto) || idProduto <= 0) {
      throw new Error("ID de produto inválido");
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("Quantidade inválida");
    }
  }

  const result = await pedidoRepository.cadastrar_pedido_com_procedure({
    idCliente,
    local,
    itens,
  });

  return result.rows?.[0] ?? { mensagem: "Pedido cadastrado com sucesso" };
}

export async function listar_pedidos() {
  const result = await pedidoRepository.listar_pedidos();
  return result.rows;
}

export async function buscar_pedido(id) {
  const idPedido = Number(id);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    throw new Error("ID inválido");
  }

  const result = await pedidoRepository.buscar_pedido(idPedido);
  return result.rows[0];
}

export async function atualizar_pedido(id, dados) {
  const idPedido = Number(id);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    throw new Error("ID inválido");
  }

  // Apenas campos pertencentes à tabela Pedido
  const idCliente =
    dados.idCliente !== undefined ? Number(dados.idCliente) : undefined;
  const local =
    dados.local !== undefined ? String(dados.local).trim() : undefined;
  const horaEntrega =
    dados.horaEntrega !== undefined
      ? dados.horaEntrega
        ? new Date(dados.horaEntrega)
        : null
      : undefined;
  // valorTotal geralmente é calculado, mas se for permitido editar manualmente (ex: desconto), ok.
  const valorTotal =
    dados.valorTotal !== undefined ? Number(dados.valorTotal) : undefined;

  if (
    idCliente !== undefined &&
    (!Number.isInteger(idCliente) || idCliente <= 0)
  ) {
    throw new Error("ID do cliente inválido");
  }

  // Validação: se local foi passado, não pode ser vazio
  if (local !== undefined && local === "") {
    throw new Error("Local não pode ser vazio");
  }

  if (horaEntrega instanceof Date && isNaN(horaEntrega.getTime())) {
    throw new Error("Hora de entrega inválida");
  }

  const dadosAtualizar = {};

  if (idCliente !== undefined) dadosAtualizar.idCliente = idCliente;
  if (local !== undefined) dadosAtualizar.local = local;
  if (horaEntrega !== undefined) dadosAtualizar.horaEntrega = horaEntrega;
  if (valorTotal !== undefined) dadosAtualizar.valorTotal = valorTotal;

  // Se não houver campos para atualizar, retorna o pedido atual
  if (Object.keys(dadosAtualizar).length === 0) {
    const pedidoAtual = await pedidoRepository.buscar_pedido(idPedido);
    if (!pedidoAtual.rows[0]) throw new Error("Pedido não encontrado");
    return pedidoAtual.rows[0];
  }

  const result = await pedidoRepository.atualizar_pedido(
    idPedido,
    dadosAtualizar,
  );
  if (!result.rows[0]) throw new Error("Pedido não encontrado");

  return result.rows[0];
}

export async function deletar_pedido(id) {
  const idPedido = Number(id);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    throw new Error("ID inválido");
  }

  const result = await pedidoRepository.deletar_pedido(idPedido);
  return result.rows[0];
}

export async function entregar_pedido(id, dados) {
  const idPedido = Number(id);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    throw new Error("ID inválido");
  }

  const local = String(dados.local ?? "").trim();
  if (!local) {
    throw new Error("Local é obrigatório");
  }

  const result = await pedidoRepository.entregar_pedido(
    idPedido,
    local,
  );
  return result.rows[0];
}
