const express = require("express");

const router = express.Router();
const upload = require("../Middleware/uploadMiddleware");
const { uploadWorkerImage } = require("../Controller/workerController");

const { createWorkerProfile,
    getworkersprofile,
    getWorkerById,
    updateWorkerProfile,
updateWorkerAvailability} = require("../Controller/workerController");

const { authmiddleware } = require("../Middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    validateWorkerProfile
} = require("../Middleware/workerValidationMiddleware");

router.post(
    "/profile",
    authmiddleware,
    validateWorkerProfile,
    createWorkerProfile
);
// router.post(
//     "/profile",
//     authmiddleware,
//     roleMiddleware("Worker"),
//     createWorkerProfile
// );
 router.get("/",getworkersprofile);
 router.get("/:id", getWorkerById);
router.patch(
    "/profile",
    authmiddleware,
    validateWorkerProfile,
    updateWorkerProfile
);
 router.patch("/availability",authmiddleware,updateWorkerAvailability);
 // Upload worker profile image
// authmiddleware → checks logged-in user
// upload.single("profileImage") → accepts one image
// uploadWorkerImage → saves image path to database
router.patch(
    "/profile/image",
    authmiddleware,
    upload.single("profileImage"),
    uploadWorkerImage
);

module.exports = router;