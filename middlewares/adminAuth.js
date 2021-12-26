function adminAuth(req, res, next){ //padrão de parametros
    if(req.session.user != undefined){//obrigando o user a logar
        next()
    }else{
        res.redirect("/login")
    }
}

module.exports = adminAuth