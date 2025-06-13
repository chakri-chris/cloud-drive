const mongoose = require('mongoose')
const fileSchema = new mongoose.Schema({
    path : {
        type: String,
        required: [true , 'path is required']
    },
    originalname : {
        type: String,
        required: [true , 'OriginalName is required']
    },
    user :{
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'user',
        required: [true , 'user is required']
    } 
})

const File = mongoose.model('File' , fileSchema)
module.exports = File;