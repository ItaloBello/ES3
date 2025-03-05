const { Sequelize } = require('sequelize');

// Criar uma nova instância do Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',  // Endereço do servidor de banco de dados
  username: 'postgres',  // Seu nome de usuário do PostgreSQL
  password: 'Admin',  // Sua senha do PostgreSQL
  database: 'SPORTECH',  // Nome do banco de dados
  logging: false,  // Desabilita os logs SQL, caso não queira ver as consultas no console
});

// Testando a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida ao PostgreSQL!');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao PostgreSQL:', error);
  });

module.exports = sequelize;
