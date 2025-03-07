const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Conexão com o banco de dados PostgreSQL

// Modelo (tabela sem comando SQL) - Usuarios
const donoQuadra = sequelize.define('donoQuadra', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
    ,
    senha: {
        type: DataTypes.CHAR(60),
        allowNull: false,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, 
        allowNull: false,
    },
}, {
    timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = donoQuadra;
