const express=require('express');
const jwt=require("jsonwebtoken");
const router=express.Router();
router.get("/",(req,res)=>{
    try{
        const bearerToken=req.headers["authorization"];
        if(bearerToken==undefined){
            res.render("error");
            return;
        }
        token=bearerToken.split(' ')[1];
        jwt.verify(token,"secretKey",(err,data)=>{
            if(err){
                console.log(err);
                res.render("error");
                return;
            }
            else{
                res.render("index");
            }
    });
    }
    catch(e){
        res.send({"error":"Some error occured"});
        console.log(e);
    }
    })

module.exports=router;