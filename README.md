# CollabDocx

A real-time collaborative document editing platform with version control and sharing capabilities.

## Project Overview

CollabDocx is a full-stack web application that allows multiple users to collaborate on documents in real-time. The platform provides document editing, version control, user management, and real-time communication features.

## Features

- *User Authentication*
  - Secure registration and login
  - JWT token-based authentication

- *Document Management*
  - Create, edit, and delete documents
  - Role-based access control (Owner, Editor, Viewer)
  - Document versioning and rollback capabilities

- *Real-time Collaboration*
  - Multiple users can edit documents simultaneously
  - Document locking mechanism to prevent conflicts
  - User presence indicators
  - Real-time chat between collaborators

- *Sharing Capabilities*
  - Generate share links with configurable permissions
  - Manage document access

- *AI Integration*
  - AI-powered chatbot for document assistance

## Technology Stack

### Frontend
- React 18
- TypeScript
- Recoil for state management
- React Router for navigation
- Tailwind CSS with shadcn/ui components
- WebSocket for real-time communication
- React Quill for rich text editing

### Backend
- Node.js
- Express.js
- PostgreSQL database
- Prisma ORM
- WebSocket for real-time communication
- JWT for authentication

## Setup and Installation

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

### Client Setup

1. Navigate to the client directory:
   
   cd client
   

2. Install dependencies:
   
   npm install
   

3. Create a .env file in the client directory with the following variables:
   
   VITE_BACKEND_URL=http://localhost:3000
   VITE_BACKEND_WEBSOCKET_URL=ws://localhost:3000
   VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
   

4. Start the development server:
   
   npm run dev
   

5. The client will be available at http://localhost:5173

### Server Setup

1. Navigate to the server directory:
   
   cd server
   

2. Install dependencies:
   
   npm install
   

3. Create a .env file in the server directory with the following variables:
   
   DATABASE_URL=postgresql://username:password@localhost:5432/collabdocx
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key
   

4. Set up the database schema:
   
   npx prisma migrate dev --name "initial"
   

5. Start the server:
   
   node app.js
   
   or with nodemon for development:
   
   npx nodemon app.js
   

6. The server will be running at http://localhost:3000

## Database Schema

The application uses the following data models:

- *User*: Stores user information and authentication details
- *Document*: Represents a document with title and content
- *DocumentAccess*: Manages access permissions for documents
- *Version*: Tracks document versions for rollback functionality

## Deployment

### Frontend Deployment
The frontend is configured for deployment on Vercel. Use the following steps:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy

### Backend Deployment
The backend can be deployed to any Node.js hosting service. Make sure to:

1. Set up a PostgreSQL database
2. Configure the environment variables
3. Deploy the Node.js application

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Commit your changes: git commit -m 'Add feature'
4. Push to the branch: git push origin feature-name
5. Submit a pull request

## License

This project is licensed under the MIT License.
