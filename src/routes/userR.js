const express=require("express");
const userRouter=express.Router();
const {register,login,verifyOtp,ResendOtp}=require("../controller/userLogic")
userRouter.get("/",(req,res)=>{
    res.status(200).json({
        Message:"app working successfully"
    })
})
userRouter.post("/register",register);
userRouter.post("/login",login);
// userRouter.post("/sendOtp",sendOtp);
userRouter.post("/ResendOtp",ResendOtp);
userRouter.post("/verifyOtp",verifyOtp)
module.exports=userRouter;