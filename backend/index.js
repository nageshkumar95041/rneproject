const dotenv=require("dotenv").config()
const { Router } = require("express");
const express=require("express");
const router=require("./router/serviceManRouter")
const cors=require("cors");
const cookieParser=require("cookie-parser")
require("./db/conn")

const app=express();
const port=process.env.port;
//middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(router)


app.listen(8000,()=>{
    console.log(`server is runnig at port no  ${port}`)
})