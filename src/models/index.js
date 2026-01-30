import sequelize from '../config/database.js';
import { Cliente } from './Cliente.js';
import { Produto } from './Produto.js';
import { Pedido } from './Pedido.js';
import { ItemPedido } from './ItemPedido.js';

// Associações Cliente e Pedido
Cliente.hasMany(Pedido, { foreignKey: 'idCliente' });
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' });

// Associações Pedido e ItemPedido
Pedido.hasMany(ItemPedido, { foreignKey: 'idPedido' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

// Associações Produto e ItemPedido
Produto.hasMany(ItemPedido, { foreignKey: 'idProduto' });
ItemPedido.belongsTo(Produto, { foreignKey: 'idProduto' });

export {
  sequelize,
  Cliente,
  Produto,
  Pedido,
  ItemPedido
};
