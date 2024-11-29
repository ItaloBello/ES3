// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')
const Usuario = require('../Models/Usuario');

//Model(tabela sem comando sql) - Usuarios
const Quadra = sequelize.define('quadra',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
        
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: false 
})

Quadra.hasOne(Usuario);
Usuario.hasMany(Quadra);

module.exports = Quadra;