# 📢 Announcement System

A full-stack digital notice board system for campus announcements, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

- **User Authentication** - Register/Login with JWT
- **Role-Based Access** - Admin, Teacher, Student roles
- **Announcements** - Create, read, update, delete announcements
- **Comments** - Engage with posts through comments
- **Rich Text Editor** - Format announcements with rich text
- **Search & Filters** - Find announcements by category or keyword
- **Notifications** - Real-time notifications for new posts
- **Profile Management** - Update user profile and settings
- **Admin Panel** - Manage users and approve pending posts
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- React Toastify
- React Helmet Async
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcryptjs

## 📁 Project Structure
notice-board/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components
│ │ ├── context/ # Auth context
│ │ ├── services/ # API services
│ │ └── App.jsx
│ └── package.json
│
└── server/ # Node.js backend
├── config/ # Database config
├── controllers/ # Route controllers
├── models/ # Database models
├── routes/ # API routes
├── middleware/ # Auth middleware
└── index.js