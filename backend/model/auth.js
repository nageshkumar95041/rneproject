const jwt=require("jsonwebtoken");
const userCollection=require("./userSchema")
const cookieParser=require("cookie-parser")

const auth=async(req,res,next)=>{
    try{
       const token=req.cookies.userToken;

        if(token){

            const verifyUser=jwt.verify(token,"dlfdldiojdfdfjdoffueyrieihkdfdflhfofhfdlfldffdrerbghykii")
            req.auth=true
        }
        else{
            req.auth=false
           
        }
    

          next()

    }catch(err){
       console.log(err)
    }
}

module.exports=auth