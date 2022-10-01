const express =require('express')
const passport = require('passport')
const router = express.Router()
//auth with google get /auth/google
router.get('/google',passport.authenticate('google',{scope:['profile']}))//the info we are bringing is profile 
//google auth callback GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req,res)=>{
   //if auth successfull then go to dashboard
    res.redirect('/dashboard')
})
//logout
///auth/logout
router.get('/logout',(req,res)=>{
    //logout method on request
    req.logOut((req,res)=>{
        console.log('Logged Out');
    })
    res.redirect('/')
})
module.exports= router