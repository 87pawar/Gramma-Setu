const express = require("express");
const router = express.Router();

const { createServiceRequest,
    getWorkerRequests,
    acceptServiceRequest,
    rejectServiceRequest,
    getMyServiceRequests,
cancelServiceRequest,
completeServiceRequest } = require("../Controller/serviceRequestController");
const {authmiddleware} = require("../Middleware/authMiddleware.js");
const {
    validateServiceRequest
} = require("../Middleware/serviceRequestValidationMiddleware");

// Create service request
router.post(
    "/",
    authmiddleware,
    validateServiceRequest,
    createServiceRequest
);
router.get("/worker", authmiddleware, getWorkerRequests);
router.patch("/:id/accept", authmiddleware, acceptServiceRequest);
router.get("/my", authmiddleware, getMyServiceRequests);
router.patch("/:id/cancel", authmiddleware, cancelServiceRequest);
router.patch("/:id/reject", authmiddleware, rejectServiceRequest);
router.patch("/:id/complete", authmiddleware, completeServiceRequest);
module.exports = router;