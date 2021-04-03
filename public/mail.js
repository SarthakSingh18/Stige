const express = require("express");
const nodemailer = require("nodemailer");
const crypto=require("crypto");
module.exports = {
  sendMail: function (email,token,hostAddress) {
    return new Promise(async (resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sarthaksingh0900@gmail.com",
          pass: "ldhnogjsnnmslxqw",
        },
      });
      const mail = {
        from: '"sarthak singh" <sarthaksingh0900@gmail.com>',
        to: email,
        subject: "Password Forgot request",
        html: '<p>Please click this url for password change request http://'+hostAddress+'/reset/'+token+'\n\n</p>',
      };

      transporter.sendMail(mail, function (err, info) {
        if (err) {
          console.log(err);
          reject("Error occured while sending mail");
        } else {
          console.log(info);
          resolve("Successfully sended email");
        }
      });
    });
  },
  getToken:function(){
    return new Promise(async(resolve,reject)=>{
        try{
            crypto.randomBytes(20,(err,buf)=>{
                if(err){
                    reject("Server Error")
                    console.log("can't create hash");
                    console.log(err);
                }
                var token=buf.toString('hex');
                resolve(token);
            })
        }catch(e){
            reject("Server Error");
            console.log("Error in try catch in db.js(get token)");
            console.log(e);
        }
    })
}
};
