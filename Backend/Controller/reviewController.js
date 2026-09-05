const Review = require("../Models/Review");
const ServiceRequest = require("../Models/ServiceRequest");
const Worker = require("../Models/Worker");
const Notification = require("../Models/Notification");

const createReview = async (req, res) => {
    try {
        const {
            serviceRequestId,
            rating,
            comment
        } = req.body;

        if (!serviceRequestId || !rating) {
            return res.status(400).json({
                message: "Service request ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Find completed service request belonging to logged-in user
        const serviceRequest = await ServiceRequest.findOne({
            _id: serviceRequestId,
            userId: req.user.userId
        });

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Service request not found"
            });
        }

        if (serviceRequest.status !== "completed") {
            return res.status(400).json({
                message: "You can review only completed services"
            });
        }

        // Prevent duplicate review
        const existingReview = await Review.findOne({
            serviceRequestId: serviceRequestId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this service"
            });
        }

        // Create review
        const review = await Review.create({
            userId: req.user.userId,
            workerId: serviceRequest.workerId,
            serviceRequestId: serviceRequestId,
            rating: rating,
            comment: comment || ""
        });

        // Get worker
        const worker = await Worker.findById(serviceRequest.workerId);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Recalculate worker rating
        const reviews = await Review.find({
            workerId: worker._id
        });

        const totalReviews = reviews.length;

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating =
            totalReviews > 0
                ? totalRating / totalReviews
                : 0;

        worker.averageRating = Number(averageRating.toFixed(1));
        worker.totalReviews = totalReviews;

        await worker.save();

        // Create notification for worker
        await Notification.create({
            userId: worker.userId,
            message: "You received a new review",
            type: "review",
            serviceRequestId: serviceRequest._id,
            isRead: false
        });

        res.status(201).json({
            message: "Review created successfully",
            review,
            workerRating: {
                averageRating: worker.averageRating,
                totalReviews: worker.totalReviews
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create review",
            error: error.message
        });
    }
};
const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;

    const reviews = await Review.find({ workerId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    res.status(200).json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch worker reviews",
      error: error.message
    });
  }
};

module.exports = {
    createReview,
    getWorkerReviews
};