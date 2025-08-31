# Note-Taking Application

A full-stack note-taking application built for the assignment requirements.

## Technology Stack

**Frontend:** React with TypeScript  
**Backend:** Node.js with Express (TypeScript)  
**Database:** MongoDB  
**Authentication:** JWT with email/OTP and Google OAuth

## Features Implemented

✅ **User Authentication**

- Email and OTP signup flow with input validation
- Google OAuth integration
- JWT-based authorization for notes

✅ **Note Management**

- Create and delete notes functionality
- Display user information in dashboard
- Mobile-friendly responsive design

✅ **Error Handling**

- Input validation errors
- OTP verification errors
- API failure messages

## Quick Setup

### Prerequisites

- Node.js (v18+)
- MongoDB
- Git

### Installation

1. **Clone and setup backend:**

```bash
cd backend
npm install
npm run dev
```

2. **Setup frontend:**

```bash
cd frontend
npm install
npm run dev
```

3. **Environment Configuration:**
   Edit `backend/.env` with your MongoDB URI and email credentials for OTP functionality.

### Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

1. **Sign Up:** Register with email → receive OTP → verify account
2. **Sign In:** Login with verified credentials or Google account
3. **Dashboard:** View user info, create and manage notes
4. **Notes:** Create, delete, and organize your notes

## Assignment Requirements Completed

✅ Email and OTP signup flow  
✅ Google OAuth integration  
✅ Input validation and error handling  
✅ User dashboard with note management  
✅ JWT authorization for API endpoints  
✅ Mobile-friendly responsive design  
✅ Modern technology stack

**Note:** In development mode, OTP codes are logged to the console for easy testing.
