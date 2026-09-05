6 APIs

1. POST /api/service-requests
2. GET /api/service-requests/my
3. GET /api/service-requests/worker
4. PATCH /api/service-requests/:id/accept
5. PATCH /api/service-requests/:id/reject
6. PATCH /api/service-requests/:id/cancel
7. PATCH /api/service-requests/:id/complete

Grama Setu — Service Request API Documentation

Base URL

http://localhost:5400

⸻

1. Create Service Request

Endpoint

POST /api/service-requests

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

{
  "workerId": "<WORKER_ID>",
  "service": "Electrical Repair",
  "description": "Need electrical repair work at my house.",
  "date": "2026-09-10",
  "location": "Khed, Pune, Maharashtra"
}

Fields

Field	Required	Description
workerId	Yes	ID of the worker being requested
service	Yes	Required service
description	Yes	Description of the work
date	Yes	Requested service date
location	Yes	Location where service is required

Important Business Rules

* The authenticated user’s ID is obtained from the JWT.
* The supplied worker must exist.
* The worker must currently be available.
* A duplicate active request for the same user and worker is not allowed.
* New requests are created with status pending.
* A notification is sent to the worker.

Success Response

Status: 201 Created

Returns the newly created service request.

Possible Errors

* 400 — Invalid request data
* 400 — Invalid worker ID
* 400 — Worker is not available
* 401 — Authentication required
* 404 — Worker not found
* 409 — Duplicate active service request
* 500 — Server error

⸻

2. Get My Service Requests

Endpoint

GET /api/service-requests/my

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Purpose

Returns service requests created by the currently authenticated user.

The user ID is obtained from:

req.user.userId

Success Response

Status: 200 OK

Returns the user’s service requests.

Possible Errors

* 401 — Authentication required
* 500 — Server error

⸻

3. Get Worker Service Requests

Endpoint

GET /api/service-requests/worker

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Purpose

Returns service requests received by the currently authenticated worker.

The worker is identified using the authenticated user’s ID.

Success Response

Status: 200 OK

Returns service requests assigned to the worker.

Possible Errors

* 401 — Authentication required
* 404 — Worker profile not found
* 500 — Server error

⸻

4. Accept Service Request

Endpoint

PATCH /api/service-requests/:id/accept

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
id	Service request ID

Example

PATCH /api/service-requests/64f123456789abcdef123456/accept

Purpose

Allows the requested worker to accept a pending service request.

Status Change

pending → accepted

Success Response

Status: 200 OK

Returns the updated service request.

Notification

After acceptance, a notification is sent to the user who created the request.

Possible Errors

* 400 — Invalid request ID or invalid request state
* 401 — Authentication required
* 403 — Request does not belong to the authenticated worker
* 404 — Service request or worker not found
* 500 — Server error

⸻

5. Reject Service Request

Endpoint

PATCH /api/service-requests/:id/reject

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
id	Service request ID

Example

PATCH /api/service-requests/64f123456789abcdef123456/reject

Purpose

Allows the requested worker to reject a pending service request.

Status Change

pending → rejected

Success Response

Status: 200 OK

Returns the updated service request.

Notification

A rejection notification is sent to the user.

Possible Errors

* 400 — Invalid request ID or request state
* 401 — Authentication required
* 403 — Request does not belong to the authenticated worker
* 404 — Service request or worker not found
* 500 — Server error

⸻

6. Cancel Service Request

Endpoint

PATCH /api/service-requests/:id/cancel

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
id	Service request ID

Example

PATCH /api/service-requests/64f123456789abcdef123456/cancel

Purpose

Allows the user who created the request to cancel it.

Status Change

A request can be cancelled from an applicable active state according to the controller’s business rules.

pending/accepted → cancelled

Success Response

Status: 200 OK

Returns the updated service request.

Notification

A cancellation notification is sent to the worker.

Possible Errors

* 400 — Invalid request ID or request state
* 401 — Authentication required
* 403 — Request does not belong to the authenticated user
* 404 — Service request not found
* 500 — Server error

⸻

7. Complete Service Request

Endpoint

PATCH /api/service-requests/:id/complete

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
id	Service request ID

Example

PATCH /api/service-requests/64f123456789abcdef123456/complete

Purpose

Marks an accepted service request as completed after the service has been performed.

Status Change

accepted → completed

Success Response

Status: 200 OK

Returns the updated service request.

Notification

A completion notification is sent to the user.

Review

Once the request is completed, the user can submit a review for the completed service request through the Review API.

Possible Errors

* 400 — Invalid request ID or request state
* 401 — Authentication required
* 403 — User/worker is not authorized for the request
* 404 — Service request not found
* 500 — Server error

⸻

Service Request Status Flow

                    ┌───────────┐
                    │  pending  │
                    └─────┬─────┘
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐
          │  accepted   │   │  rejected   │
          └──────┬──────┘   └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │  completed  │
          └─────────────┘
pending/accepted
       │
       ▼
┌─────────────┐
│  cancelled  │
└─────────────┘

⸻

Service Request API Summary

Method	Endpoint	Authentication
POST	/api/service-requests	Required
GET	/api/service-requests/my	Required
GET	/api/service-requests/worker	Required
PATCH	/api/service-requests/:id/accept	Required
PATCH	/api/service-requests/:id/reject	Required
PATCH	/api/service-requests/:id/cancel	Required
PATCH	/api/service-requests/:id/complete	Required

⸻

Service Request Model

A service request contains:

Field	Description
userId	User who requested the service
workerId	Worker requested for the service
service	Type of service
description	Description of required work
date	Requested service date
location	Service location
status	Current request status
createdAt	Request creation timestamp
updatedAt	Last update timestamp

⸻

Authorization

The API uses JWT authentication.

Authorization: Bearer <JWT_TOKEN>

The backend determines the authenticated user from the JWT instead of trusting a user ID supplied by the client.

⸻

Notifications

The service request system automatically generates notifications for important events:

Event	Notification Recipient
New request	Worker
Request accepted	User
Request rejected	User
Request cancelled	Worker
Service completed	User