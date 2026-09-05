// Import the User model
const User = require("../Models/User");
// Import the Worker model
const Worker = require("../Models/Worker.js");
const ServiceRequest = require("../Models/ServiceRequest");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Find all users in the database
        // "-password" prevents the password field from being returned
        const users = await User.find().select("-password");

        // Send the users to the admin
        res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        // Handle server/database errors
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};
// Get all workers
const getAllWorkers = async (req, res) => {
    try {
        // Find all worker profiles
        const workers = await Worker.find();

        // Send worker profiles to the admin
        res.status(200).json({
            message: "Workers fetched successfully",
            workers
        });

    } catch (error) {
        // Handle database/server errors
        res.status(500).json({
            message: "Failed to fetch workers",
            error: error.message
        });
    }
};
// Verify a worker
const verifyWorker = async (req, res) => {
    try {
        // Get the Worker document ID from the URL
        const { id } = req.params;

        // Find the worker by Worker _id
        const worker = await Worker.findById(id);

        // Check whether the worker exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Mark the worker as verified
        worker.isVerified = true;

        // Save the updated worker profile
        await worker.save();

        // Send the updated worker information
        res.status(200).json({
            message: "Worker verified successfully",
            worker
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to verify worker",
            error: error.message
        });
    }
};
// Unverify a worker
const unverifyWorker = async (req, res) => {
    try {
        // Get the Worker document ID from the URL
        const { id } = req.params;

        // Find the worker by Worker _id
        const worker = await Worker.findById(id);

        // Check whether the worker exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Remove the worker's verified status
        worker.isVerified = false;

        // Save the updated worker profile
        await worker.save();

        // Send the updated worker information
        res.status(200).json({
            message: "Worker verification removed successfully",
            worker
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to remove worker verification",
            error: error.message
        });
    }
};

// Block a user
const blockUser = async (req, res) => {
    try {
        // Get the User document ID from the URL
        const { id } = req.params;

        // Find the user by their _id
        const user = await User.findById(id);

        // Check whether the user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent an admin from blocking their own account
        if (user._id.toString() === req.user.userId.toString()) {
            return res.status(400).json({
                message: "You cannot block your own admin account"
            });
        }

        // Mark the user's account as blocked
        user.isBlocked = true;

        // Save the updated user
        await user.save();

        // Remove the password before sending the response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send the updated user information
        res.status(200).json({
            message: "User blocked successfully",
            user: userResponse
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to block user",
            error: error.message
        });
    }
};
// Unblock a user
const unblockUser = async (req, res) => {
    try {
        // Get the User document ID from the URL
        const { id } = req.params;

        // Find the user by their _id
        const user = await User.findById(id);

        // Check whether the user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Mark the user's account as unblocked
        user.isBlocked = false;

        // Save the updated user
        await user.save();

        // Remove the password before sending the response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send the updated user information
        res.status(200).json({
            message: "User unblocked successfully",
            user: userResponse
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to unblock user",
            error: error.message
        });
    }
};
// Block a worker
const blockWorker = async (req, res) => {
    try {
        // Get the Worker document ID from the URL
        const { id } = req.params;

        // Find the worker profile
        const worker = await Worker.findById(id);

        // Check whether the worker exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Find the User account connected to this worker
        const user = await User.findById(worker.userId);

        // Check whether the connected user exists
        if (!user) {
            return res.status(404).json({
                message: "Worker user account not found"
            });
        }

        // Prevent an admin from blocking their own account
        if (user._id.toString() === req.user.userId.toString()) {
            return res.status(400).json({
                message: "You cannot block your own admin account"
            });
        }

        // Block the worker's user account
        user.isBlocked = true;

        // Save the updated user
        await user.save();

        // Remove password before sending the response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send success response
        res.status(200).json({
            message: "Worker blocked successfully",
            worker,
            user: userResponse
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to block worker",
            error: error.message
        });
    }
};

// Unblock a worker
const unblockWorker = async (req, res) => {
    try {
        // Get the Worker document ID from the URL
        const { id } = req.params;

        // Find the worker profile
        const worker = await Worker.findById(id);

        // Check whether the worker exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Find the User account connected to this worker
        const user = await User.findById(worker.userId);

        // Check whether the connected user exists
        if (!user) {
            return res.status(404).json({
                message: "Worker user account not found"
            });
        }

        // Unblock the worker's user account
        user.isBlocked = false;

        // Save the updated user
        await user.save();

        // Remove password before sending the response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send success response
        res.status(200).json({
            message: "Worker unblocked successfully",
            worker,
            user: userResponse
        });

    } catch (error) {
        // Handle invalid ID or database/server errors
        res.status(500).json({
            message: "Failed to unblock worker",
            error: error.message
        });
    }
};



// Get all service requests
const getAllServiceRequests = async (req, res) => {
    try {
        // Find all service requests
        // Populate userId to get the requesting user's details
        // Populate workerId to get the worker's profile details
        const serviceRequests = await ServiceRequest.find()
            .populate("userId", "name email phone role")
            .populate(
                "workerId",
                "name phone profession village district state dailyWage isAvailable isVerified"
            )
            .sort({ createdAt: -1 });

        // Send all service requests to the admin
        res.status(200).json({
            message: "Service requests fetched successfully",
            serviceRequests
        });

    } catch (error) {
        // Handle database/server errors
        res.status(500).json({
            message: "Failed to fetch service requests",
            error: error.message
        });
    }
};
// Get dashboard statistics for admin
const getDashboardStats = async (req, res) => {
    try {

        // Count all users
        const totalUsers = await User.countDocuments();

        // Count all workers
        const totalWorkers = await Worker.countDocuments();

        // Count verified workers
        const verifiedWorkers = await Worker.countDocuments({
            isVerified: true
        });

        // Count unverified workers
        const unverifiedWorkers = await Worker.countDocuments({
            isVerified: false
        });

        // Count all service requests
        const totalServiceRequests = await ServiceRequest.countDocuments();

        // Count pending requests
        const pendingRequests = await ServiceRequest.countDocuments({
            status: "pending"
        });

        // Count accepted requests
        const acceptedRequests = await ServiceRequest.countDocuments({
            status: "accepted"
        });

        // Count completed requests
        const completedRequests = await ServiceRequest.countDocuments({
            status: "completed"
        });

        // Count rejected requests
        const rejectedRequests = await ServiceRequest.countDocuments({
            status: "rejected"
        });

        // Count cancelled requests
        const cancelledRequests = await ServiceRequest.countDocuments({
            status: "cancelled"
        });

        // Send statistics to admin
        return res.status(200).json({
            message: "Dashboard statistics fetched successfully",

            statistics: {
                totalUsers,
                totalWorkers,
                verifiedWorkers,
                unverifiedWorkers,
                totalServiceRequests,
                pendingRequests,
                acceptedRequests,
                completedRequests,
                rejectedRequests,
                cancelledRequests
            }
        });

    } catch (error) {

        return res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};


// Delete a service request
const deleteServiceRequest = async (req, res) => {
    try {
        // Get service request ID from URL
        const { id } = req.params;

        // Find and delete the service request
        const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

        // If request does not exist
        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        // Send success response
        return res.status(200).json({
            message: "Service request deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete service request",
            error: error.message
        });
    }
};
// Delete a user
const deleteUser = async (req, res) => {
    try {
        // Get user ID from URL
        const { id } = req.params;

        // Prevent admin from deleting their own account
        if (id === req.user.userId.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        // Find the user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};


// Delete a worker
const deleteWorker = async (req, res) => {
    try {
        // Get worker ID from URL
        const { id } = req.params;

        // Find the worker
        const worker = await Worker.findById(id);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Prevent deleting the admin's own account
        if (worker.userId.toString() === req.user.userId.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        // Delete the worker profile
        await Worker.findByIdAndDelete(id);

        // Delete the associated user account
        await User.findByIdAndDelete(worker.userId);

        return res.status(200).json({
            message: "Worker and associated user account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete worker",
            error: error.message
        });
    }
};

// Export controller functions
module.exports = {
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


};