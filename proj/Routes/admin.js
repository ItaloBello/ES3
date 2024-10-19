const express = require("express")
const router = express.Router()
const {eAdmin}= require("../Helpers/eAdmin")


router.get('/', eAdmin, function(req, res){
    let ehAdmin = true
    res.render('admin/index',{ehAdmin:ehAdmin});

})

router.get('/index', eAdmin, function(req, res){
    let ehAdmin = true
    res.render('admin/index',{ehAdmin:ehAdmin});
});

//exportando o modulo
module.exports = router