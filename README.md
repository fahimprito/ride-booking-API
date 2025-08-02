# 🚗 Ride Booking API

A secure, scalable RESTful API for a ride booking platform built with **Node.js**, **Express**, and **MongoDB** using **TypeScript**. It supports role-based access control for Riders, Drivers, and Admins.

---

## 🛠️ Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Zod for input validation
- Modular folder structure (Domain-driven)

---

## 📦 Features

### 🧑‍💼 Riders
- Register/Login
- Request a ride (pickup & destination)
- Cancel a ride (only if status is `REQUESTED`)
- View ride history

### 🚘 Drivers
- Register/Login
- Accept ride requests
- Update ride status:
  - `PICKED_UP` → `IN_TRANSIT` → `COMPLETED`
- View earnings history
- Set availability status (Online/Offline)

### 🛡️ Admins
- Approve/Suspend drivers
- Block/Unblock users
- View all rides and users

---

## 📁 Project Structure

```
├── src/
│ ├── app/
│ │ ├── config/
│ │ ├── errorHelpers/
│ │ ├── interfaces/
│ │ ├── middlewares/
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ ├── driver/
│ │ │ ├── ride/ 
│ │ │ ├── user/ 
│ │ │ └── routes/ 
│ │ └── utils/
│ ├── app.ts
│ └── server.ts 

```

## 📦 Installation

```bash
git clone https://github.com/fahimprito/ride-booking-API
cd ride-booking-API
npm install
```
## 🧪 Run the App
Development
```bash
npm run dev
```
Production
```bash
npm run build
npm start
```

## 🔗 API Endpoints

Deploy URL

http://localhost:5000/


## Routes

```bash
## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint                 | Access        | Description                     |
|--------|--------------------------|---------------|---------------------------------|
| POST   | /api/auth/login          | Public        | User login                      |
| POST   | /api/auth/logout         | Authenticated | Logout current session          |
| POST   | /api/auth/refresh-token  | Public        | Get new access token            |
| POST   | /api/auth/reset-password | Authenticated | Reset user password             |

---

### 👤 User Routes

| Method | Endpoint                 | Access             | Description                      |
|--------|--------------------------|--------------------|----------------------------------|
| POST   | /api/user/register       | Public             | Register a new user              |
| GET    | /api/user/all-users      | Admin, Super Admin | Get all users                    |
| PATCH  | /api/user/availability   | Driver             | Update availability status       |
| GET    | /api/user/:id            | Any Authenticated  | Get a single user by ID          |
| PATCH  | /api/user/:id            | Any Authenticated  | Update user info by ID           |
| PATCH  | /api/user/:id/status     | Admin, Super Admin | Block or change user status      |

---

### 🚗 Ride Routes

| Method | Endpoint                         | Access             | Description                          |
|--------|----------------------------------|--------------------|--------------------------------------|
| POST   | /api/ride/request                | Any Authenticated  | Request a new ride                   |
| GET    | /api/ride/all-rides              | Admin, Super Admin, Driver | Get all rides                |
| GET    | /api/ride/ride-history           | Rider              | View rider's ride history            |
| GET    | /api/ride/earning-history        | Driver             | View driver's earnings history       |
| GET    | /api/ride/:id                    | Any Authenticated  | Get ride details by ID               |
| PATCH  | /api/ride/accept/:id             | Driver             | Accept a ride request                |
| PATCH  | /api/ride/cancel/:id             | Any Authenticated  | Cancel a ride                        |
| PATCH  | /api/ride/update/:id             | Driver             | Update ride details/status           |


```
