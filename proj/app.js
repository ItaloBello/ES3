//Carregando os módulos
require('dotenv').config();
const express = require('express')
const { engine }  = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const sequelize = require('./database');
const adminRoute = require('./Routes/admin')
const userRoute = require('./Routes/usuario')
const path = require('path')
const Usuario = require('./Models/Usuario')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./Config/auth')(passport)




//Config

    // Sessão
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    //Flash
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash());
    

    // Middleware para configurar variáveis globais para o `flash`
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error')[0]; 
        res.locals.user = req.user || null;

        next();
    });

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //HandleBars
        app.engine('handlebars', engine({defaultLayout: 'main'}))    
        app.set('view engine', 'handlebars');

    //MySql -> database.js



    //Path
        app.set('views', path.join(__dirname, 'views'));
        app.use(express.static(path.join(__dirname, 'Public')))
    
    
// Teste de Conexão
sequelize.authenticate()
    .then(function() {
        console.log('Conexão com o MySQL estabelecida com sucesso.');
        
        // Criando a tabela(deixar comentado o force dps de criar para criar 1x só)
        Usuario.sync(/*{ force: true }*/)
    })
    .then(function() {

//Rotas
        //ADM
        app.use('/admin', adminRoute);
        //USUARIOS
        app.use('/usuario', userRoute);
})

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home'); 
});

//Outros
const PORT = 8081
app.listen(PORT, function(){
    console.log("Servidor Rodando na porta" + PORT)
})