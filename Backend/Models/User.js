const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        //Removes unnecessary spaces from the beginning and end of a string.
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    phone:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        // enum:only specific values are allowed.
        enum:["Farmer","Worker","Admin","user"],
        default:"Admin",
        required:true
    },
    // Stores whether the user's account has been blocked by an admin
    isBlocked: {
        type: Boolean,
        default: false
    },
    location:{
        type:String
    },
    resetPasswordToken: {
    type: String,
    default: null
},

resetPasswordExpires: {
    type: Date,
    default: null
},
/*timestamps:Automatically adds two fields to your MongoDB document:
createdAt
updatedAt*/
},{timestamps:true});
module.exports=mongoose.model("User",userSchema);
