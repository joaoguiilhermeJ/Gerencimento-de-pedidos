

CREATE OR REPLACE PROCEDURE cadastrar_pedido(
    IN p_idCliente INT,
    IN p_local     VARCHAR,
    IN p_itens     tipo_item_pedido[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_idPedido   INT;
    v_item       tipo_item_pedido;
    v_valorUnit  FLOAT;
    v_valorTotal FLOAT := 0;
BEGIN
    -- Cria o pedido
    INSERT INTO "Pedido" ("idCliente", "local", "horaPedido", "valorTotal")
    VALUES (p_idCliente, p_local, CURRENT_TIMESTAMP, 0)
    RETURNING "idPedido" INTO v_idPedido;

    -- Insere itens e acumula o total
    FOREACH v_item IN ARRAY p_itens LOOP
        SELECT "valor"
          INTO v_valorUnit
          FROM "Produto"
         WHERE "idProduto" = v_item.idProduto;

        INSERT INTO "ItemPedido" (
            "idPedido",
            "idProduto",
            "quantidade",
            "valorUnitario"
        )
        VALUES (
            v_idPedido,
            v_item.idProduto,
            v_item.quantidade,
            v_valorUnit
        );

        v_valorTotal := v_valorTotal + (v_valorUnit * v_item.quantidade);
    END LOOP;

    -- Atualiza valor total do pedido
    UPDATE "Pedido"
       SET "valorTotal" = v_valorTotal
     WHERE "idPedido" = v_idPedido;
END;
$$;


CREATE OR REPLACE PROCEDURE entregar_pedido(
    IN p_idPedido INT,
    IN p_local    VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Pedido"
       SET "horaEntrega" = CURRENT_TIMESTAMP,
           "local"       = p_local
     WHERE "idPedido"    = p_idPedido;
END;
$$;

