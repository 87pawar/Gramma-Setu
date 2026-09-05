Grama Setu — API Documentation

1. Project Overview

Grama Setu provides REST APIs for connecting users with local workers and managing service requests, reviews, notifications, and administrative operations.

The backend is built using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* bcrypt password hashing
* Multer for image uploads

⸻

2. Base URL

For local development:

http://localhost:5400

All API endpoints are relative to this base URL.

⸻

3. API Documentation

Detailed documentation is available in the following files:

Module	Documentation
Authentication	auth-api.md
Workers	worker-api.md
Service Requests	service-request-api.md
Reviews	review-api.md
Notifications	notification-api.md
Administration	admin-api.md

⸻

4. Authentication

Grama Setu uses JWT (JSON Web Token) authentication for protected APIs.

After successful login, the API returns a JWT token.

Protected requests must include:

Authorization: Bearer <JWT_TOKEN>

The JWT contains:

* name
* userId
* role

The backend obtains the authenticated user’s identity from the verified JWT.

⸻

5. Complete API Summary

Authentication APIs

Method	Endpoint	Auth
POST	/api/auth/register	No
POST	/api/auth/login	No
PATCH	/api/auth/change-password	Yes
POST	/api/auth/forgot-password	No
POST	/api/auth/reset-password	No

⸻

Worker APIs

Method	Endpoint	Auth
POST	/api/workers/profile	Yes
GET	/api/workers	No
GET	/api/workers/:id	No
PATCH	/api/workers/profile	Yes
PATCH	/api/workers/availability	Yes
PATCH	/api/workers/profile/image	Yes

⸻

Service Request APIs

Method	Endpoint	Auth
POST	/api/service-requests	Yes
GET	/api/service-requests/my	Yes
GET	/api/service-requests/worker	Yes
PATCH	/api/service-requests/:id/accept	Yes
PATCH	/api/service-requests/:id/reject	Yes
PATCH	/api/service-requests/:id/cancel	Yes
PATCH	/api/service-requests/:id/complete	Yes

⸻

Review APIs

Method	Endpoint	Auth
POST	/api/reviews	Yes
GET	/api/reviews/worker/:workerId	Yes

⸻

Notification APIs

Method	Endpoint	Auth
GET	/api/notifications	Yes
PATCH	/api/notifications/:id/read	Yes
PATCH	/api/notifications/read-all	Yes

⸻

Admin APIs

Method	Endpoint	Auth
GET	/api/admin/users	Admin
PATCH	/api/admin/users/:id/block	Admin
PATCH	/api/admin/users/:id/unblock	Admin
DELETE	/api/admin/users/:id	Admin
GET	/api/admin/workers	Admin
PATCH	/api/admin/workers/:id/verify	Admin
PATCH	/api/admin/workers/:id/unverify	Admin
PATCH	/api/admin/workers/:id/block	Admin
PATCH	/api/admin/workers/:id/unblock	Admin
DELETE	/api/admin/workers/:id	Admin
GET	/api/admin/service-requests	Admin
DELETE	/api/admin/service-requests/:id	Admin
GET	/api/admin/dashboard	Admin

⸻

6. Service Request Status

Service requests use the following statuses:

pending
accepted
rejected
completed
cancelled

Main Flow

pending
   ↓
accepted
   ↓
completed

Alternative outcomes include:

pending → rejected
pending → cancelled
accepted → cancelled

⸻

7. Review System

Reviews are associated with completed service requests.

Basic rules:

* Rating must be between 1 and 5.
* Rating must be an integer.
* Comment is optional.
* Comment can contain a maximum of 1000 characters.
* A service request can only be reviewed once.
* The service request must belong to the authenticated user.
* The service request must be completed.

Worker rating information includes:

averageRating
totalReviews

⸻

8. Notification System

The system generates notifications for important service events.

Supported notification types:

service_request
request_accepted
request_rejected
request_cancelled
service_completed
review

Notifications contain:

* Recipient user ID
* Message
* Notification type
* Related service request ID when applicable
* Read status
* Timestamps

⸻

9. Worker System

Worker profiles contain information such as:

* Name
* Profession
* Skills
* Experience
* Description
* Daily wage
* Service charge
* Village
* District
* State
* Location
* Availability
* Verification status
* Average rating
* Total reviews
* Profile image

Workers can:

* Create their profile
* Update their profile
* Change availability
* Receive service requests
* Accept or reject requests
* Complete services
* Receive reviews and notifications

⸻

10. Admin System

Administrators can manage:

Users

* View users
* Block users
* Unblock users
* Delete users

Workers

* View workers
* Verify workers
* Unverify workers
* Block workers
* Unblock workers
* Delete workers

Service Requests

* View all service requests
* Delete service requests

Dashboard

The dashboard provides:

* Total users
* Total workers
* Verified workers
* Unverified workers
* Pending requests
* Accepted requests
* Rejected requests
* Completed requests
* Cancelled requests

⸻

11. Security

The Grama Setu backend includes several security measures:

* JWT authentication
* Role-based admin authorization
* Password hashing with bcrypt
* Password fields excluded from normal queries
* Password validation
* MongoDB sanitization
* CORS configuration
* Helmet security headers
* Authentication rate limiting
* General API rate limiting
* MongoDB ObjectId validation
* Request validation
* Ownership checks for protected resources
* Account blocking

Passwords and other sensitive authentication information should never be exposed in API responses.

⸻

12. Common HTTP Status Codes

Status	Meaning
200	Request successful
201	Resource successfully created
400	Invalid request or validation error
401	Authentication required or invalid
403	Access denied
404	Resource not found
409	Conflict, such as duplicate resource
429	Too many requests
500	Internal server error

⸻

13. Common Authorization Pattern

Protected APIs follow:

Client Request
      ↓
JWT Authentication
      ↓
User Identity
      ↓
Authorization / Validation
      ↓
Controller
      ↓
Database
      ↓
Response

Admin APIs additionally verify the user’s role:

Client Request
      ↓
authMiddleware
      ↓
adminMiddleware
      ↓
Validation
      ↓
Admin Controller
      ↓
Database
      ↓
Response

⸻

14. API Testing

The APIs can be tested using tools such as Postman.

For protected APIs:

1. Login.
2. Copy the returned JWT token.
3. Add the token to the Authorization header.
4. Use the required endpoint.
5. Verify the response status and body.

Example:

Authorization: Bearer <JWT_TOKEN>

⸻

15. Backend API Modules

The Grama Setu backend is organized into the following major API modules:

Authentication
      ↓
Workers
      ↓
Service Requests
      ↓
Reviews
      ↓
Notifications
      ↓
Administration

These modules together provide the core backend functionality required by the Grama Setu application.