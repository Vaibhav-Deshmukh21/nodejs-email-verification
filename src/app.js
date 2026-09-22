const express=require("express");
const app=express();
app.use(express.json());
const userRouter=require("./routes/userR");
app.use("/api",userRouter);



module.exports=app;
