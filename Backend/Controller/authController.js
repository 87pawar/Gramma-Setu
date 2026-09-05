//imoprt User model
const User=require("../Models/User.js");
//import bcrypt
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//create registeruser
const registerUser=async(req,res)=>{
    try{
        //get/recive data from the req.body
        const{
           name,
            email,
            phone,
            password,
            role,
            location 
        }=req.body;
        if(!name||!email||!phone||!password||!role||!location){
            return res.status(400).json({
                message:"Please do not leave any field empty"
            });
        }
        //is email exists
        const emailExists=await User.findOne({email});
        if(emailExists){
            return res.status(400).json({
                message:"Email already exists"
            });
        }
        //hashpassword
        const hashpass=await bcrypt.hash(password,10);
        //create a new user using user model
        const user=new User({
             name,
            email,
            phone,
            password: hashpass,
            role,
            location
        });
        const saveduser=await user.save();
        res.status(201).json({
            message:"the user Registered Successfully",
            user:{
                id: saveduser._id,
                name: saveduser.name,
                email: saveduser.email,
                phone: saveduser.phone,
                role: saveduser.role,
                location: saveduser.location

            }
        });
         

    }
   catch(error){
    console.error(error);
    res.status(500).json({
        massage:"Server error"
    })

        }
};
//login function
const loginUser=async(req,res)=>{
    try{
        const{
            email,
            password

        }=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Emal and Password are required"
            })
        }
        // search user automatically in mangoDB using email
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(401).json({
                message:"Invalid Email "
            })
        }
        //compare hashpassword
        const comparepass=await bcrypt.compare(
            password,
            user.password
        );
        if(!comparepass){
            return res.status(401).json({
                message:"Wrong Password"
            })
        }
        // Check whether the account has been blocked by an admin
        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by an administrator"
            });
        }
        //create JWT
        const token=jwt.sign(
        {
            name:user.name,
            userId:user._id,
            role:user.role
        },
       process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }

    );
    //send response
    res.status(200).json({
        message:"Login Successfull",
        token,
        user:{
             name:user.name,
            userId:user._id,
            email:user.email,
            role:user.role
        }
    });
    }
    catch(error){
        res.status(500).json({
            message:"Server Error",
            error:error.message
        });
    }

};
const getprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile accessed successfully",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
const changePassword = async (req, res) => {
    try {
        // Get passwords from request body
        const { currentPassword, newPassword } = req.body;
        // Check new password
if (!newPassword) {
    return res.status(400).json({
        message: "New password is required"
    });
}

if (newPassword.length < 6) {
    return res.status(400).json({
        message: "New password must contain at least 6 characters"
    });
}

if (newPassword.length > 100) {
    return res.status(400).json({
        message: "New password cannot exceed 100 characters"
    });
}

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        // Find logged-in user using JWT userId
       const user = await User.findById(req.user.userId).select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check current password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        // Prevent using the same password
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save new password
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to change password",
            error: error.message
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        // Don't reveal whether email exists
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent"
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing it in database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Store hashed token
        user.resetPasswordToken = hashedToken;

        // Token expires after 15 minutes
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        // Temporary development response
        // Later we will send this token through email
        res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent",

            resetToken: resetToken
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to process forgot password request",
            error: error.message
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Validate required fields
        if (!resetToken || !newPassword) {
            return res.status(400).json({
                message: "Reset token and new password are required"
            });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        // Hash the token received from the user
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Find user with matching token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: new Date()
            }
        });

        // Token invalid or expired
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        user.password = hashedPassword;

        // Delete reset token so it cannot be reused
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reset password",
            error: error.message
        });
    }
};
module.exports={registerUser,loginUser,getprofile,changePassword,forgotPassword,resetPassword};