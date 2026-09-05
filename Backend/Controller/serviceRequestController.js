const ServiceRequest = require("../Models/ServiceRequest.js");
const Worker = require("../Models/Worker");
const Notification = require("../Models/Notification");
// Create a service request
const createServiceRequest = async (req, res) => {
    try {

        // Get data from request body
        const {
            workerId,
            service,
            description,
            date,
            location
        } = req.body;


        // Step 1: Validate required fields
        if (
            !workerId ||
            !service ||
            !description ||
            !date ||
            !location
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        // Step 2: Validate date
        const requestDate = new Date(date);

        if (isNaN(requestDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }


        // Step 3: Check whether worker exists
        const worker = await Worker.findById(workerId);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }


        // Step 4: Check worker availability
        if (!worker.isAvailable) {
            return res.status(400).json({
                message: "Worker is currently unavailable"
            });
        }


        // Step 5: Check for existing active request
        const existingRequest = await ServiceRequest.findOne({
            userId: req.user.userId,
            workerId: workerId,
            status: {
                $in: ["pending", "accepted"]
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already have an active service request for this worker"
            });
        }


        // Step 6: Create service request
        const serviceRequest = await ServiceRequest.create({
            userId: req.user.userId,
            workerId: workerId,
            service: service,
            description: description,
            date: requestDate,
            location: location,
            status: "pending"
        });


        // Step 7: Create notification for worker
        console.log("Creating notification for worker:", worker.userId);
        await Notification.create({
            userId: worker.userId,
            message: `New service request for ${service}`,
            type: "service_request",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });


        // Step 8: Send response
        res.status(201).json({
            message: "Service request created successfully",
            serviceRequest
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to create service request",
            error: error.message
        });
    }
};
const getWorkerRequests = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      userId: req.user.userId
    })
      .select("_id")
      .lean();

    if (!worker) {
      return res.status(404).json({
        message: "Worker profile not found"
      });
    }

    const requests = await ServiceRequest.find({
      workerId: worker._id
    })
      .populate("userId", "name email phone")
      .populate("workerId", "name profession dailyWage")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      requests
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch worker requests",
      error: error.message
    });
  }
};

const acceptServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        const serviceRequest = await ServiceRequest.findOne({
            _id: id,
            workerId: worker._id
        });

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        if (serviceRequest.status !== "pending") {
            return res.status(400).json({
                message: "Only pending requests can be accepted"
            });
        }

        serviceRequest.status = "accepted";

        await serviceRequest.save();

        // Create notification for the user
        await Notification.create({
            userId: serviceRequest.userId,
            message: "Your service request has been accepted",
            type: "request_accepted",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });

        res.status(200).json({
            message: "Service request accepted successfully",
            serviceRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept service request",
            error: error.message
        });
    }
};


const rejectServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        const serviceRequest = await ServiceRequest.findOne({
            _id: id,
            workerId: worker._id
        });

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        if (serviceRequest.status !== "pending") {
            return res.status(400).json({
                message: "Only pending requests can be rejected"
            });
        }

        serviceRequest.status = "rejected";

        await serviceRequest.save();

        // Create notification for the user
        await Notification.create({
            userId: serviceRequest.userId,
            message: "Your service request has been rejected",
            type: "request_rejected",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });

        res.status(200).json({
            message: "Service request rejected successfully",
            serviceRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject service request",
            error: error.message
        });
    }
};
const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      userId: req.user.userId
    })
      .populate("workerId", "name profession dailyWage serviceCharge village district state location isAvailable isVerified averageRating totalReviews")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      requests
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service requests",
      error: error.message
    });
  }
};
const cancelServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceRequest = await ServiceRequest.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        if (serviceRequest.status !== "pending") {
            return res.status(400).json({
                message: "Only pending requests can be cancelled"
            });
        }

        // Find the worker to get the worker's User ID
        const worker = await Worker.findById(serviceRequest.workerId);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        serviceRequest.status = "cancelled";

        await serviceRequest.save();

        // Create notification for the worker
        await Notification.create({
            userId: worker.userId,
            message: "A service request has been cancelled",
            type: "request_cancelled",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });

        res.status(200).json({
            message: "Service request cancelled successfully",
            serviceRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel service request",
            error: error.message
        });
    }
};
const completeServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        const serviceRequest = await ServiceRequest.findOne({
            _id: id,
            workerId: worker._id
        });

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        if (serviceRequest.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted requests can be completed"
            });
        }

        serviceRequest.status = "completed";

        await serviceRequest.save();

        // Create notification for the user
        await Notification.create({
            userId: serviceRequest.userId,
            message: "Your service request has been completed",
            type: "service_completed",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });

        res.status(200).json({
            message: "Service request completed successfully",
            serviceRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete service request",
            error: error.message
        });
    }
};


module.exports = {
    createServiceRequest,
    getWorkerRequests,
    acceptServiceRequest,
    rejectServiceRequest,
    getMyServiceRequests,
    cancelServiceRequest,
    completeServiceRequest
};