1. POST /api/auth/register
2. POST /api/auth/login
3. PATCH /api/auth/change-password
4. POST /api/auth/forgot-password
5. POST /api/auth/reset-password

Grama Setu — Authentication API Documentation

Base URL

http://localhost:5400

⸻

1. Register User

Endpoint

POST /api/auth/register

Authentication

Not required.

Request Body

{
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "user"
}

Fields

Field	Required	Description
name	Yes	User’s name
email	Yes	Valid email address
phone	Yes	10-digit phone number
password	Yes	Minimum 6 characters
role	No	user, farmer, or worker

Success Response

Status: 201 Created

Returns the newly registered user’s information.

Possible Errors

* 400 — Missing or invalid registration data
* 400 — Invalid email/phone/password
* 400 — Invalid role
* 409 — Email already registered
* 500 — Server error

⸻

2. Login

Endpoint

POST /api/auth/login

Authentication

Not required.

Request Body

{
  "email": "rahul@example.com",
  "password": "password123"
}

Success Response

Status: 200 OK

{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "name": "Rahul Patil",
    "userId": "<USER_ID>",
    "email": "rahul@example.com",
    "role": "user"
  }
}

Possible Errors

* 400 — Missing email or password
* 401 — Invalid email or password
* 403 — Account has been blocked
* 429 — Too many authentication attempts
* 500 — Server error

Important

The returned JWT token must be sent with protected API requests.

Authorization: Bearer <JWT_TOKEN>

⸻

3. Change Password

Endpoint

PATCH /api/auth/change-password

Authentication

Required.

Request Headers

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}

Success Response

Status: 200 OK

Returns a success message after the password is changed.

Possible Errors

* 400 — Missing password fields
* 400 — New password does not meet validation requirements
* 401 — Invalid or incorrect current password
* 401 — Authentication failure
* 404 — User not found
* 500 — Server error

⸻

4. Forgot Password

Endpoint

POST /api/auth/forgot-password

Authentication

Not required.

Request Body

{
  "email": "rahul@example.com"
}

Success Response

Status: 200 OK

Returns a message indicating that the password-reset process has been initiated.

Possible Errors

* 400 — Email is missing or invalid
* 404 — User not found
* 429 — Too many authentication attempts
* 500 — Server error

Purpose

This API starts the password-reset process for a registered account.

⸻

5. Reset Password

Endpoint

POST /api/auth/reset-password

Authentication

Not required.

Request Body

{
  "token": "<RESET_TOKEN>",
  "password": "newpassword123"
}

Success Response

Status: 200 OK

Returns a success message after the password has been reset.

Possible Errors

* 400 — Invalid or missing reset token
* 400 — Password validation failed
* 400 — Reset token has expired
* 404 — User not found
* 429 — Too many authentication attempts
* 500 — Server error

Purpose

This API allows a user to set a new password using a valid password-reset token.

⸻

Authentication Summary

Method	Endpoint	Auth Required
POST	/api/auth/register	No
POST	/api/auth/login	No
PATCH	/api/auth/change-password	Yes
POST	/api/auth/forgot-password	No
POST	/api/auth/reset-password	No

Authentication Header

Protected APIs use JWT authentication:

Authorization: Bearer <JWT_TOKEN>

The JWT contains the authenticated user’s:

* name
* userId
* role

The backend uses userId from the verified JWT rather than accepting the authenticated user’s ID from the request body.