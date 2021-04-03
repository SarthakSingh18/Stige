const express=require("express");
const app=express();
const path=require('path');
//GOOGLE OAUTH
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID= '430259369122-fmo7645eiuq3j925qf3mf5fasiivrak5.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
app.use(express.json()) 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
const port=process.env.PORT || 3000;
const signup=require("./routes/signup");
const login=require("./routes/login");
const forgotPassword=require("./routes/forgotPassword");
const resetPassword=require("./routes/resetPassword");
const index=require("./routes/indexRouter");
app.use("/signup",signup);
app.use("/login",login);
app.use("/forgotpassword",forgotPassword);
app.use("/reset",resetPassword);
app.use("/",index);
app.use("/temp",(req,res)=>{
    res.render("temp");
})
app.get("/loginoauth",(req,res)=>{
    res.render("login");
})
app.post("/loginoauth",(req,res)=>{
    let token=req;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
      }
      verify().catch(console.error);
    res.render("login");
})
app.listen(port,()=>{
    console.log(`listening at ${port}`);
});


