const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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

        serviceRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceRequest",
            required: true,
            unique: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Index for retrieving all reviews of a worker
reviewSchema.index({ workerId: 1 });

// serviceRequestId already has a unique index because it uses unique: true

module.exports = mongoose.model("Review", reviewSchema);