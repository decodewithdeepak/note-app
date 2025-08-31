# Full-Stack Note-Taking Application

A modern, responsive note-taking application built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **User Authentication**

  - Email & OTP verification signup
  - Google OAuth integration
  - JWT-based authentication
  - Secure password hashing

- **Note Management**

  - Create, edit, and delete notes
  - Pin/unpin important notes
  - Real-time note updates
  - Rich text content support

- **User Experience**
  - Responsive design (mobile-friendly)
  - Clean, modern UI
  - User dashboard with profile info
  - Error handling with user-friendly messages

## 🛠️ Technology Stack

### Frontend

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** for OAuth
- **Nodemailer** for email services

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd note-app
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies

npm install

# Configure environment variables

cp .env.example .env

# Edit .env with your configurations

# Start development server

npm run dev
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies

npm install

# Start development server

npm run dev
\`\`\`

## 🔧 Environment Configuration

### Backend (.env)

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noteapp
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Email Configuration (for OTP)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL

FRONTEND_URL=http://localhost:5173

# Session Secret

SESSION_SECRET=your_session_secret_key
\`\`\`

## 🗄️ Database Setup

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The app will automatically connect to \`mongodb://localhost:27017/noteapp\`

### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update \`MONGODB_URI\` in your .env file

## 📧 Email Setup (for OTP functionality)

### Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use your Gmail address and app password in the .env file

### Alternative Email Providers

Update the EMAIL_HOST and EMAIL_PORT for other providers:

- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587

## 🔑 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - \`http://localhost:5000/api/auth/google/callback\`
6. Update your .env with the client ID and secret

## 🚀 Deployment

### Frontend (Vercel/Netlify)

\`\`\`bash
cd frontend
npm run build

# Deploy the 'dist' folder

\`\`\`

### Backend (Heroku/Railway/Render)

\`\`\`bash
cd backend
npm run build
npm start
\`\`\`

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform, especially:

- \`NODE_ENV=production\`
- Update \`FRONTEND_URL\` to your frontend domain
- Update \`GOOGLE_CALLBACK_URL\` to your backend domain

## 📱 Features Overview

### Authentication Flow

1. **Sign Up**: User registers with email → receives OTP → verifies email
2. **Sign In**: User logs in with verified credentials
3. **Google OAuth**: Alternative login method
4. **JWT Tokens**: Secure API access

### Note Management

1. **Create**: Add new notes with title and content
2. **Edit**: Modify existing notes
3. **Delete**: Remove unwanted notes
4. **Pin**: Mark important notes
5. **View**: Browse all notes in dashboard

## 🧪 API Endpoints

### Authentication

- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/verify-otp\` - OTP verification
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/google\` - Google OAuth
- \`GET /api/auth/me\` - Get user profile

### Notes

- \`GET /api/notes\` - Get all user notes
- \`POST /api/notes\` - Create new note
- \`PUT /api/notes/:id\` - Update note
- \`DELETE /api/notes/:id\` - Delete note

## 🎨 Design Assets

The application includes:

- Custom icons and images
- Responsive layouts
- Modern color scheme
- Mobile-optimized interface

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in .env

2. **Email OTP Not Working**

   - Verify email credentials
   - Check spam folder
   - Ensure app passwords are used for Gmail

3. **Google OAuth Issues**
   - Verify client ID and secret
   - Check authorized redirect URIs
   - Ensure Google+ API is enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Built with ❤️ for the note-taking assignment.

---

**Note**: This application demonstrates modern full-stack development practices with TypeScript, React, Node.js, and MongoDB. It includes authentication, CRUD operations, responsive design, and production-ready features.
