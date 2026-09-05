APIs
1. POST /api/workers/profile
2. GET /api/workers
3. GET /api/workers/:id
4. PATCH /api/workers/profile
5. PATCH /api/workers/availability
6. PATCH /api/workers/profile/image

Grama Setu — Worker API Documentation

Base URL

http://localhost:5400

⸻

1. Create Worker Profile

Endpoint

POST /api/workers/profile

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

{
  "name": "Ramesh Patil",
  "profession": "Electrician",
  "skills": [
    "House Wiring",
    "Electrical Repair"
  ],
  "experience": 5,
  "description": "Experienced electrician providing electrical repair and installation services.",
  "dailyWage": 700,
  "serviceCharge": 100,
  "village": "Khed",
  "district": "Pune",
  "state": "Maharashtra",
  "location": "Khed, Pune, Maharashtra",
  "isAvailable": true
}

Important

The userId is obtained from the authenticated JWT. It should not be supplied by the client.

Main Fields

Field	Required	Description
name	No	Worker’s name
profession	Yes	Type of work
skills	No	Array of worker skills
experience	No	Years of experience
description	No	Worker description
dailyWage	No	Daily wage
serviceCharge	No	Additional service charge
village	No	Village
district	No	District
state	No	State
location	No	General location
isAvailable	No	Worker availability

Success Response

Status: 201 Created

Returns the created worker profile.

Possible Errors

* 400 — Invalid worker profile data
* 401 — Authentication required
* 500 — Server error

⸻

2. Get All Workers

Endpoint

GET /api/workers

Authentication

Not required.

Query Parameters

Parameter	Description
profession	Filter by profession
village	Filter by village
district	Filter by district
state	Filter by state
location	Filter by location
isAvailable	Filter available/unavailable workers
minWage	Minimum wage, if supported by current controller
maxWage	Maximum wage, if supported by current controller
sortBy	Worker sorting field
sortOrder	Ascending/descending order
page	Page number
limit	Number of workers per page

Example

GET /api/workers?profession=Electrician&district=Pune&isAvailable=true

Sorting

The worker API supports sorting based on:

* Daily wage
* Rating

Pagination

Pagination can be used with:

?page=1&limit=10

Success Response

Status: 200 OK

Returns a list of workers along with pagination information when provided by the controller.

Possible Errors

* 400 — Invalid query parameters
* 500 — Server error

⸻

3. Get Worker by ID

Endpoint

GET /api/workers/:id

Authentication

Not required.

Example

GET /api/workers/64f123456789abcdef123456

Path Parameter

Parameter	Description
id	Worker document ID

Success Response

Status: 200 OK

Returns the requested worker’s profile information.

The response also provides the worker’s user information such as:

* Name
* Phone

along with worker profile details.

Possible Errors

* 400 — Invalid worker ID
* 404 — Worker not found
* 500 — Server error

⸻

4. Update Worker Profile

Endpoint

PATCH /api/workers/profile

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

Example:

{
  "name": "Ramesh Patil",
  "profession": "Electrician",
  "skills": [
    "House Wiring",
    "Electrical Repair",
    "Motor Repair"
  ],
  "experience": 6,
  "description": "Experienced electrician providing electrical services.",
  "dailyWage": 800,
  "serviceCharge": 100,
  "village": "Khed",
  "district": "Pune",
  "state": "Maharashtra",
  "location": "Khed, Pune, Maharashtra"
}

Important

The worker is identified using:

req.user.userId

from the authenticated JWT.

Success Response

Status: 200 OK

Returns the updated worker profile.

Possible Errors

* 400 — Invalid profile data
* 401 — Authentication required
* 404 — Worker profile not found
* 500 — Server error

⸻

5. Update Worker Availability

Endpoint

PATCH /api/workers/availability

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

To make the worker available:

{
  "isAvailable": true
}

To make the worker unavailable:

{
  "isAvailable": false
}

Success Response

Status: 200 OK

Returns the updated availability information.

Possible Errors

* 400 — Invalid availability value
* 401 — Authentication required
* 404 — Worker profile not found
* 500 — Server error

Purpose

Allows a worker to control whether they can currently receive new service requests.

⸻

6. Upload Worker Profile Image

Endpoint

PATCH /api/workers/profile/image

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Request Type

multipart/form-data

Form Field

Use the image field configured in the Multer upload middleware.

The request should contain the worker’s profile image as a file.

Example

Authorization: Bearer <JWT_TOKEN>
Form-data:
image = <profile-image-file>

Success Response

Status: 200 OK

Returns the updated profile image information/path.

The uploaded image is served through the backend’s /uploads static route.

Possible Errors

* 400 — Invalid/missing image
* 401 — Authentication required
* 404 — Worker profile not found
* 500 — Server error

⸻

Worker API Summary

Method	Endpoint	Authentication
POST	/api/workers/profile	Required
GET	/api/workers	Not required
GET	/api/workers/:id	Not required
PATCH	/api/workers/profile	Required
PATCH	/api/workers/availability	Required
PATCH	/api/workers/profile/image	Required

⸻

Worker Rating Information

Worker profiles contain rating-related information:

Field	Description
averageRating	Average worker rating
totalReviews	Total number of reviews

These values are updated when users submit reviews through the Review API.

⸻

Worker Image Access

Uploaded profile images are exposed through the backend’s static uploads route:

/uploads/<filename>

The exact filename is generated by the upload middleware.

⸻

Authentication Header for Protected Worker APIs

Authorization: Bearer <JWT_TOKEN>

The authenticated user’s identity is obtained from the JWT rather than accepting a user ID from the request body.