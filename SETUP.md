# Setup Guide - PDF Library Hub

## One-Time Setup Instructions

### Prerequisites
- **Node.js** (v14+) - Download from https://nodejs.org/
- **MongoDB** - Choose one:
  - Local: Install from https://www.mongodb.com/try/download/community
  - Cloud: Create free account at https://www.mongodb.com/cloud/atlas

### Step 1: Clone/Extract Project

```bash
cd /path/to/PDF-Library-Hub
```

### Step 2: Backend Setup

```bash
cd server

# Copy the example environment file
cp .env.example .env

# Edit .env with your settings:
# Linux/Mac:
nano .env

# Windows:
notepad .env

# Install dependencies
npm install
```

**Configure .env:**

For local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/pdf-library-hub
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
MAX_FILE_SIZE=50000000
UPLOAD_DIR=./uploads
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pdf-library-hub
```

### Step 3: Frontend Setup

```bash
cd ../client

# Copy the example environment file
cp .env.example .env

# Edit .env (default should work):
nano .env

# Install dependencies
npm install
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Expected output:
```
Compiled successfully!
webpack compiled...
To create a production build, run npm run build.
```

Browser will automatically open to `http://localhost:3000`

## Database Setup Options

### Option A: MongoDB Local Installation

#### macOS
```bash
# Install with Homebrew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Check status
brew services list

# Stop (when done)
brew services stop mongodb-community
```

#### Windows
1. Download installer from https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Install MongoDB as a Windows Service"
4. MongoDB starts automatically

#### Linux (Ubuntu/Debian)
```bash
# Add MongoDB repo
sudo apt update
sudo apt install -y mongodb

# Start service
sudo systemctl start mongodb

# Check status
sudo systemctl status mongodb
```

### Option B: MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email/Google
   - Create organization and project

2. **Create Cluster**
   - Click "Create a Deployment"
   - Choose "M0 Free" tier
   - Select region (choose closest)
   - Click "Create"

3. **Get Connection String**
   - Go to "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Add to `.env` as `MONGODB_URI`

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Use in connection string

5. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add your IP or `0.0.0.0/0` for development

## First Time Usage

### Register Account
1. Open http://localhost:3000
2. Click "Register"
3. Fill in details:
   - Name: Your name
   - Email: test@example.com
   - Password: At least 6 characters
4. Click "Register"
5. Log in with credentials

### Upload Test Book
1. Click "Upload" in navigation
2. Create or use existing PDF file
3. Fill in:
   - Title: "Test Book"
   - Author: "Your Name"
   - Description: Optional
   - Tags: Optional (comma-separated)
4. Click "Upload Book"
5. Should see success message

### Read Book
1. Go to "Library" (home page)
2. Click on the book card
3. PDF reader opens
4. Navigate and test features
5. Add bookmarks
6. Zoom in/out

## Running Commands

### Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Install packages
npm install [package-name]
```

### Frontend

```bash
# Development server
npm start

# Build for production
npm run build

# Test
npm test

# Install packages
npm install [package-name]
```

## Environment Variables Explained

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| MONGODB_URI | Database connection | mongodb://localhost:27017/pdf-library-hub |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development or production |
| JWT_SECRET | Token signing key | your-secret-key-min-32-chars |
| JWT_EXPIRE | Token expiration | 7d or 24h |
| MAX_FILE_SIZE | Max upload size | 50000000 (50MB) |
| UPLOAD_DIR | Uploads folder | ./uploads |

### Frontend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| REACT_APP_API_URL | Backend API location | http://localhost:5000/api |

## Common Issues & Solutions

### MongoDB Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Start MongoDB service
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb

# Windows: Use Services (search "Services")
```

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Change port in server/.env
PORT=5001

# Or kill existing process:
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Port 3000 Already in Use
```
Solution: Change port in terminal
PORT=3001 npm start
```

### Module Not Found Error
```
Error: Cannot find module 'package-name'
```
**Solution:**
```bash
# Reinstall packages
rm -rf node_modules
npm install
```

### PDF Upload Fails
**Causes:**
- File not PDF format
- File > 50MB
- Uploads folder missing

**Solution:**
```bash
# Create uploads folder
mkdir server/uploads

# Check file is PDF
# Reduce file size if needed
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Make sure server is running on :5000
- Make sure frontend is on :3000
- CORS already configured in server.js

### React Doesn't Start
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Start again
npm start
```

## Verification Checklist

- [ ] Node.js installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] MongoDB running (check with MongoDB Compass)
- [ ] .env files created and configured
- [ ] Dependencies installed in both folders
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Logs show "Successfully connected"
- [ ] Browser opens to http://localhost:3000
- [ ] No red errors in browser console

## Testing the Application

### Test Flow
1. Register new account
2. Verify email format accepted
3. Login with credentials
4. Upload test PDF
5. View in library
6. Click to read
7. Test page navigation
8. Add bookmark
9. Zoom in/out
10. Download PDF
11. Add to favorites
12. Edit book details
13. Search books
14. Toggle dark mode
15. Logout & login again

## Performance Tips

- Close unused applications
- Use modern browser (Chrome/Firefox)
- Ensure MongoDB is not CPU-intensive
- Clear browser cache if issues
- Use wired internet if possible

## Next Steps

### Production Deployment

1. **Backend (Render.com)**
   - Create account
   - Connect GitHub
   - Set environment variables
   - Deploy

2. **Frontend (Vercel)**
   - Run `npm run build`
   - Deploy to Vercel
   - Update REACT_APP_API_URL

3. **Database (MongoDB Atlas)**
   - Create production cluster
   - Enable backup
   - Configure IP whitelist

### Code Customization

- Edit colors in `client/src/styles/index.css`
- Add more book metadata in models
- Customize UI components
- Add more features

## Support

- Check README.md for feature overview
- Review API endpoints documentation
- Check browser console for errors
- Verify .env configurations
- Ensure all services running

## Additional Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Node.js Docs**: https://nodejs.org/docs/

---

**Setup Complete! Happy Coding! 🚀**

If you encounter any issues not listed here, check the README.md or console error messages for more details.
