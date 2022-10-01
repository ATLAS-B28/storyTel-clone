const express =require('express')
const router = express.Router()
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const Story = require('../models/Story')
//login main page get / main page
router.get('/', ensureGuest ,async (req,res)=>{//add middleware as second argument
    res.render('login',{
        layout:'login'
    })
}) 
//dashboard GET /dashboard
router.get('/dashboard', ensureAuth , async (req,res)=>{
 /*res.render('dashboard',{
    name:req.user.firstName,
 })//we get booted out everytime the server gets restart so */
 //to store session in database we use connect-mongo package
 try{
    const stories = await Story.find({user: req.user.id}).lean()//limit the user to the logged in with the id
    //and use lean() to have plain js not mongoDb documents
    res.render('dashboard',{
        name: req.user.firstName,
        stories,
    })
 } catch(err){
    console.error(err)
    res.render('error/500')
 }
}) 
module.exports= router