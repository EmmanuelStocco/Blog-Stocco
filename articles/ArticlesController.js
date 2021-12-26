 const express = require("express")
const router = express.Router() 
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

//tela de artigos home
router.get("/admin/articles", adminAuth,  (req,res)=> {
    Article.findAll({
        include: [{model: Category}] //inclua o modula Category na busca de artigos pelo relacionamento JOIN
    }).then((articles, categories) =>{
        res.render("admin/articles/index", {articles: articles, categories: categories }) 
    })
})

//tela de criação de artigos
router.get("/admin/articles/new", adminAuth, (req,res)=> {
    Category.findAll().then(categories =>{ //pesqsuisando todas as categorys e recebendo a lista
        res.render("admin/articles/new", {categories: categories}) //renderizar uma a ma categoria
    })
})

//rota para save ao clicar no botão
router.post("/articles/save", adminAuth, (req, res)=> {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category
    

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=> {
        res.redirect("/admin/articles")
    })

})


//deletando um artigo
router.post("/articles/delete", adminAuth, (req, res)=> { //com essa rota vamos receber o id
    var id = req.body.id; //recebendo o id do campo invisivel 
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({ //Apagando categoria
                where: {
                    id: id //Category.id == id que foi passado, apague
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else { //caso não seja um numero
            res.redirect("/admin/articles")
        }
    } else { //Null
        res.redirect("/admin/articles")
    }
})

//edição de artigos
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit",{categories: categories, article: article})
            })
 
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

router.post("/articles/update", adminAuth, (req, res)=>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title)       
    },{
        where: {
            id: id
        }
    }).then(()=> {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/")
    })
})

//Realizando a paginação
router.get("/articles/page/:num", (req, res)=> {
    var page = req.params.num;
    var offset = 0
    
    if(isNaN(page) || page==1){
        offset = 0
    } else {
        offset = (parseInt(page) - 1) * 4
    }

    Article.findAndCountAll({ //pesquisa todos os elemtnos do BD e retorna q auantidade de quantos elemento tem na tabela 
        limit: 4,
        offset: offset, //exibe a partir do digitado {pag 0 - 3, 2 4-7. etc}
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => { //retorna crows _> lista de artigos
        var next
        if(offset + 4 >= articles.count){
            next= false
        } else {
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })
})

module.exports = router;

/*
/articles/page/:num
*/