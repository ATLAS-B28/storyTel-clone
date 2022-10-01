const express =require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')
//show add page 
// GET /stories/add
router.get('/add' ,ensureAuth ,async (req,res)=>{//add middleware as second argument
    res.render('stories/add')
}) 
//process the add form and post the stories
//POSt /stories
router.post('/',ensureAuth,async (req,res)=>{
    try {
        //we need a middleware that is body parser
        req.body.user = req.user.id//as it is part of the story schema
        //create
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
//get request for /stories
router.get('/',ensureAuth,async (req,res)=>{
    try {
        //fetch the stories
        const stories = await Story.find({status:'public'})
                     .populate('user')
                     .sort({createdAt:'desc'})
                     .lean()

        res.render('stories/index',{stories})
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// GET /stories/:id
router.get('/add' ,ensureAuth ,async (req,res)=>{//add middleware as second argument
    res.render('stories/add')
}) 
router.get('/:id' ,ensureAuth ,async (req,res)=>{//add middleware as second argument
    //fetch
    try {
     let story = await Story.findById(req.params.id)
                .populate('user')//after find the id render the story and the user info
                .lean()
 
     //check for stroy
     if(!story){
         return res.render('error/404')
     }
     res.render('stories/show',{
         story  //render story in show layout
     })
    } catch (err) {
     console.error(err)
     res.render('error/404')
    }
 }) 
//to show the edit page and for that we need to pass 
//in the stories for them to be edited
//show edit page
//GET /stories/edit/:id
router.get('/edit/:id' ,ensureAuth ,async (req,res)=>{//add middleware as second argument
    try {
        const story = await Story.findOne({
            _id: req.params.id 
         }).lean()
         //adding lean will allow access resolution 
         //of property status,body and title 
         if(!story){
             return res.render('error/404')
         }
     
         //redirect if not owner
         if(story.user != req.user.id){
               res.redirect('/stories')
         }else{
             res.render('stories/edit',{
                 story,
             })
         }
    } catch (err) {
        console.error(err)
        return res.render('error/500')   
    }
   

}) 
//update the sotry PUT /stories/:id
router.put('/:id' ,ensureAuth ,async (req,res)=>{//add middleware as second argument
    try {
       //fetch the story by id
       let story = await Story.findById(req.params.id).lean()
       if(!story){
       return res.render('error/404')
       }
       //redirect if not owner
       if(story.user != req.user.id){
          res.redirect('/stories')
        }else{
           story = await Story.findOneAndUpdate({_id: req.params.id},req.body,{
               new:true,
               runValidators:true
            })//req.body is to be replaced and run the validators and set new property to true
           res.redirect('/dashboard')
        }
     } catch (err) {
        console.error(err)
        return res.render('error/500')
     }
    
}) 
//delete DELETE /stories/:id
router.delete('/:id',ensureAuth,async (req,res)=>{
     try {
        await Story.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')
     } catch (err) {
        console.error(err)
        return res.render('error/500')
     }
})
//get user stroies
//GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports= router