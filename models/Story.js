const mongoose = require('mongoose')
const StroySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    body:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'public',
        enum:['public','private'],
    },
    user:{//in order to know who did what we need to identify the user
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
module.exports = mongoose.model('Stroy',StroySchema)