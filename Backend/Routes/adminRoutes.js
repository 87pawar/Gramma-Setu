// Import Express
const express = require("express");

const router = express.Router();

// Import authentication middleware
const { authmiddleware } = require("../Middleware/authMiddleware");

// Import admin authorization middleware
const { adminMiddleware } = require("../Middleware/adminMiddleware");

// Import MongoDB ObjectId validation middleware
const { validateObjectId } = require("../Middleware/validateObjectId");

// Import admin controller functions
const {
    getAllUsers,
    getAllWorkers,
    verifyWorker,
    unverifyWorker,
    blockUser,
    unblockUser,
    blockWorker,
    unblockWorker,
    getAllServiceRequests,
    getDashboardStats,
    deleteServiceRequest,
    deleteUser,
    deleteWorker
} = require("../Controller/adminController");


// 
// USER MANAGEMENT
// 

// Get all users
// Requires valid JWT + admin role
router.get(
    "/users",
    authmiddleware,
    adminMiddleware,
    getAllUsers
);


// Block a user
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/users/:id/block",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    blockUser
);


// Unblock a user
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/users/:id/unblock",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    unblockUser
);


// Delete a user
// Requires valid JWT + admin role + valid MongoDB ID
router.delete(
    "/users/:id",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    deleteUser
);


// 
// WORKER MANAGEMENT
// 

// Get all workers
// Requires valid JWT + admin role
router.get(
    "/workers",
    authmiddleware,
    adminMiddleware,
    getAllWorkers
);


// Verify a worker
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/workers/:id/verify",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    verifyWorker
);


// Unverify a worker
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/workers/:id/unverify",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    unverifyWorker
);


// Block a worker
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/workers/:id/block",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    blockWorker
);


// Unblock a worker
// Requires valid JWT + admin role + valid MongoDB ID
router.patch(
    "/workers/:id/unblock",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    unblockWorker
);


// Delete a worker
// Requires valid JWT + admin role + valid MongoDB ID
router.delete(
    "/workers/:id",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    deleteWorker
);


// 
// SERVICE REQUEST MANAGEMENT
// 

// Get all service requests
// Requires valid JWT + admin role
router.get(
    "/service-requests",
    authmiddleware,
    adminMiddleware,
    getAllServiceRequests
);


// Delete a service request
// Requires valid JWT + admin role + valid MongoDB ID
router.delete(
    "/service-requests/:id",
    authmiddleware,
    adminMiddleware,
    validateObjectId,
    deleteServiceRequest
);



// ADMIN DASHBOARD


// Get dashboard statistics
// Requires valid JWT + admin role
router.get(
    "/dashboard",
    authmiddleware,
    adminMiddleware,
    getDashboardStats
);


// Export the router
module.exports = router;