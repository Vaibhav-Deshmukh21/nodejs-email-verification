const mongoose=require("mongoose");
async function db() {
    try {
        await mongoose.connect(process.env.mongourl);
        console.log("db connected");
    } catch (error) {
        console.log("server error");
        console.log(error.message);
    
    }
}

module.exports=db;