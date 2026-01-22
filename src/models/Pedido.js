import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

export const Pedido = sequelize.define('Pedido', {
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Produto',
            key: 'id'
        }
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cliente',
            key: 'id'
        }
    },
    nomeCliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nomeProduto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    local: {
        type: DataTypes.STRING,
        allowNull: false
    },
    horaPedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    horaEntrega: {
        type: DataTypes.DATE,
        allowNull: true
    },
    valorTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'Pedido',
    timestamps: false
})
