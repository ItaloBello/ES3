const express = require("express")
const router = express.Router()
const donoQuadra = require('../Models/donoQuadra');
const Quadra = require('../Models/Quadra');
const bcrypt = require('bcrypt');
const { Op, where } = require('sequelize');
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
        if(data.data.status === 'invalid'){
                erros.push({ texto: "Email inválido!" });
            }
    }
    if (req.body.senha.length < 8) erros.push("Senha muito curta!(adicione no mínimo 8 caracteres)");
    if (req.body.senha !== req.body.senha2) erros.push("As senhas são diferentes!");

    const documento = req.body.documento.replace(/\D/g, '');
    if (documento.length === 11 && !validarCPF(documento)) erros.push("CPF inválido!");
    if (documento.length === 14 && !validarCNPJ(documento)) erros.push("CNPJ inválido!");
    
    const celular = req.body.celular.replace(/\D/g, ''); 

    if (celular.length !== 11 || !/^([1-9]{2})9[0-9]{8}$/.test(celular)) {
        erros.push("Celular inválido!");
    }

    if (erros.length > 0) {
        return res.status(400).json({ errors: erros });
    }

    try {
        const usuarioExistente = await donoQuadra.findOne({
            where: { [Op.or]: [{ email: req.body.email }, { documento }] }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuário já cadastrado com este email ou CPF!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.senha, salt);

        const novoUsuario = await donoQuadra.create({
            nome: req.body.nome,
            documento,
            email: req.body.email,
            celular: req.body.celular, 
            senha: hash,
        });

        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ error: "Erro ao autenticar" });
        if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ error: "Erro ao logar" });
            return res.json({ message: "Login realizado com sucesso!", id: user.id});
        });
    })(req, res, next);
});

router.post('/cadastrarQuadra', async (req, res) => {
    
    try{
        const nome = req.body.nome;
        const tipo = req.body.tipo;
        const userId = req.body.usuarioId;
    
    const quadra = {
        nome: nome,
        tipo: tipo,
        usuarioId: userId
    }
    await Quadra.create(quadra);
    return res.json({message: "Quadra cadastrada com sucesso!"})
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/quadras/:id', async (req,res) => {
    
    try{ 
        const userId = req.params.id
        const quadras = await Quadra.findAll({where: {usuarioId: userId}});
        return res.json(quadras)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/info/:id', async (req,res) => {
    
    try{ 
        const userId = req.params.id
        const user = await donoQuadra.findOne({where: {id: userId}});
        return res.json(user)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/quadra/:id', async (req,res) => {
    
    try{ 
        const quadraId = req.params.id
        const quadra = await Quadra.findOne({where: {id: quadraId}});
        return res.json(quadra)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.put('/atualizarQuadra/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, tipo, usuarioId } = req.body;

        const quadra = {
            nome: nome,
            tipo: tipo,
            usuarioId: usuarioId
        };

        const [updated] = await Quadra.update(quadra, { where: { id: id } });

        if (updated) {
            return res.json({ message: "Quadra editada com sucesso!" });
        } else {
            return res.status(404).json({ message: "Quadra não encontrada para o ID especificado." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar quadra: " + error.message });
    }
});


router.delete('/excluirQuadra/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Deleta a quadra pelo ID
        const result = await Quadra.destroy({ where: { id: id } });

        if (result === 0) {
            return res.status(404).json({ message: "Quadra não encontrada." });
        }

        return res.json({ message: "Quadra deletada com sucesso!" });
    } catch (error) {
        console.error(error); // Log do erro para depuração
        return res.status(500).json({ message: "Erro ao deletar a quadra.", error: error.message });
    }
});

//exportando o modulo
module.exports = router