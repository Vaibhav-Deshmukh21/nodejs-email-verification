# Node.js Email Verification API

A simple REST API built with **Node.js, Express, MongoDB, and Nodemailer** for user registration and email verification using OTP.

## Features

* User Registration
* User Login
* Email OTP Verification
* Resend OTP
* OTP Expiration
* Password Hashing with bcrypt
* MongoDB Database
* RESTful APIs

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Nodemailer
* bcrypt
* JWT

## API Endpoints

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/register`  | Register a new user     |
| POST   | `/api/login`     | Login user              |
| POST   | `/api/verifyOtp` | Verify email using OTP  |
| POST   | `/api/ResendOtp` | Resend verification OTP |

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Go to the project folder:

```bash
cd nodejs-email-verification-api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password
```

Start the server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

## Email Verification Flow

```text
Register
   ↓
OTP Generated
   ↓
OTP Sent to Email
   ↓
Verify OTP
   ↓
Email Verified
   ↓
Login
```

## Security

Sensitive environment variables are stored in `.env` and should **not** be committed to GitHub.

Make sure `.gitignore` contains:

```text
.env
node_modules/
```

## Author

**Vaibhav Deshmukh**

Backend Developer | Node.js | Express.js | MongoDB
