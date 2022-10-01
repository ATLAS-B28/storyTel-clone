const path = require('path')
const express =require('express')
const dotenv =require('dotenv')
const morgan =require('morgan')
const hbs =require('express-handlebars')
const passport = require('passport')
const sessions = require('express-session')
const method = require('method-override')
const MongoStore = require('connect-mongo')(sessions)
//here we pass in sessions middleware

const connectDB=require('./config/db.js')
const mongoose = require('mongoose')
//load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()
const app = express()
//to parse the posted stories 
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//logging
if(process.env.NODE_ENV==='development'){
    //add the morgan
    app.use(morgan('dev'))
}
//method override
app.use(method(function (req,res){
    if(req.body && typeof req.body ==='object' && '_method' in req.body){
             ///look for urlencoded post and delete it
             let meth = req.body._method//_method is refering to method tag through name tag 
             delete req.body._method//deletes post and replaces it with put and delete
             return meth
    }
}))
//helpers
const {formatDate, truncate, stripTag, editIcon ,select} = require('./helpers/hbs')


//handlebars
app.engine('.hbs',hbs.engine({
    helpers:{//registers the helpers
        formatDate,
        truncate,
        stripTag,
        editIcon,
        select,
    },
    defaultLayout:'main',
    extname:'.hbs'
}))
app.set('view engine','.hbs')


//session middleware

app.use(sessions({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,//don't until some auth happens
    store: new MongoStore({mongooseConnection:mongoose.connection})
}))
//passport middleware
app.use(passport.initialize())
app.use(passport.session())
//we set a express global variable so as to get out of the loop and access the logged in user
//we set it as middleware
app.use(function (req,res,next){
    res.locals.user = req.user || null//we set a global variable
    next()
})
//static folder
app.use(express.static(path.join(__dirname,'public')))
//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))
const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))