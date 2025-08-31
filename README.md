# Full-Stack Note-Taking Application

A complete note-taking app built to exact assignment specifications with modern technology stack.

## Technology Stack
**Frontend:** React with TypeScript  
**Backend:** Node.js with Express (TypeScript)  
**Database:** MongoDB  
**Authentication:** JWT with email/OTP and Google OAuth  
**Deployment:** Render (https://note-app-r1cw.onrender.com)

## Assignment Requirements ✅ COMPLETED

### 1. **Email & OTP Signup Flow**
- ✅ Email registration with proper input validation
- ✅ OTP verification system with email delivery
- ✅ Input validation for all signup fields

### 2. **Error Handling & Validation**
- ✅ Display error messages for incorrect inputs
- ✅ OTP verification error handling
- ✅ API failure error messages
- ✅ Real-time input validation

### 3. **User Dashboard & Note Management**
- ✅ Welcome page with user information display
- ✅ Create notes functionality
- ✅ Delete notes functionality
- ✅ Update/Edit notes functionality
- ✅ JWT authorization for all note operations

### 4. **Google OAuth Integration**
- ✅ Sign up using Google account
- ✅ Sign in using Google account
- ✅ Seamless OAuth flow integration

### 5. **Mobile-Friendly Design**
- ✅ Responsive design for all screen sizes
- ✅ Replicates provided design specifications
- ✅ Mobile-optimized UI components

### 6. **JWT Authorization**
- ✅ JWT tokens for user authentication
- ✅ Protected API endpoints for notes
- ✅ Secure note creation and deletion

## Quick Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation
```bash
# Setup backend
cd backend
npm install
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `backend/.env` from `backend/.env.example`:
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/noteapp
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Create `frontend/.env` from `frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5000
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Live Demo: https://note-app-r1cw.onrender.com

## Features Implemented

**Authentication System:**
- Email/OTP registration and verification
- Google OAuth sign-up and sign-in
- JWT-based session management
- Input validation and error handling

**Note Management:**
- Create, read, update, delete notes
- User-specific note access
- Real-time note operations
- Responsive note cards interface

**Security:**
- JWT authorization for API endpoints
- Protected routes
- User data isolation
- Secure authentication flows

**UI/UX:**
- Mobile-responsive design
- Modern React with TypeScript
- Error state management
- Loading states and feedback

All assignment requirements have been fully implemented and tested. The application is deployed and ready for evaluation.
