const express = require('express');
const app = express();
const Userrouter = require('./routes/user-routes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const indexrouter = require('./routes/index-routes')
app.use(express.static('public'));

dotenv.config(); // tnis is env file that we required from the env... it should be loaded before we try to connect the database ....
const connectToDb = require('./config/db'); // here we are connecting to the database rememeber to write this below the dotnev because we need env file to get read the database url from it
// const router = require('./routes/user-routes');
connectToDb();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//to setup ejs
app.set('view engine', 'ejs');

// app.get('/' ,(req , res)=>{
//     res.render('index');
// })
app.use('/' , indexrouter)
app.use('/user' , Userrouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
