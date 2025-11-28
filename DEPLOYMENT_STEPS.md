# 🚀 Quick Deployment Steps

## Step-by-Step Deployment Guide

### 🔴 BACKEND DEPLOYMENT (Render) - Do This FIRST

1. **Go to Render**: https://render.com
    - Sign up/Login with GitHub

2. **Create PostgreSQL Database**
    - Click "New +" → "PostgreSQL"
    - Name: `employee-management-db`
    - Click "Create Database"
    - ⚠️ **IMPORTANT**: Copy the "Internal Database URL" - you'll need it!

3. **Create Web Service**
    - Click "New +" → "Web Service"
    - Connect repository: `boddusaiganesh/Employee_management`
    - Configure:
      ```
      Name: employee-management-api
      Region: Oregon (or closest to you)
      Branch: main
      Root Directory: server
      Runtime: Node
      Build Command: npm install && npm run build
      Start Command: npm run prisma:migrate && npm run prisma:seed && npm start
      ```

4. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable")
   ```
   NODE_ENV=production
   DATABASE_URL=<paste your Internal Database URL from step 2>
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   PORT=5000
   ```

5. **Deploy**
    - Click "Create Web Service"
    - Wait 5-10 minutes
    - Your backend URL will be: `https://employee-management-api.onrender.com`
    - ⚠️ **COPY THIS URL** - you need it for frontend!

---

### 🔵 FRONTEND DEPLOYMENT (Vercel) - Do This SECOND

1. **Update API URL**
    - Before deploying, you MUST update this file:
    - Edit: `client/.env.production`
    - Replace with YOUR backend URL:
      ```
      VITE_API_URL=https://employee-management-api.onrender.com/api
      ```
    - Commit and push:
      ```bash
      git add client/.env.production
      git commit -m "Update production API URL"
      git push origin main
      ```

2. **Go to Vercel**: https://vercel.com
    - Sign up/Login with GitHub

3. **Import Project**
    - Click "Add New" → "Project"
    - Select repository: `boddusaiganesh/Employee_management`
    - Configure:
      ```
      Framework Preset: Vite
      Root Directory: client
      Build Command: npm run build
      Output Directory: dist
      ```

4. **Add Environment Variable**
    - Click "Environment Variables"
    - Add:
      ```
      Name: VITE_API_URL
      Value: https://employee-management-api.onrender.com/api
      ```
    - Select: Production, Preview, Development

5. **Deploy**
    - Click "Deploy"
    - Wait 2-3 minutes
    - Your frontend URL will be: `https://your-project.vercel.app`

---

## ✅ Testing Your Deployment

1. **Test Backend**
    - Visit: `https://employee-management-api.onrender.com`
    - Should see: `{"message": "Employee Management API", ...}`

2. **Test Frontend**
    - Visit your Vercel URL
    - Click "Admin Access" button
    - Should login successfully and see dashboard

3. **Test Demo Accounts**
    - Admin: `admin@example.com` / `9392359Abc@`
    - User: `user@example.com` / `9392359Abc@`

---

## ⚠️ Important Notes

1. **First Request Delay**
    - Render free tier "spins down" after 15 minutes of inactivity
    - First request after spin-down takes 30-60 seconds
    - This is normal for free tier!

2. **Environment Variables**
    - Backend needs: DATABASE_URL, JWT_SECRET, NODE_ENV, PORT
    - Frontend needs: VITE_API_URL

3. **CORS**
    - Already configured to accept all origins
    - For production security, update `server/src/server.ts` to specific origin

---

## 🎉 After Successful Deployment

Update your README.md with live links:

```markdown
## 🌐 Live Demo

- **Frontend:** https://your-project.vercel.app
- **Backend API:** https://employee-management-api.onrender.com

### Demo Accounts:
- **Admin:** admin@example.com / 9392359Abc@
- **User:** user@example.com / 9392359Abc@
```

---

## 🐛 Troubleshooting

**Backend not starting?**

- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

**Frontend can't connect to backend?**

- Verify VITE_API_URL is set correctly
- Check if backend is deployed and accessible
- Look at browser console for errors

**Login not working?**

- Backend might be spinning up (wait 60 seconds)
- Check if database is seeded
- Verify credentials are correct

---

## 📧 Share Your Deployment

After deployment, email to:

- vasudharini.s@prou.com.au
- pavithra.mannar@prou.com.au

Include:

- ✅ GitHub: https://github.com/boddusaiganesh/Employee_management
- ✅ Live Frontend: <your-vercel-url>
- ✅ Backend API: <your-render-url>
- ✅ Demo credentials provided in README
