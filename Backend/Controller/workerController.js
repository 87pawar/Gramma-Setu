// controllers/workerController.js

const Worker = require("../Models/Worker");
const User = require("../Models/User");
const Review = require("../Models/Review");

const createWorkerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            profession,
            skills,
            experience,
            description,
            dailyWage,
            serviceCharge,
            village,
            district,
            state,
            location,
            isAvailable
        } = req.body;

        const existingWorker = await Worker.findOne({ userId });

        if (existingWorker) {
            return res.status(400).json({
                message: "Worker profile already exists"
            });
        }

        const worker = new Worker({
            name: user.name,
            userId,
            profession,
            skills,
            experience,
            description,
            dailyWage,
            serviceCharge,
            village,
            district,
            state,
            location,
            isAvailable
        });

        await worker.save();

        res.status(201).json({
            message: "Worker profile created successfully",
            worker
        });
    } catch (error) {
        console.error("Worker profile error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Controller to get worker profiles
const getworkersprofile = async (req, res) => {
  try {
    const {
      profession,
      village,
      district,
      state,
      location,
      isAvailable,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (profession) {
      filter.profession = { $regex: profession, $options: "i" };
    }

    if (village) {
      filter.village = { $regex: village, $options: "i" };
    }

    if (district) {
      filter.district = { $regex: district, $options: "i" };
    }

    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    let sort = { createdAt: -1 };

    if (sortBy === "wage") {
      sort = { dailyWage: 1 };
    }

    if (sortBy === "rating") {
      sort = { averageRating: -1 };
    }

    const workers = await Worker.find(filter)
      .select(
        "userId name profileImage profession skills experience description dailyWage serviceCharge village district state location isAvailable isVerified averageRating totalReviews"
      )
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalWorkers = await Worker.countDocuments(filter);

    res.status(200).json({
      workers,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalWorkers / limitNumber),
        totalWorkers,
        limit: limitNumber
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workers",
      error: error.message
    });
  }
};
// Get worker by ID
const getWorkerById = async (req, res) => {
    try {

        // Get Worker ID from the URL
        const { id } = req.params;

        // Find the worker using Worker _id
        const worker = await Worker.findById(id);

        // Check if worker exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Find the User account connected to this worker
        const user = await User.findById(worker.userId);

        // Check if the user account exists
        if (!user) {
            return res.status(404).json({
                message: "User account not found"
            });
        }

        // Send worker details along with phone number
        res.status(200).json({
            message: "Worker fetched successfully",

            worker: {
                // Worker ID
                _id: worker._id,

                // User's name
                name: user.name,

                // User's phone number
                phone: user.phone,

                // Worker profile image
                profileImage: worker.profileImage,

                // Worker profession
                profession: worker.profession,

                // Worker skills
                skills: worker.skills,

                // Experience
                experience: worker.experience,

                // Description
                description: worker.description,

                // Daily wage
                dailyWage: worker.dailyWage,

                // Service charge
                serviceCharge: worker.serviceCharge,

                // Location details
                village: worker.village,
                district: worker.district,
                state: worker.state,
                location: worker.location,

                // Availability
                isAvailable: worker.isAvailable,

                // Verification status
                isVerified: worker.isVerified,

                // Rating information
                averageRating: worker.averageRating,
                totalReviews: worker.totalReviews
            }
        });

    } catch (error) {

        // Handle errors
        res.status(500).json({
            message: "Failed to fetch worker",
            error: error.message
        });
    }
};
const updateWorkerProfile = async (req, res) => {
    try {
        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        const {
            name,
            profession,
            skills,
            experience,
            description,
            dailyWage,
            serviceCharge,
            village,
            district,
            state,
            location,
            isAvailable
        } = req.body;

        if (name !== undefined) {

            const user = await User.findById(req.user.userId);

            if (!user) {

                return res.status(404).json({

                    message: "User not found"

                });

            }

            user.name = name;

            await user.save();

            // Keep Worker name synchronized

            worker.name = name;

        }

        // Update only fields that are provided
        if (profession !== undefined) worker.profession = profession;
        if (skills !== undefined) worker.skills = skills;
        if (experience !== undefined) worker.experience = experience;
        if (description !== undefined) worker.description = description;
        if (dailyWage !== undefined) worker.dailyWage = dailyWage;
        if (serviceCharge !== undefined) worker.serviceCharge = serviceCharge;
        if (village !== undefined) worker.village = village;
        if (district !== undefined) worker.district = district;
        if (state !== undefined) worker.state = state;
        if (location !== undefined) worker.location = location;
        if (isAvailable !== undefined) worker.isAvailable = isAvailable;

        await worker.save();

        res.status(200).json({
            message: "Worker profile updated successfully",
            worker
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update worker profile",
            error: error.message
        });
    }
};
const updateWorkerAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;

        // Check whether value is provided
        if (isAvailable === undefined) {
            return res.status(400).json({
                message: "isAvailable is required"
            });
        }

        // Check that the value is boolean
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "isAvailable must be true or false"
            });
        }

        // Find worker using logged-in user's ID
        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        // Update availability
        worker.isAvailable = isAvailable;

        await worker.save();

        res.status(200).json({
            message: "Worker availability updated successfully",
            isAvailable: worker.isAvailable
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update worker availability",
            error: error.message
        });
    }
};
// Upload worker profile image
const uploadWorkerImage = async (req, res) => {
    try {

        // Check whether an image was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a profile image"
            });
        }

        // Find the worker using the logged-in user's ID
        const worker = await Worker.findOne({
            userId: req.user.userId
        });

        // Check whether the worker profile exists
        if (!worker) {
            return res.status(404).json({
                message: "Worker profile not found"
            });
        }

        // Save the uploaded image path in the worker document
        worker.profileImage = `/uploads/${req.file.filename}`;

        // Save the updated worker profile
        await worker.save();

        // Send success response
        res.status(200).json({
            message: "Profile image uploaded successfully",

            // Return the image path
            profileImage: worker.profileImage,

            // Return the updated worker
            worker
        });

    } catch (error) {

        // Handle server errors
        res.status(500).json({
            message: "Failed to upload profile image",
            error: error.message
        });
    }
};


// Export the controller functions
module.exports = {
    createWorkerProfile,
    getworkersprofile,
    getWorkerById,
    updateWorkerProfile,
    updateWorkerAvailability,
    uploadWorkerImage 

    
};