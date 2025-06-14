const express = require('express');
const router = express.Router();
const { body , validationResult } = require('express-validator');
const User = require('../models/user-models')
const bcrypt = require('bcrypt');
// const user = require('../models/user-models');
const jwt = require('jsonwebtoken');
router.get('/test' , (req , res)=>{
    res.send('user test route')
})
router.get("/register" , (req , res)=>{
    res.render('register');
})
router.post("/register",
    body('email').trim().isEmail(),
    body('phonenumber').trim().isLength({min:10}). withMessage('phone number must be 10 digit'),
    body('password').trim().isLength({min:5}). withMessage('password must be at least 5 characters long'),
     async(req , res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() , message : "invalid data"});
        
    }
    const {username , email, phonenumber , password} = req.body;
    const hashpassword = await bcrypt.hash(password , 10);
    const newUser = await User.create({
        username ,
        email ,
        phonenumber,
        password: hashpassword
    })
    res.json(newUser);
    
})

router.get('/login' , (req , res)=>{
    const message = req.query.message
    res.render('login' , {message});
})
router.post('/login' , 
    body('username').trim().isLength({min:5}) ,
    body('password').trim().isLength({min:5}) ,
    async (req , res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json ({
                errors : errors.array(),
                message:"Invalid Data",
            }
            )
    } 

    const { username , password} = req.body
    const founduser = await User.findOne( {username} );
    if(!founduser){
        return res.status(400).json({
            message : "username or password incorrect"
        })
    }
    const ismatch = await bcrypt.compare(password , founduser.password)
    if(!ismatch){
        return res.status(400).json({
            message : "username or password incorrect"
        })
    }
    const token = jwt.sign({
        id : founduser._id ,
        email : founduser.email,
        username : founduser.username
    } , process.env.JWT_SECRET,  )

    res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
});
res.redirect('/home');

    
}
)

router.get('/logout' ,(req , res)=>{
    res.clearCookie('token');
    res.redirect('/user/login?message=Logout Successfull');
})

module.exports = router;