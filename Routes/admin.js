const express = require("express")
const router = express.Router()


router.get('/', function(req, res){
    res.render("admin/index")

})



//exportando o modulo
module.exports = router