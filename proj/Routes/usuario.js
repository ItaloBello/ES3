const express = require("express")
const router = express.Router()
const Usuario = require('../Models/Usuario')
const bodyParser = require('body-parser')
const { validarCPF, validarCNPJ, validarEmail } = require('../Utils/validarDocumento')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const passport = require('passport')
const eAdmin = require("../Helpers/eAdmin")


router.use(bodyParser.json());

router.get("/registro", function(req, res) {
    res.render("usuario/registro")
});

router.post("/registro", async function(req, res) {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido!" });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null || !validarEmail(req.body.email)) {
        erros.push({ texto: "Email inválido!" });
    }
    else{
        const apiKey = '6da1404dd0bccc266369810e5495509947162526';
        const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${req.body.email}&api_key=${apiKey}`);
        const data = await response.json();
        if(!data.data){

            erros.push({ texto: "Email inválido!" });
        }
        if(data.data.status === 'invalid'){
                erros.push({ texto: "Email inválido!" });
            }
    }

    if (!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) {
        erros.push({ texto: "Endereço inválido!" });
    }

    if (!req.body.dataNasc || typeof req.body.dataNasc == undefined || req.body.dataNasc == null) {
        erros.push({ texto: "Data inválida!" });
    }

    if (req.body.senha.length < 8) {
        erros.push({ texto: "Senha muito curta!(adicione no mínimo 8 caracteres)" });
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes!" });
    }

    // Validar o CPF
    const documento = req.body.documento.replace(/\D/g, '');

    if (documento.length === 11) {
        if (!validarCPF(documento)) {
            erros.push({ texto: "CPF inválido!" });
        }
    } else if (documento.length === 14) {
        if (!validarCNPJ(documento)) {
            erros.push({ texto: "CNPJ inválido!" });
        }
    } else {
        erros.push({ texto: "Documento deve ter 11 ou 14 dígitos!" });
    }

    if (erros.length > 0) {
        return res.render("usuario/registro", { erros }); 
    } else {
        // Verificando se já existe um usuário com o email ou CPF
        Usuario.findOne({
            where: {
                [Op.or]: [{ email: req.body.email }, { documento: documento }]
            }
        }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Usuário já cadastrado com este email ou CPF!");
                return res.redirect("/usuario/registro"); 
            } else {
                //Salvando o usuario
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    documento: documento,
                    email: req.body.email,
                    endereco: req.body.endereco,
                    data_nascimento: req.body.dataNasc,
                    senha: req.body.senha
                });

                // Hashing da senha
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento");
                            return res.redirect("/"); 
                        }

                        novoUsuario.senha = hash;

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário salvo com sucesso");
                            res.redirect("/");
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro durante a criação");
                            res.redirect("/usuario/registro");
                        });
                    });
                });
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        });
    }
})


// Start do login
router.get("/login", (req,res) => {
    res.render("usuario/login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuario/login",
    failureFlash: true
}));

// Exportando o módulo
module.exports = router;