2 APIs:

1. POST /api/reviews
2. GET /api/reviews/worker/:workerId

Grama Setu — Review API Documentation

Base URL

http://localhost:5400

⸻

1. Create Review

Endpoint

POST /api/reviews

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

{
  "serviceRequestId": "<SERVICE_REQUEST_ID>",
  "rating": 5,
  "comment": "Excellent service. The work was completed properly and on time."
}

Fields

Field	Required	Description
serviceRequestId	Yes	ID of the completed service request
rating	Yes	Rating from 1 to 5
comment	No	Review comment, maximum 1000 characters

Success Response

Status: 201 Created

Returns the newly created review.

Business Rules

1. serviceRequestId must be a valid MongoDB ObjectId.
2. The service request must exist.
3. The service request must belong to the authenticated user.
4. The service request must have status completed.
5. A service request can only be reviewed once.
6. rating must be an integer between 1 and 5.
7. comment is optional.
8. The worker’s rating statistics are recalculated after the review.
9. A notification is sent to the worker.

Possible Errors

* 400 — Invalid service request ID
* 400 — Invalid rating
* 400 — Review can only be submitted for a completed request
* 400 — Invalid review data
* 401 — Authentication required
* 403 — Service request does not belong to the authenticated user
* 404 — Service request not found
* 409 — Review already exists for this service request
* 500 — Server error

⸻

2. Get Worker Reviews

Endpoint

GET /api/reviews/worker/:workerId

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>

Path Parameter

Parameter	Description
workerId	ID of the worker whose reviews should be retrieved

Example

GET /api/reviews/worker/64f123456789abcdef123456

Purpose

Retrieves reviews submitted for a specific worker.

Success Response

Status: 200 OK

Returns:

* Reviews for the worker
* Reviewer/user information
* Rating
* Comment
* Review timestamps
* Calculated average rating

Reviews are returned with the newest reviews first.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 404 — Worker not found, if applicable
* 500 — Server error

⸻

Review Rating System

Workers have two rating-related fields:

Field	Description
averageRating	Current average rating of the worker
totalReviews	Total number of reviews received

When a new review is submitted, the backend recalculates these values using the worker’s reviews.

Example

If a worker receives:

5 ★
4 ★
5 ★

The average rating becomes:

4.67

⸻

Review Model

A review contains:

Field	Description
userId	User who submitted the review
workerId	Worker being reviewed
serviceRequestId	Completed service request associated with the review
rating	Rating from 1 to 5
comment	Optional review comment
createdAt	Review creation timestamp
updatedAt	Last update timestamp

⸻

Review Authorization

The authenticated user’s identity is obtained from:

req.user.userId

The API does not trust a user ID supplied by the client when determining who is allowed to submit the review.

⸻

Review Workflow

User requests service
        ↓
Service Request
        ↓
Worker accepts
        ↓
Service is performed
        ↓
Service Request → completed
        ↓
User submits review
        ↓
Review created
        ↓
Worker rating recalculated
        ↓
Worker receives notification

⸻

Review API Summary

Method	Endpoint	Authentication
POST	/api/reviews	Required
GET	/api/reviews/worker/:workerId	Required

⸻

Validation Rules

Field	Validation
serviceRequestId	Required and valid ObjectId
rating	Required, integer, 1–5
comment	Optional, maximum 1000 characters

⸻

Duplicate Review Protection

Each service request can have only one review.

The backend checks whether a review already exists for the specified serviceRequestId before creating a new review.

This prevents users from submitting multiple reviews for the same completed service.