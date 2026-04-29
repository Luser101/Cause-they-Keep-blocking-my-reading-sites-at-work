# Quick Start Guide - PDF Library Hub

## 🚀 Start in 30 Seconds

### Without Docker
```bash
# Terminal 1 - Backend
cd server && npm install && npm run dev

# Terminal 2 - Frontend
cd client && npm install && npm start
```

### With Docker
```bash
docker-compose up
```

App opens at **http://localhost:3000**

---

## 📋 Detailed Setup

### 1️⃣ Install Node.js
- Download from https://nodejs.org/ (v14+)
- Verify: `node -v && npm -v`

### 2️⃣ Configure Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Expected: `Server running on port 5000`

### 3️⃣ Configure Frontend

```bash
cd ../client
cp .env.example .env
npm install
npm start
```

Expected: Browser opens to http://localhost:3000

### 4️⃣ Create Account & Test
1. Click "Register"
2. Create account
3. Upload sample PDF
4. Read book online

---

## 🎯 Key Features

| Feature | How to Use |
|---------|-----------|
| **Upload** | Click "Upload" → Drag PDF → Fill details → Submit |
| **Search** | Use search bar on library page |
| **Read** | Click book card → Navigate pages → Zoom in/out |
| **Bookmark** | Click bookmark icon on reader toolbar |
| **Download** | Click download icon on book card |
| **Favorites** | Click heart icon to add/remove |
| **Dark Mode** | Toggle sun/moon icon in header |

---

## 🔧 API Quick Reference

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Books
- `GET /api/books` - List books
- `POST /api/books` - Upload (protected)
- `GET /api/books/:id` - Get details
- `PUT /api/books/:id` - Update (protected)
- `DELETE /api/books/:id` - Delete (protected)

### User
- `POST /api/user/favorites` - Add favorite
- `GET /api/user/bookmarks/:id` - Get bookmarks
- `POST /api/user/progress` - Save reading page

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb            # Linux
```

### Port Already in Use
```bash
# Use different ports
PORT=5001 npm run dev      # Backend
PORT=3001 npm start         # Frontend
```

### Dependencies Not Installing
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Production Deployment

### Build Frontend
```bash
cd client
npm run build
# Deploy 'build' folder to Vercel or Netlify
```

### Deploy Backend
1. Use Render.com, Heroku, or Railway
2. Set environment variables
3. Connect MongoDB Atlas

### Environment Variables (Production)
```
MONGODB_URI=your-atlas-url
JWT_SECRET=long-random-string-32-chars-minimum
NODE_ENV=production
PORT=5000
```

---

## 📚 File Structure

```
PDF-Library-Hub/
├── server/          # Express + MongoDB
│   ├── controllers/ # Business logic
│   ├── models/      # Database schemas
│   ├── routes/      # API endpoints
│   ├── uploads/     # PDF storage
│   └── package.json
├── client/          # React app
│   ├── components/  # UI components
│   ├── pages/       # Page components
│   ├── styles/      # CSS files
│   └── package.json
└── README.md        # Full documentation
```

---

## ✨ Features Included

✅ User authentication (JWT)  
✅ PDF upload & storage  
✅ Full-text search  
✅ PDF reader (PDF.js)  
✅ Page bookmarks  
✅ Reading progress  
✅ Favorites system  
✅ Dark mode toggle  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Toast notifications  

---

## 🔐 Security

✅ Password hashing  
✅ JWT tokens  
✅ Protected routes  
✅ File validation  
✅ Input sanitization  
✅ CORS enabled  
✅ Error handling  

---

## 📱 Browser Support

✅ Chrome / Edge / Firefox / Safari  
✅ Mobile browsers (iOS / Android)  
✅ Tablets  
✅ Desktop  

---

## 💡 Tips

- Use MongoDB Atlas for cloud database
- Deploy frontend to Vercel (free)
- Deploy backend to Render.com (free)
- Use HTTPS in production
- Keep JWT_SECRET secure
- Enable MongoDB backups

---

## 🆘 Need Help?

1. Check SETUP.md for detailed guide
2. View API endpoints in README.md
3. Check browser console for errors
4. Verify all services running
5. Review .env configurations

---

## 📞 Contact & Support

For issues:
- Create GitHub issue
- Review error messages
- Check documentation
- Verify configuration

---

**Happy coding! 🎉**

Build something amazing with PDF Library Hub!
