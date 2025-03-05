const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Conexão com o banco de dados PostgreSQL

// Modelo (tabela sem comando SQL) - Usuarios
const Usuario = sequelize.define('usuarios', {
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
    eAdmin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.CHAR(60),
        allowNull: false,
    },
    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, // Sequelize.NOW funciona no PostgreSQL também
        allowNull: false,
    },
}, {
    timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Usuario;
