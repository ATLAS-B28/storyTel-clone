//middleware for not letting anybody to get in dashboard
//with auth
//for that we create a auth.js middleware
//also not go to login page everytime even after auth
//middleware-> is just a function having access to request and response objects
module.exports = {
    ensureAuth:function (req,res,next){
      if(req.isAuthenticated()){//on requested check auth or not
        return next()//if logged in then go to dashboard
      }else{
         res.redirect('/')//if not redirect to login
      }
    },
    ensureGuest: function (req,res,next){//if user logged in then goes to landing page we don't 
        //them to see the login 
        if(!req.isAuthenticated()){
            //not auth then redirect to landing page

            return next()
        }else{
            res.redirect('/dashboard')
        }
    }
}