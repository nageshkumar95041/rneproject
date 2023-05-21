const express =require("express");
const serviceMancoll=require("../model/serviceManSchema")
const userCollection=require("../model/userSchema")
const cloudinary=require("../utils/cloudinary")
const upload=require("../utils/multer")
const path=require("path")
const jwt=require("jsonwebtoken")
const router=express.Router()
const bcrypt=require("bcryptjs")
const auth=require("../model/auth");
const contactCollection = require("../model/contact");
const dotenv=require("dotenv").config()
const accountSid=process.env.ACCOUNTSID;
const authToken=process.env.AUTHTOKEN;



router.get('/cook', (req, res) => {
	res
		.status(202)
		.cookie('Name', 'Rahul Ahire', {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send("cookie being initialised")
});

// router.post("/login",async(req,res)=>{
//     try{
    
//         const userName=req.body.userName
//        const password=req.body.password
//         const serviceMan=  await serviceMancoll.findOne({userName})
//        const dbPassword=serviceMan.password
//         if(dbPassword===password){

//             const token=  await serviceMan.generateAuthToken()
            
           
//             // res.cookie("jwtToken",token,{httpOnly:true})
            

//             res.cookie("nishikant","nishikant",{httpOnly:true,sameSite: 'strict',path: '/',
// 			expires: new Date(new Date().getTime() + 100 * 1000)}).json({login:true
// 			})

//             // res.json({
//             //     login:true,
//             //     message:"login success"
//             // })
        
//         }
//         else{
//             res.json(
//                 {
//                     message:"invalid credential",
//                     login:"false"
//                 }
//             )
//         }
        

//     }catch(err){
//         res.json({
//             message:"invalid credential",
//             login:"false"
//         })
//     }
// })
router.post("/login",async(req,res)=>{

    try{
        const userName=req.body.userName
       const password=req.body.password
        const serviceMan=  await userCollection.findOne({userName})
        if(!serviceMan){
         res.json({error:"invalid user name",login:"false"})
        }else{

            const dbPassword=serviceMan.password
          const login= await bcrypt.compare(password,dbPassword)
        
    //  console.log(login)

        if(login){
       
                   const token=  await serviceMan.generateAuthToken()
                   res.cookie("jwt",token,{httpOnly:true,sameSite: 'None',path: '/',
                   expires: new Date(new Date().getTime() + 100 * 1000),secure:true}).json({login:true
                   })
                //    res.json({
                //     login:true,

                //    })
               


               }
               else{
                res.json({
                    login:false,

                   })
               }
            }
    }catch(err){
        res.json({
            login:true,

           })
    }
})



router.post("/serviceManRegister",upload.single('image'),async(req,res)=>{
    try{

        
        const {name,email,userName,skill,text,password}=req.body
        if(!name || !email || !userName || !skill || !text || !password){
            res.json("please fill the required field")
        }
        else{
            
            const cloudRes= await cloudinary.uploader.upload(req.file.path)
            const {name,email,userName,skill,password}=req.body


            const serviceMan= new serviceMancoll({name:name,email:email,userName:userName,skill:skill,text:text,password:password,profile_pic:cloudRes.secure_url,cloudinary_id:cloudRes.public_id})
            const result= await serviceMan.save();
            res.status(201).json({
                message:"serviceMan registered",
                type:"success"
            })

            
        }
    
    }catch(err){
        console.log(err)
    }
})

// handle getRequest

router.get("/serviceManRegister" ,async(req,res)=>{
    try{
     const serviceMan=  await serviceMancoll.find()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get userManRegistered 
router.get("/userRegistered" ,async(req,res)=>{
    try{
     const users=  await userCollection.find()
      res.status(200).json(users)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get contact message
router.get("/contactMessage" ,async(req,res)=>{
    try{
     const users=  await contactCollection.find()
      res.status(200).json(users)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get count of total seervice-man

router.get("/serviceManCount",async(req,res)=>{
    try{
     const serviceMan=  await serviceMancoll.count()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success"
        })
    }
})



// get count of total seervice-man

router.get("/userCount",async(req,res)=>{
    try{
     const serviceMan=  await userCollection.count()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success"
        })
    }
})



// handle individula get request for serviceman
// router.get("/serviceManRegister/:id", async(req,res)=>{
//     try{
//         const _id=req.params.id
       
//      const serviceMan=  await serviceMancoll.findById(_id)
//       res.status(200).json(serviceMan)
//     }catch(err){
//         res.status(404).json(err)
//     }
// })

// handle individula get request for serviceman
router.get("/serviceManRegister/:id",auth, async(req,res)=>{
    try{
        const _id=req.params.id
       
     const serviceMan=  await serviceMancoll.findById(_id)
     if(req.auth){

         res.status(200).json(serviceMan)
     }
     else{
        res.json({
          auth:false  
        })
     }
    }catch(err){
        res.status(404).json(err)
    }
})



// handle category-wise get request for serviceman
router.get("/serviceCategory/:skill",async(req,res)=>{
    try{
        const skill=req.params.skill
        
     const serviceMan=  await serviceMancoll.find({skill:skill})
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json(err)
    }
    

})

// handle delete request
router.delete("/serviceManRegister/:id",async(req,res)=>{
    try{
        const _id=req.params.id
     const serviceMan=  await serviceMancoll.findByIdAndDelete(_id)
        await cloudinary.uploader.destroy(serviceMan.cloudinary_id)
      res.status(200).json({
        message:"removed successfully",
        type:"success"
      })
    }catch(err){
        res.status(404).json(err)
    }
})

// handle userdelete request
router.delete("/userRegistered/:id",async(req,res)=>{
    try{
       const _id=req.params.id
      
       const user=await userCollection.findByIdAndDelete(_id)
       
       res.status(200).json({
        message:"removed successfully",
        type:"success"
       })
    }catch(err){
        res.status(404).json(err);
    }
})

// handle update request
router.patch("/serviceManRegister/:id", upload.single('image'), async(req,res)=>{
    try{
        const _id=req.params.id
        const {name,email,userName,skill,password}=req.body 
        const serviceMan=  await serviceMancoll.findById(_id)
        await cloudinary.uploader.destroy(serviceMan.cloudinary_id)
        const result= await cloudinary.uploader.upload(req.file.path);

        const data={
            name:req.name,
            email:email,
            userName:userName,
            skill:skill,
            profile_pic:result.secure_url,
            cloudinary_id:result.public_id,
            password:password
        }
        const updatedData=await serviceMancoll.findByIdAndUpdate(_id,data,{new:true})

      res.status(201).json(updatedData)
    }catch(err){
        res.status(404).json(err)
    }
})

router.post("/sendSmsToServiceMan",async(req,res)=>{
    try{
    
     const {name,message}=req.body;

const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: message,
     from: '+12545406573',
     to: '+916202079108'
   })
  .then(message => console.log(message.sid));

  res.status(201).json({
    message:true,

  })

    }catch(err){
        console.log(err)
    }
})

// user get,and post request handle
router.post("/userRegistration",async(req,res)=>{
    const {name,email,userName,password}=req.body
    try{
      const users = new userCollection({name:name,userName:userName,email:email,password:password}) 
      const result=  await users.save()
      res.status(201).json({
        message:"user registration successful",
        type:"success"
      })
    }catch(err){
        console.log(err)
    }
})
// contact handle
router.post("/contactmessage",async(req,res)=>{
    const {name,email,userName}=req.body
    try{
      const users = new contactCollection({name:name,email:email,userName:userName}) 
      const result=  await users.save()
      res.status(201).json({
        message:"user registration successful",
        type:"success"
      })
    }catch(err){
        console.log(err)
    }
})





router.post("/userlogin",async(req,res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;
        const user= await userCollection.findOne({userName:userName})
        if(!user){
          res.json({
            message:"Invalid credentials",
            login:false
          })


        }
        else{
            const  dbPassword=user.password;
            const login= await bcrypt.compare(password,dbPassword)
            if(login){

                const token=  await user.generateAuthToken()
                   res.cookie("userToken",token,{httpOnly:true,sameSite: 'None',path: '/',
                   expires: new Date(new Date().getTime() + 100 * 100000000),secure:true}).json({login:true
                   })
           
            }
            else{
                res.json({
                    message:"Invalid credentials",
                    login:false
                  })
            }
        }
    }catch(err){
        console.log(err)
    }
   

})


// router.all("*",(req,res)=>{
//     res.send("<h2>Opps ! page not found<h2/>")
// })

module.exports=router;
