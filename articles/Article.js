const Sequelize = require ("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

//Criando a tabela artigos
const Article = connection.define(`articles`,{
    title:{
        type:Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//Dando join entre artigos e categorias
Category.hasMany(Article) //hasMany -> Tem muitos
Article.belongsTo(Category) //BelongsTo -> Pertence A
 

module.exports = Article;