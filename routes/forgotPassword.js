const express=require("express");
const router=express.Router();
const forgotdb=require("../public/db")
const checkRequest=(req,res,next)=>{
    try{
        //checking request body
        if(req.body.email==undefined){
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
    forgotdb.createHash(req.body.email,req.headers.host)
    .then((result)=>{
        res.status(200).send({"success":"Email is sended check mail"});
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).send({"error":"Some error occured"});
})
})
module.exports=router;
