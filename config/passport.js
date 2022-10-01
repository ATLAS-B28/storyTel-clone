//auth strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
module.exports = function (passport){//we passed this in app.js and here we can access
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECERT,
        callbackURL: '/auth/google/callback'//authorised redirect URIs 
    },
    async (accessToken,refreshToken,profile,done)=>{//done is the call back 
        //construct newuser object from the model of user
        const newUser={
            googleID:profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image:profile.photos[0].value
        }
        try {//look for a user
            let user = await User.findOne({googleID:profile.id})
            if(user){//if there then fire callback done
                done(null,user)
            }else{//if not create new user using the user model
                user = await User.create(newUser)
                done(null,user)
            }
        } catch (err) {
            console.error(err)
        }

    }))
     
    passport.serializeUser((user,done)=>{
            done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=> done(err,user))
    })
   
}
