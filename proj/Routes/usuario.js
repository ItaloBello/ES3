const express = require('express');
const router = express.Router();
const Usuario = require('../Models/Usuario');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const passport = require('passport');
const { validarCPF, validarCNPJ, validarEmail } = require('../Utils/validarDocumento');

router.post("/registro", async (req, res) => {
    let erros = [];

    if (!req.body.nome) erros.push("Nome inválido!");
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
        console.log(data)
        if(data.data.status === 'invalid'){
                erros.push({ texto: "Email inválido!" });
            }
    }
    if (!req.body.endereco) erros.push("Endereço inválido!");
    if (!req.body.dataNasc) erros.push("Data inválida!");
    if (req.body.senha.length < 8) erros.push("Senha muito curta!(adicione no mínimo 8 caracteres)");
    if (req.body.senha !== req.body.senha2) erros.push("As senhas são diferentes!");

    const documento = req.body.documento.replace(/\D/g, '');
    if (documento.length === 11 && !validarCPF(documento)) erros.push("CPF inválido!");
    if (documento.length === 14 && !validarCNPJ(documento)) erros.push("CNPJ inválido!");

    if (erros.length > 0) {
        return res.status(400).json({ errors: erros });
    }

    try {
        const usuarioExistente = await Usuario.findOne({
            where: { [Op.or]: [{ email: req.body.email }, { documento }] }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuário já cadastrado com este email ou CPF!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.senha, salt);

        const novoUsuario = await Usuario.create({
            nome: req.body.nome,
            documento,
            email: req.body.email,
            endereco: req.body.endereco,
            data_nascimento: req.body.dataNasc,
            senha: hash
        });

        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ error: "Erro ao autenticar" });
        if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ error: "Erro ao logar" });
            return res.json({ message: "Login realizado com sucesso!" });
        });
    })(req, res, next);
});

module.exports = router;
