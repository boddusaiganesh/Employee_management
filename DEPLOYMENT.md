# 🚀 Deployment Guide

This guide will help you deploy the Employee Management System to production.

## Architecture

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: PostgreSQL on Render

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com

---

## 🔧 Backend Deployment (Render)

### Option 1: Using Render Dashboard (Recommended)

1. **Sign up/Login to Render**: https://render.com

2. **Create PostgreSQL Database**
    - Click "New +" → "PostgreSQL"
    - Name: `employee-management-db`
    - Database: `employee_db`
    - User: `employee_user`
    - Region: Choose closest to you
    - Plan: Free
    - Click "Create Database"
    - **Save the Internal Database URL** (you'll need this)

3. **Create Web Service**
    - Click "New +" → "Web Service"
    - Connect your GitHub repository: `boddusaiganesh/Employee_management`
    - Name: `employee-management-api`
    - Region: Same as database
    - Branch: `main`
    - Root Directory: `server`
    - Runtime: `Node`
    - Build Command: `npm install && npm run build`
    - Start Command: `npm run prisma:migrate && npm run prisma:seed && npm start`
    - Plan: Free

4. **Add Environment Variables**
    - Click "Environment" tab
    - Add these variables:
      ```
      NODE_ENV=production
      DATABASE_URL=<paste your PostgreSQL Internal Database URL>
      JWT_SECRET=<generate a random secure string>
      PORT=5000
      ```
    - To generate JWT_SECRET, run in terminal:
      ```bash
      node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
      ```

5. **Deploy**
    - Click "Create Web Service"
    - Wait for deployment (5-10 minutes)
    - Your backend will be available at: `https://employee-management-api.onrender.com`

### Option 2: Using render.yaml (Automatic)

1. Push the `render.yaml` file to your repository (already done)
2. Go to Render Dashboard → "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create both database and service
5. Update environment variables as needed

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API URL

Before deploying, update the production API URL:

```bash
# Edit client/.env.production
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render backend URL.

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (Optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard** (Recommended)
    - Login to Vercel: https://vercel.com
    - Click "Add New" → "Project"
    - Import your GitHub repository: `boddusaiganesh/Employee_management`
    - Framework Preset: Vite
    - Root Directory: `client`
    - Build Command: `npm run build`
    - Output Directory: `dist`
    - Environment Variables:
      ```
      VITE_API_URL=https://your-backend-url.onrender.com/api
      ```
    - Click "Deploy"

3. **Deploy via CLI** (Alternative)
   ```bash
   cd client
   vercel
   # Follow the prompts
   # When asked for environment variables, add:
   # VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. Your frontend will be available at: `https://your-project.vercel.app`

---

## ✅ Post-Deployment Checklist

### Backend (Render)

- [ ] Database is created and running
- [ ] Web service is deployed successfully
- [ ] Environment variables are set correctly
- [ ] Migrations ran successfully
- [ ] Database is seeded with demo data
- [ ] API is accessible at: `https://your-backend-url.onrender.com`
- [ ] Test endpoint: `https://your-backend-url.onrender.com/api/auth/login`

### Frontend (Vercel)

- [ ] Build completed successfully
- [ ] VITE_API_URL environment variable is set
- [ ] Application loads at Vercel URL
- [ ] Can login with demo accounts
- [ ] API calls work correctly
- [ ] All features are functional

---

## 🧪 Testing Deployed Application

### Test Backend API

```bash
# Test if backend is running
curl https://your-backend-url.onrender.com

# Test login endpoint
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"9392359Abc@"}'
```

### Test Frontend

1. Visit your Vercel URL
2. Login with demo accounts:
    - Admin: `admin@example.com` / `9392359Abc@`
    - User: `user@example.com` / `9392359Abc@`
3. Test all features:
    - Dashboard loads
    - View employees
    - View tasks
    - (Admin) Create/Edit/Delete operations

---

## 🔄 Updating After Deployment

### Backend Updates

1. Push changes to GitHub
2. Render will automatically redeploy
3. Or manually trigger deployment from Render Dashboard

### Frontend Updates

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger deployment: `vercel --prod`

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Errors**

- Verify DATABASE_URL in environment variables
- Check if PostgreSQL database is running
- Ensure database is in same region as web service

**Build Failures**

- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify build command is correct

**Migration Errors**

- Run migrations manually: SSH into service or use Render Shell
- Reset database if needed: `npx prisma migrate reset`

### Frontend Issues

**API Connection Errors**

- Verify VITE_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

**Build Failures**

- Check build logs in Vercel dashboard
- Verify all dependencies are installed
- Check for TypeScript errors

**Environment Variables Not Working**

- Redeploy after adding/changing env vars
- Ensure env var names start with VITE_

---

## 🔒 Security Notes

### Production Environment Variables

Make sure these are set properly:

```env
# Backend (.env on Render)
NODE_ENV=production
DATABASE_URL=<secure-postgres-url>
JWT_SECRET=<long-random-secure-string>
PORT=5000

# Frontend (.env.production on Vercel)
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### CORS Configuration

The backend is configured to accept requests from any origin. For production, update `server/src/server.ts`:

```typescript
app.use(cors({
    origin: [
        'https://your-frontend.vercel.app',
        'http://localhost:3000' // for local development
    ],
    credentials: true
}));
```

---

## 📊 Monitoring

### Render

- View logs: Dashboard → Service → Logs
- Monitor metrics: Dashboard → Service → Metrics
- Database status: Dashboard → Database → Metrics

### Vercel

- View deployments: Dashboard → Project → Deployments
- Check analytics: Dashboard → Project → Analytics
- Monitor performance: Dashboard → Project → Speed Insights

---

## 💰 Free Tier Limits

### Render Free Tier

- 750 hours/month of runtime
- PostgreSQL: 256MB RAM, 1GB storage
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

### Vercel Free Tier

- 100GB bandwidth/month
- 100 deployments/day
- Unlimited websites
- Automatic HTTPS

---

## 🎉 Your Deployed URLs

After deployment, add these to your README.md:

```markdown
## 🌐 Live Demo

- **Frontend:** https://your-project.vercel.app
- **Backend API:** https://your-backend.onrender.com
- **API Documentation:** https://your-backend.onrender.com/api

### Demo Accounts:
- **Admin:** admin@example.com / 9392359Abc@
- **User:** user@example.com / 9392359Abc@
```

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Need Help?** Check the troubleshooting section or contact support.
