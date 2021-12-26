//Rotas relacionadas a categorias
//ExpressRouter => 

const express = require("express")
const router = express.Router()
const Category = require("./Category") //Carregando a Model
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/categories/new", (req,res)=> {
    res.render("admin/categories/new")
})

//Formularios usamos post
//Criando categoria
router.post("/categories/save", (req,res)=>{
    var title = req.body.title; //pegando dados do bodyParser
    if(title != undefined){ //se n for nulo vamos salvar no BD

         Category.create({
             title: title,
             slug: slugify(title) //Da slug atravéz do componente que adicionamos -> identa de forma slug
         }).then(()=>{
             res.redirect("/admin/categories")
         })   

    }else{//caso user digite nome vazio redireciona
        res.redirect("/admin/categories/new")
    }
})

//Renderizando View de categoria
router.get("/admin/categories", (req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories})
    })
})

//deletando uma categoria
router.post("/categories/delete", (req, res)=> { //com essa rota vamos receber o id
    var id = req.body.id; //recebendo o id do campo invisivel 
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({ //Apagando categoria
                where: {
                    id: id //Category.id == id que foi passado, apague
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }else { //caso não seja um numero
            res.redirect("/admin/categories")
        }
    } else { //Null
        res.redirect("/admin/categories")
    }
})

//editando uma categoria
router.get("/admin/categories/edit/:id", (req, res)=>{
    var id = req.params.id

    if(isNaN(id)){ //caso digitem id errado
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category => {  //metodo para pesquisar categoria por id
        if(category != undefined){

            res.render("admin/categories/edit", {category: category})

        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

//salvando edição update no BD
router.post("/categories/update", (req, res)=> {
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, slug:slugify(title)},{ //Sequelize agindo//dados que deseja atualizar por quais
        where: {
            id: id //onde tem esse parametro ok
        }
    }).then(()=> {
        res.redirect("/admin/categories")
    })
})

module.exports = router;