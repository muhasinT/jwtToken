const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrpt = require("bcrypt");
const cookieParser = require("cookie-parser");
const saltRound = 10;

const app = express();

dotenv.config({path:'./config/.env'});
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const users = [
    {username:'feroz', password:'123',token:''}
]


app.get('/',(req,res)=>{

    res.sendFile(__dirname  + "/register.html");
})

app.get('/login',(req,res)=>{
    const token = req.cookies.token;
   try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.sendFile(__dirname  + "/login.html");
   } catch (error) {
    res.send('Invalid Token');
   }
    
})
app.post('/register',(req,res)=>{
    console.log(req.body);
    const {username,password} = req.body;
    bcrpt.hash(password,saltRound,function(err,hash){
        // console.log(hash);
        if(!(username && password)){
            res.status(400).send("Please enter suername and password");
        }else{
            const user = {
                id:123456,
                username,
                password
            }
         
                // Create token
        const token = jwt.sign(
            { user_id: user.id, username },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: process.env.JWT_KEY_EXPIRY,
            }
          );
         
            user.token = token;
            res.status(201).cookie('token',token).send(user);
        }
    })


    
})

app.post('/login',(req,res) =>{
    const {username,password} = req.body;
   
    console.log(username,password);    
    res.send("Login successful");

})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})

