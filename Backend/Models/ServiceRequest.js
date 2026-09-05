const mongoose = require("mongoose");
 

const serviceRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
            required: true
        },

        service: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

// Index for finding requests created by a user
serviceRequestSchema.index({ userId: 1 });

// Index for finding requests assigned to a worker
serviceRequestSchema.index({ workerId: 1 });

// Index for filtering requests by status
serviceRequestSchema.index({ status: 1 });

// Compound index for worker request lists filtered by status
serviceRequestSchema.index({ workerId: 1, status: 1 });

// Compound index for user's requests filtered by status
serviceRequestSchema.index({ userId: 1, status: 1 });

const ServiceRequest =
    mongoose.models.ServiceRequest ||
    mongoose.model("ServiceRequest", serviceRequestSchema);

module.exports = ServiceRequest;