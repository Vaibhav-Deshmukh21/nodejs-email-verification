const dotenv=require("dotenv")
dotenv.config();
const app=require("./app.js");
const db=require("./config/db.js")
const model=require("./models/user.model.js")
db();

model()









app.listen(3000,()=>{
    console.log(`server is running on ${process.env.port} port`);
    
})