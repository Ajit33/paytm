const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://ajit:Uzumaki%4033@cluster0.mzs5ylr.mongodb.net/paytm")

const userSchema= new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    username:String
})

const User=mongoose.model("user",userSchema);


module.exports={User}