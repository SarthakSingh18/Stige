const mongodb=require("mongodb");
const mongoClient=mongodb.MongoClient
const mailService=require("./mail");
module.exports={
    signup:function(user){
        return new Promise(async(resolve,reject)=>{
            try{
                const client=await mongoClient.connect("Secret",
                {useNewUrlParser: true,
                useUnifiedTopology: true});
                const db=client.db("stige");
                const collection=db.collection("users");
                collection.insertOne(user,(err,res)=>{
                    if(err){
                        console.log(err);
                        reject("DataBase error");
                    }
                    resolve("Record inserted successfully");
                    client.close();
                })                
            }catch(e){
                reject("Error occurred in db.js");
                console.log(e);
            }
        })
    },
    login:function(user){
        return new Promise(async(resolve,reject)=>{
            try{
                const client=await mongoClient.connect("Secret",
                {useNewUrlParser: true,
                useUnifiedTopology: true});
                const db=client.db("stige");
                const collection=db.collection("users"); 
                collection.findOne({email:user.email,password:user.password},(err,result)=>{
                    if(err){
                        console.log(err);
                        reject("Database error");
                        return;
                    }
                    if(result==null){
                        reject("No record found(Wrong credentials)");
                        return;
                    }
                    resolve("Success");
                    client.close();
                })
            }
            catch(e){
                reject("Error occurred in db.js");
                console.log(e);
            }
        })
    },
    createHash:function(email,hostAddress){
        return new Promise(async(resolve,reject)=>{
            try{
                const client=await mongoClient.connect("Secret",
                {useNewUrlParser: true,
                useUnifiedTopology: true});
                const db=client.db("stige");
                const collection=db.collection("users"); 
                collection.findOne({email:email},(err,result)=>{
                    if(err){
                        console.log(err);
                        reject("Database error");
                        return;
                    }
                    if(result==null){
                        reject("Email does not exist");
                        return;
                    }
                    mailService.getToken()
                    .then((token)=>{
                        var tokenValue={$set:{resetPasswordToken:token,resetPasswordTokenExpire:Date.now()+3600000}};
                        collection.updateOne({email:email},tokenValue,(err,res)=>{
                            if(err){
                                console.log(err);
                                reject("Database error");
                                return;
                            }
                        });
                        return mailService.sendMail(email,token,hostAddress);
                    })
                    .catch((error)=>{
                        Promise.reject(error);
                    })
                    .then((result)=>{
                        console.log(result);
                        resolve("email sended successfully");
                    })
                    .catch((error)=>{
                        Promise.reject(error);
                    })
                    .catch((error)=>{
                        reject("Some error occured");
                        console.log(error);
                    })
                })
            }
            catch(e){
                reject("Error occurred in db.js");
                console.log(e);
            }
        })
    },
    resetPassword:function(token){
        return new Promise(async(resolve,reject)=>{
            try{
                const client=await mongoClient.connect("Secret",
                {useNewUrlParser: true,
                useUnifiedTopology: true});
                const db=client.db("stige");
                const collection=db.collection("users");
                collection.findOne({resetPasswordToken:token,resetPasswordTokenExpire:{ $gt:Date.now() }},(err,res)=>{
                    if(err){
                        console.log(err);
                        reject("DataBase error");
                    }
                    if(res==null){
                        console.log("token is invalid or expired");
                        reject("token is invalid or expired");
                    }
                    resolve("Token found");
                    client.close();
                })                
            }catch(e){
                reject("Error occurred in db.js");
                console.log(e);
            }
        })
    },
    updatePassword:function(password,token){
        return new Promise(async(resolve,reject)=>{
            try{
                const client=await mongoClient.connect("Secret",
                {useNewUrlParser: true,
                useUnifiedTopology: true});
                const db=client.db("stige");
                const collection=db.collection("users");
                collection.updateOne({resetPasswordToken:token},{$set:{password:password}},(err,res)=>{
                    if(err){
                        console.log(err);
                        reject("DataBase error");
                    }
                    resolve("Record updated successfully");
                    client.close();
                })                
            }catch(e){
                reject("Error occurred in db.js");
                console.log(e);
            }
        })
    }
}
