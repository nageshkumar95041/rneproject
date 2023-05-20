const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")

const contactSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
   
    email:{
        type:String,
        trim:true
    },
    userName:{
        type:String,
        trim:true
    },
   
    Date:{
        type : Date,
        default : Date.now()
    }
  

})

    



const contactCollection=new mongoose.model("contactCollection",contactSchema);
module.exports=contactCollection;