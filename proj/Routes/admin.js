const express = require("express")
const router = express.Router()
const {eAdmin}= require("../Helpers/eAdmin")


router.get('/', eAdmin, function(req, res){
    res.render("admin")

})

router.get('/index', eAdmin, function(req, res){
    res.render('admin/index');
});

//exportando o modulo
module.exports = router