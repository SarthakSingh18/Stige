const express=require("express");
const logindb=require("../public/db")
const jwt=require("jsonwebtoken");
const router=express.Router();
const checkRequest=(req,res,next)=>{
    try{
        //checking request body
        if(req.body.email==undefined||req.body.password==undefined){
            res.status(400).send({"error":"body does not contain required fields"});
            return;
        }
    next();
}
    catch(e){
        res.status(500).send({"error":"Some error occured"});
        console.log(e);
    }
}
router.get("/",checkRequest,(req,res)=>{
    try{
        const user={
        "email" : req.body.email,
        "password" : req.body.password
    }
        logindb.login(user).then((result)=>{
            jwt.sign({user:user},"secretKey",(err,token)=>{
                if(err){
                    res.status(500).send({"Error":err});  
                    return;
                }
                res.status(200).send({
                    "success":"logged in",
                    "token":token
                    })
            })
        })
        .catch((error)=>{
            res.status(500).send({"Error":error});  

        })
    }
    catch(e){
        console.log("Some error occurred");
        console.log(e);  
        res.status(500).send({"Error":"Server Error"});  
    }
});
module.exports=router;