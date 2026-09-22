const validator=require("validator");
const usermodel=require("../models/user.model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const sendEMail=require("../utils/sendEmail");

const OTPModel=require("../models/otp");


const register=async (req,res) => {
   try {
    const {name,email,password}=req.body
    if(!name ||!email || !password){
        return res.status(400).json({
            message:"all fileds required"
        })
    }
    const user=await usermodel.findOne({email:email});
    if(user){
        return res.status(409).json({
            message:"user already exits"
        })
    }

    await OTPModel.deleteMany({email:email});
    const otp=Math.floor(100000+Math.random()*900000);
    console.log(otp);
    await OTPModel.create({
        email,
        otp:otp,
otpExpire:Date.now()+10*60*1000
    })
    await sendEMail(
        email,
        "Email verifycation",
        otp,
         "Please use the following OTP to verify your email."
    )
     return res.status(200).json({
            message: "OTP sent successfully. Please verify your email."
        });

   } catch (error) {
    return res.status(500).json({
        message:"server error",
        error:error.message
    })
   }
}
// const sendOtp=async (req,res) => {
//     try {
//         const {email}=req.body;
//         if(!email){
//             return res.send("email is required")
//         }
//    const otp=Math.floor(100000+Math.random()*900000);
// await OTPModel.create({
//     email:email,
//     otp:otp,
//     otpExpire:Date.now() +10*60*1000
// })
//    console.log(otp);
//  await sendEMail(
//  email,
//   "Email verification",
//   otp,
//   "This OTP is valid for 10 minutes"
// );
//    res.send("otp sent on mail check")
        
//     } catch (error) {
//           res.status(500).json({
//             message:"server error",
//             error:error.message
//         })
//     }
// }
const login=async (req,res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"all fileds required"
            })
        }
 const user=await usermodel.findOne({email:email});
 if(!user){
    return res.status(401).json({
message:"invalid email or password"
    })
 }

 if(!user.isveryfied){
    return res.status(401).json({
        message:"Please verify your email first"
    })
 }

 const ispassword=await bcrypt.compare(password,user.password);
 if(!ispassword){
    return res.status(401).json({
        message:"invalid email or password"
    })
 }
 const accessToken=jwt.sign({userId:user._id},process.env.accessSecret,{expiresIn:"15m"})
 const refreshToken=jwt.sign({userId:user._id},process.env.refreshSecret,{expiresIn:"7d"})

    res.cookie("AccessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
 res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
         return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { name, password, otp, email } = req.body;

        
        if (!otp || !email || !name || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

       
        const user = await usermodel.findOne({ email: email });

        if (user) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const otpdata = await OTPModel.findOne({
            email: email
        });

        if (!otpdata) {
            return res.status(404).json({
                message: "OTP not found or already used"
            });
        }

        
        if (otpdata.otpExpire.getTime() < Date.now()) {
            
            await OTPModel.deleteOne({
                _id: otpdata._id
            });

            return res.status(401).json({
                message: "OTP is expired"
            });
        }

        
        if (otp.toString() !== otpdata.otp.toString()) {
            return res.status(401).json({
                message: "OTP is invalid"
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await usermodel.create({
            name: name,
            email: email,
            password: hashedPassword
        });
          newUser.isveryfied=true;
       newUser.save();


        // 8. Delete OTP after successful verification
        await OTPModel.deleteOne({
            _id: otpdata._id
        });

        
        return res.status(201).json({
            message: "Email verified and account created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const ResendOtp=async (req,res) => {
    try {
        const {email}=req.body;
        if(!email){
            return  res.status(400).json({
                message:"email is required"
            })
        }
        await OTPModel.deleteMany({email});
        const newotp=Math.floor(100000+Math.random()*900000)
        await OTPModel.create({
            email,
            otp:newotp,
            otpExpire:Date.now()+10*60*1000
        })
       await sendEMail(
             email,
    "Email verification",
    newotp,
    "This OTP is valid for 10 minutes"
        )
        console.log(newotp);

        return res.status(200).json({
            message: "New OTP sent successfully"
        });


    } catch (error) {
          res.status(500).json({
            message:"server error",
            error:error.message
        })
    }
}
module.exports={register,login,verifyOtp,ResendOtp}