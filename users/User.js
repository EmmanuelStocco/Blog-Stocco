const Sequelize = require ("sequelize"); 
const connection = require("../database/database")

//Criando a tabela categoria
const User = connection.define(`users`,{
    email:{
        type:Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
  
module.exports = User;