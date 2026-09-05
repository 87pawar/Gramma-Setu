User Management APIs

1. GET /api/admin/users
2. PATCH /api/admin/users/:id/block
3. PATCH /api/admin/users/:id/unblock
4. DELETE /api/admin/users/:id

Worker Management APIs

5. GET /api/admin/workers
6. PATCH /api/admin/workers/:id/verify
7. PATCH /api/admin/workers/:id/unverify
8. PATCH /api/admin/workers/:id/block
9. PATCH /api/admin/workers/:id/unblock
10. DELETE /api/admin/workers/:id

Service Request Management APIs

11. GET /api/admin/service-requests
12. DELETE /api/admin/service-requests/:id

Dashboard API

13. GET /api/admin/dashboard


Grama Setu — Admin API Documentation

Base URL

http://localhost:5400

⸻

Admin Authentication

All Admin APIs require:

1. A valid JWT token.
2. The authenticated user’s role must be admin.

Request Header

Authorization: Bearer <ADMIN_JWT_TOKEN>

Middleware Order

authMiddleware
      ↓
adminMiddleware
      ↓
validation
      ↓
controller

Non-admin users receive:

Status: 403 Forbidden

⸻

User Management

1. Get All Users

Endpoint

GET /api/admin/users

Authentication

Admin only.

Purpose

Retrieves all registered users.

Success Response

Status: 200 OK

Returns users without exposing their passwords.

Possible Errors

* 401 — Authentication required
* 403 — Admin access required
* 500 — Server error

⸻

2. Block User

Endpoint

PATCH /api/admin/users/:id/block

Authentication

Admin only.

Path Parameter

Parameter	Description
id	User ID

Example

PATCH /api/admin/users/64f123456789abcdef123456/block

Purpose

Blocks a user account.

A blocked user cannot successfully log in.

Success Response

Status: 200 OK

Returns the updated user information without exposing the password.

Possible Errors

* 400 — Invalid user ID
* 401 — Authentication required
* 403 — Admin access required / admin cannot block itself
* 404 — User not found
* 500 — Server error

⸻

3. Unblock User

Endpoint

PATCH /api/admin/users/:id/unblock

Authentication

Admin only.

Path Parameter

id — User ID.

Purpose

Removes the block from a user account and allows the user to log in again.

Success Response

Status: 200 OK

Returns the updated user information without the password.

Possible Errors

* 400 — Invalid user ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — User not found
* 500 — Server error

⸻

4. Delete User

Endpoint

DELETE /api/admin/users/:id

Authentication

Admin only.

Path Parameter

id — User ID.

Purpose

Permanently deletes a user account.

Success Response

Status: 200 OK

Returns a successful deletion response.

Possible Errors

* 400 — Invalid user ID
* 401 — Authentication required
* 403 — Admin access required / admin cannot delete itself
* 404 — User not found
* 500 — Server error

⸻

Worker Management

5. Get All Workers

Endpoint

GET /api/admin/workers

Authentication

Admin only.

Purpose

Retrieves all worker profiles for administration.

Success Response

Status: 200 OK

Returns the worker records.

Possible Errors

* 401 — Authentication required
* 403 — Admin access required
* 500 — Server error

⸻

6. Verify Worker

Endpoint

PATCH /api/admin/workers/:id/verify

Authentication

Admin only.

Path Parameter

id — Worker ID.

Example

PATCH /api/admin/workers/64f123456789abcdef123456/verify

Purpose

Marks a worker as verified.

isVerified = true

Success Response

Status: 200 OK

Returns the updated worker.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — Worker not found
* 500 — Server error

⸻

7. Unverify Worker

Endpoint

PATCH /api/admin/workers/:id/unverify

Authentication

Admin only.

Path Parameter

id — Worker ID.

Purpose

Removes the worker’s verified status.

isVerified = false

Success Response

Status: 200 OK

Returns the updated worker.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — Worker not found
* 500 — Server error

⸻

8. Block Worker

Endpoint

PATCH /api/admin/workers/:id/block

Authentication

Admin only.

Path Parameter

id — Worker ID.

Purpose

Blocks the User account associated with the worker.

The worker’s profile itself remains associated with its User account, while the User’s:

isBlocked = true

prevents the account from logging in.

Success Response

Status: 200 OK

Returns a successful block response.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 403 — Admin access required / admin cannot block itself
* 404 — Worker or associated user not found
* 500 — Server error

⸻

9. Unblock Worker

Endpoint

PATCH /api/admin/workers/:id/unblock

Authentication

Admin only.

Path Parameter

id — Worker ID.

Purpose

Unblocks the User account associated with the worker.

isBlocked = false

Success Response

Status: 200 OK

Returns a successful unblock response.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — Worker or associated user not found
* 500 — Server error

⸻

10. Delete Worker

Endpoint

DELETE /api/admin/workers/:id

Authentication

Admin only.

Path Parameter

id — Worker ID.

Purpose

Deletes the worker profile and its associated User account.

Success Response

Status: 200 OK

Returns a successful deletion response.

Possible Errors

* 400 — Invalid worker ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — Worker not found
* 500 — Server error

⸻

Service Request Management

11. Get All Service Requests

Endpoint

GET /api/admin/service-requests

Authentication

Admin only.

Purpose

Retrieves all service requests for administrative monitoring.

The response includes populated information about:

User

* name
* email
* phone
* role

Worker

* name
* phone
* profession
* village
* district
* state
* dailyWage
* isAvailable
* isVerified

Success Response

Status: 200 OK

Service requests are returned with the newest requests first.

Possible Errors

* 401 — Authentication required
* 403 — Admin access required
* 500 — Server error

⸻

12. Delete Service Request

Endpoint

DELETE /api/admin/service-requests/:id

Authentication

Admin only.

Path Parameter

id — Service request ID.

Example

DELETE /api/admin/service-requests/64f123456789abcdef123456

Purpose

Allows an administrator to remove a service request.

Success Response

Status: 200 OK

Returns a successful deletion response.

Possible Errors

* 400 — Invalid service request ID
* 401 — Authentication required
* 403 — Admin access required
* 404 — Service request not found
* 500 — Server error

⸻

Dashboard

13. Get Dashboard Statistics

Endpoint

GET /api/admin/dashboard

Authentication

Admin only.

Purpose

Provides summary statistics for the Grama Setu administration dashboard.

Statistics

The dashboard provides counts for:

Statistic	Description
Total Users	Number of registered users
Total Workers	Number of worker profiles
Verified Workers	Workers whose profiles are verified
Unverified Workers	Workers whose profiles are not verified
Pending Requests	Service requests awaiting action
Accepted Requests	Accepted service requests
Rejected Requests	Rejected service requests
Completed Requests	Completed service requests
Cancelled Requests	Cancelled service requests

Success Response

Status: 200 OK

Returns the calculated dashboard statistics.

Possible Errors

* 401 — Authentication required
* 403 — Admin access required
* 500 — Server error

⸻

Admin API Summary

#	Method	Endpoint	Authentication
1	GET	/api/admin/users	Admin
2	PATCH	/api/admin/users/:id/block	Admin
3	PATCH	/api/admin/users/:id/unblock	Admin
4	DELETE	/api/admin/users/:id	Admin
5	GET	/api/admin/workers	Admin
6	PATCH	/api/admin/workers/:id/verify	Admin
7	PATCH	/api/admin/workers/:id/unverify	Admin
8	PATCH	/api/admin/workers/:id/block	Admin
9	PATCH	/api/admin/workers/:id/unblock	Admin
10	DELETE	/api/admin/workers/:id	Admin
11	GET	/api/admin/service-requests	Admin
12	DELETE	/api/admin/service-requests/:id	Admin
13	GET	/api/admin/dashboard	Admin

⸻

Admin Security Rules

All admin endpoints are protected by both authentication and authorization.

JWT Authentication
       ↓
Check role
       ↓
role === "admin"
       ↓
Allow Admin Operation

A normal user, farmer, or worker cannot access Admin APIs.

Invalid JWT

Status: 401 Unauthorized

Valid JWT but non-admin role

Status: 403 Forbidden

Invalid MongoDB ObjectId

Status: 400 Bad Request

⸻

Account Blocking

When an account is blocked:

isBlocked = true

The login process checks this value and prevents the blocked account from obtaining a new JWT.

When unblocked:

isBlocked = false

the account can log in normally again.

⸻

Admin Self-Protection

The system prevents an administrator from:

* Blocking their own admin account.
* Deleting their own admin account.

This prevents accidental loss of the administrative account currently being used.