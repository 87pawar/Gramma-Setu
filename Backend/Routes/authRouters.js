const express=require("express");
//create a new router
const router=express.Router();
//import register function
const {registerUser,resetPassword,forgotPassword,loginUser, getprofile,changePassword}=require("../Controller/authController.js");
const {authmiddleware}=require("../Middleware/authMiddleware.js");
const roleMiddleware = require("../Middleware/roleMiddleware");
const {
    validateRegistration
} = require("../Middleware/validationMiddleware");
const {
    validatePassword
} = require("../Middleware/passwordValidationMiddleware");
const { authLimiter } = require("../Middleware/rateLimitMiddleware");

//Creating  the registration route
// connect the route to the registration controller
router.post(
    "/register",
    authLimiter,
    validateRegistration,
    registerUser
);
router.post(
    "/login",
    authLimiter,
    loginUser
);
router.get("/profile",authmiddleware,getprofile);
router.get("/user",authmiddleware,
    roleMiddleware("user"),
    (req, res) => {
        res.json({
            message: "Welcome User"
        });
    }
);
router.patch(
    "/change-password",
    authmiddleware,
    changePassword
);
router.post(
    "/forgot-password",
    authLimiter,
    forgotPassword
);
router.post(
    "/reset-password",
    authLimiter,
    validatePassword,
    resetPassword
);

module.exports=router;


