const multer = require("multer");

// Configure where the uploaded files should be stored
const storage = multer.diskStorage({

    // Destination folder for uploaded images
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    // Generate a unique filename for each image
    filename: (req, file, cb) => {

        // Get the original file extension
        const extension = file.originalname.split(".").pop();

        // Create a unique filename using current time
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;

        cb(null, filename);
    }
});


// Allow only image files
const fileFilter = (req, file, cb) => {

    // Check the MIME type of the uploaded file
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(new Error("Only image files are allowed"), false);
    }
};


// Create the multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,

    // Maximum file size = 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// Export the upload middleware
module.exports = upload;