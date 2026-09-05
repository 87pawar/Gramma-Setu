const Notification = require("../Models/Notification");

// Get logged-in user's notifications
const getMyNotifications = async (req, res) => {
  try {
    const { isRead, page = 1, limit = 10 } = req.query;

    // Filter notifications for the logged-in user
    const filter = {
      userId: req.user.userId
    };

    // Optional read/unread filter
    if (isRead !== undefined) {
      if (isRead !== "true" && isRead !== "false") {
        return res.status(400).json({
          message: "isRead must be true or false"
        });
      }

      filter.isRead = isRead === "true";
    }

    // Validate pagination
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      50
    );

    const skip = (pageNumber - 1) * limitNumber;

    // Fetch only the notification fields needed by the frontend
    const notifications = await Notification.find(filter)
      .select(
        "message type serviceRequestId isRead createdAt"
      )
      .populate(
        "serviceRequestId",
        "service description date location status"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Count matching notifications
    const totalNotifications =
      await Notification.countDocuments(filter);

    res.status(200).json({
      notifications,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(
          totalNotifications / limitNumber
        ),
        totalNotifications,
        limit: limitNumber
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
};
const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false
    });

    res.status(200).json({
      unreadCount
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get unread notification count",
      error: error.message
    });
  }
};


// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // Find notification belonging to logged-in user
        const notification = await Notification.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        // Mark as read
        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                userId: req.user.userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark notifications as read",
            error: error.message
        });
    }
};


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
};