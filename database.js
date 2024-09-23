const Sequelize = require('sequelize');
const sequelize = new Sequelize('dbCadastro', 'root', 'Andre200@@', {
    host: "localhost",
    dialect: 'mysql'
})

//Testa sucesso ou falha de conectar
sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso!")
}).catch(function(erro){
    console.log("Falha ao se conectar!" +erro)
})


module.exports = sequelize;