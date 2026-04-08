# Campus Complaint Management System

A full-stack web application that allows students to submit complaints and administrators to manage and resolve them.
The system includes authentication, role-based access control, complaint tracking, and admin analytics.

---

# 🚀 Live Demo

Frontend: https://machireddyswathi.github.io/campus-complaint-system
Backend: https://campus-complaint-system-u46x.onrender.com/api

---

# 📌 Features

## Authentication

* Student Signup & Login
* Admin Login
* JWT Authentication
* Role-based Access Control
* Protected Routes

## Student Features

* Create Complaint
* Edit Complaint (before resolved)
* Delete Complaint (before resolved)
* View Complaint Status
* Search Complaints
* Filter by Status
* Pagination

## Admin Features

* View All Complaints
* Update Complaint Status
* Add Admin Notes
* Priority Management
* Search & Filter
* Pagination
* Dashboard Statistics

## Complaint Features

* Title & Description
* Status (Pending, In Progress, Resolved)
* Priority (Low, Medium, High, Urgent)
* Admin Notes
* Created Date
* User Association

---

# 🛠 Tech Stack

Frontend:

* HTML
* CSS
* JavaScript (Vanilla)

Backend:

* Node.js
* Express.js

Database:

* MongoDB Atlas
* Mongoose

Authentication:

* JWT
* bcrypt

Deployment:

* Frontend: GitHub Pages / Vercel
* Backend: Render

---

# 📁 Project Structure

```
campus-complaint-system
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
├── pages
│   ├── login.html
│   ├── signup.html
│   ├── student.html
│   └── admin.html
│
├── css
├── js
└── index.html
```

---

# ⚙️ Installation (Local Setup)

### 1. Clone repo

```
git clone https://github.com/Machireddyswathi/campus-complaint-system.git
cd campus-complaint-system
```

### 2. Install backend dependencies

```
cd backend
npm install
```

### 3. Create .env file

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
```

### 4. Run backend

```
npm start
```

### 5. Open frontend

Open:

```
index.html
```

---

# 🔐 API Routes

Auth

POST /api/auth/signup
POST /api/auth/login

Student

GET /api/complaints/my
POST /api/complaints
PUT /api/complaints/my/:id
DELETE /api/complaints/my/:id

Admin

GET /api/complaints
PUT /api/complaints/:id
PUT /api/complaints/note/:id
GET /api/complaints/stats

---

# 📊 Admin Dashboard Stats

* Total Complaints
* Pending
* In Progress
* Resolved

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* Role Based Authorization
* Protected API Routes
* Input Validation
* Secure MongoDB Atlas

---

# 📷 Screenshots

## Login Page

* Student/Admin login UI

## Student Dashboard

* Create complaint
* View complaints
* Status tracking

## Admin Dashboard

* Manage complaints
* Update status
* Analytics cards

---

# 🎯 Future Improvements

* Email Notifications
* File Upload (image proof)
* Comment system
* Complaint categories
* Dark mode
* Google OAuth login

---

# 👩‍💻 Author

Swathi
BTech CSE Student

GitHub:
https://github.com/Machireddyswathi

---

# 📄 License

This project is for educational purposes.
