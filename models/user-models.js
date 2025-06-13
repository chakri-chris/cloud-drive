const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        lowercase : true,
        unique: true,
        trim : true,
        minlength : [3 , 'input must be at least 3 characters long'],

    },
    phonenumber: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        minlength : [10 , 'input must be at least 10 characters long'],
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase : true,
        minlength : [ 10 , 'input must be at least 10 characters long'],
    },
    password:{
        type: String,
        required: true,
        trim : true,
        minlength : [8 , 'input must be at least 8 characters long'],
    }

})

const user = mongoose.model('user' , UserSchema);
module.exports = user;