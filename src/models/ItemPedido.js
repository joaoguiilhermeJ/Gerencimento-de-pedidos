import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

export const ItemPedido = sequelize.define('ItemPedido', {
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Pedido',
            key: 'id'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Produto',
            key: 'id'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    precoUnitario: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'ItemPedido',
    timestamps: false
})
