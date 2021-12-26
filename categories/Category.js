const Sequelize = require ("sequelize"); 
const connection = require("../database/database")

//Criando a tabela categoria
const Category = connection.define(`categories`,{
    title:{
        type:Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
 

module.exports = Category;