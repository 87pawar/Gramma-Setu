const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // User who receives the notification
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Notification message
        message: {
            type: String,
            required: true,
            trim: true
        },

        // Type of notification
        type: {
            type: String,
            enum: [
                "service_request",
                "request_accepted",
                "request_rejected",
                "request_cancelled",
                "service_completed",
                "review"
            ],
            required: true
        },

        // Related service request
        serviceRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceRequest",
            default: null
        },

        // Whether notification has been read
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compound index for quickly retrieving a user's newest notifications
notificationSchema.index({ userId: 1, createdAt: -1 });

// Index for finding unread notifications
notificationSchema.index({ userId: 1, isRead: 1 });
module.exports = mongoose.model(
    "Notification",
    notificationSchema
);