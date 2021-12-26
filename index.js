const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

// View engine
app.set('view engine', 'ejs')

// SEssions

app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 3000000} //express pedi para deixar + seguro //cookie para ref a session
}))

//Static
app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso")
    }).catch((error)=> {
        console.log(error)
    })

app.use("/", categoriesController) //add rotas externas de categorias no projeto(categories/)
app.use("/", articlesController)
app.use("/", usersController)

//renderizando tela principal
app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{
        Category.findAll().then(categories =>{ //pesquise todas as categorias e pegue uma a uma
            res.render("index", {articles: articles, categories:categories}) //passasndo para view
        })
    })
})

//busca do artigo por slug
app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
                }
        }).then(article => {
            if(article != undefined){
                Category.findAll().then(categories =>{ //pesquise todas as categorias e pegue uma a uma
                    res.render("article", {article: article, categories:categories}) //passasndo para view
                })
            }else{
                res.redirect("/")
            }
        }).catch( err => {
            res.redirect("/")
        })
    }) 

    //filtrar artigos por categoria
app.get("/category/:slug",(req, res)=> {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
            },
            include: [{model: Article}] //fazer join //inclua nessa busca todos os artigos - array de artigos //identação deve estar errada
    }).then( category => {
        if (category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories: categories});
            })
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        console.log(err)
        res.redirect("/")
    })
})

app.listen(3000, () => {
    console.log("O servido está rodando")
})