const express=require("express");
const router=express.Router();
const insertdb=require("../public/db");

//function to check request body
//middleware
const validateRequest=(req,res,next)=>{   
    if(req.body.firstName==undefined||req.body.lastName==undefined||req.body.email==undefined||req.body.password==undefined){
        res.status(400).send({"error":"body does not contain required fields"});
        return;
    }
    next();
}

//router function
router.post("/",validateRequest,(req,res)=>{
    try{
        const user={
            "firstName":req.body.firstName,
            "lastName":req.body.lastName,
            "email":req.body.email,
            "password":req.body.password
        }
        insertdb.signup(user).then((result)=>{
            res.status(200).send({"Success":result});
        })
        .catch((error)=>{
            res.status(500).send({"Error":"Server Error"});
        })
    }
    catch(e){
        console.log("Some error occurred");
        console.log(e); 
        res.status(500).send({"Error":"Server Error"});   
    }
});
module.exports=router;