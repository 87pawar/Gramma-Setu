const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true

        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },


        profileImage: {
            type: String,
            default: ""
        },

        profession: {
            type: String,
            required: true,
            enum: [
                "Electrician",
                "Plumber",
                "Construction Worker",
                "Painter",
                "Carpenter",
                "Farm Labour",
                "Tractor Driver",
                "Mechanic",
                "Labour"
            ]
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            default: ""
        },

        dailyWage: {
            type: Number,
            required: true,
            min: 0
        },

        serviceCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        village: {
            type: String,
            required: true
        },

        district: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        location: {
            type: String,
            default: ""
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },
        averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
},

totalReviews: {
    type: Number,
    default: 0,
    min: 0
},
    },
    {
        timestamps: true
    }
);
// Index for finding workers by profession
workerSchema.index({ profession: 1 });

// Index for location-based worker searches
workerSchema.index({ village: 1 });
workerSchema.index({ district: 1 });
workerSchema.index({ state: 1 });

// Index for checking available workers
workerSchema.index({ isAvailable: 1 });

// Index for sorting workers by rating
workerSchema.index({ averageRating: -1 });

// Index for sorting workers by daily wage
workerSchema.index({ dailyWage: 1 });




const Worker =
    mongoose.models.Worker || mongoose.model("Worker", workerSchema);
module.exports = Worker;