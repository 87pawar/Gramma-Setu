3 APIs:

1. GET /api/notifications
2. PATCH /api/notifications/:id/read
3. PATCH /api/notifications/read-all

Grama Setu — Notification API Documentation

Base URL

http://localhost:5400

⸻

1. Get My Notifications

Endpoint

GET /api/notifications

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Request Body

No request body is required.

Purpose

Retrieves all notifications belonging to the currently authenticated user.

The user is identified using:

req.user.userId

Success Response

Status: 200 OK

Returns the user’s notifications.

Each notification can contain:

{
  "userId": "<USER_ID>",
  "message": "A worker has accepted your service request.",
  "type": "request_accepted",
  "serviceRequestId": "<SERVICE_REQUEST_ID>",
  "isRead": false
}

Notifications are returned with the newest notifications first.

Possible Errors

* 401 — Authentication required
* 500 — Server error

⸻

2. Mark Notification as Read

Endpoint

PATCH /api/notifications/:id/read

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
id	Notification ID

Example

PATCH /api/notifications/64f123456789abcdef123456/read

Request Body

No request body is required.

Purpose

Marks one notification as read.

The backend verifies that the notification belongs to the authenticated user before updating it.

Success Response

Status: 200 OK

Returns the updated notification or success message according to the current controller response.

Possible Errors

* 400 — Invalid notification ID
* 401 — Authentication required
* 404 — Notification not found
* 500 — Server error

⸻

3. Mark All Notifications as Read

Endpoint

PATCH /api/notifications/read-all

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Request Body

No request body is required.

Purpose

Marks all unread notifications belonging to the authenticated user as read.

Success Response

Status: 200 OK

Returns a success response after updating the user’s unread notifications.

Possible Errors

* 401 — Authentication required
* 500 — Server error

⸻

Notification Types

The Grama Setu notification system currently supports the following notification types:

Type	Meaning
service_request	A user has sent a service request to a worker
request_accepted	Worker accepted the service request
request_rejected	Worker rejected the service request
request_cancelled	User cancelled the service request
service_completed	Service request was completed
review	User submitted a review for the worker

⸻

Notification Model

Each notification contains the following information:

Field	Description
userId	User who receives the notification
message	Notification message
type	Notification event type
serviceRequestId	Related service request, when applicable
isRead	Whether the notification has been read
createdAt	Notification creation time
updatedAt	Last update time

⸻

Notification Flow

User creates service request
          ↓
Worker receives notification
          ↓
Worker accepts/rejects
          ↓
User receives notification
          ↓
User/worker performs next action
          ↓
Related notification is generated
          ↓
User reads notification
          ↓
Notification marked as read

⸻

Notification Events

Event	Recipient
New service request	Worker
Request accepted	User
Request rejected	User
Request cancelled	Worker
Service completed	User
Review submitted	Worker

⸻

Read Status

The isRead field indicates the current read status.

Unread

{
  "isRead": false
}

Read

{
  "isRead": true
}

A notification can be marked individually using:

PATCH /api/notifications/:id/read

All unread notifications can be marked as read using:

PATCH /api/notifications/read-all

⸻

Notification API Summary

Method	Endpoint	Authentication
GET	/api/notifications	Required
PATCH	/api/notifications/:id/read	Required
PATCH	/api/notifications/read-all	Required

⸻

Security

All notification APIs require JWT authentication.

The backend uses:

req.user.userId

to determine the current user.

A user cannot access or modify another user’s notifications.

⸻

Related Service Request

When a notification is related to a service request, the notification can contain:

serviceRequestId

This allows the frontend to identify and display the related service request when required.