const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
} = require("../Controller/notificationController");

const {
    authmiddleware
} = require("../Middleware/authMiddleware.js");


// Get logged-in user's notifications
router.get(
    "/",
    authmiddleware,
    getMyNotifications
);


// Mark one notification as read
router.patch(
    "/:id/read",
    authmiddleware,
    markNotificationAsRead
);
router.get("/unread-count", authmiddleware, getUnreadNotificationCount);

// Mark all notifications as read
router.patch(
    "/read-all",
    authmiddleware,
    markAllNotificationsAsRead
);



module.exports = router;