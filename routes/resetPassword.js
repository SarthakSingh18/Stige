const express=require("express");
const router=express.Router();
const db=require("../public/db")
router.get("/:token",(req,res)=>{
    db.resetPassword(req.params.token)
    .then(()=>{
        res.render("reset");
    })
    .catch((e)=>{
        console.log(e);
        res.status(404).send({"error":"Error occured"});
    })
});

router.post("/:token",(req,res)=>{
    db.updatePassword(req.body.newPassword,req.params.token)
    .then(()=>{
        res.render("success");
    })
    .catch((e)=>{
        res.render("error occured");
    })
})
module.exports=router;