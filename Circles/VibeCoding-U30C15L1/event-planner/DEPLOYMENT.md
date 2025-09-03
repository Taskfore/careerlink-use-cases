# Event Planner - Vercel Deployment Guide

This guide will walk you through deploying your Event Planner application to Vercel.

## 🚀 Prerequisites

Before deploying, make sure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Supabase Project**: Set up your Supabase project for authentication and database
4. **Backend API**: Your FastAPI backend should be deployed (we'll cover this too)

## 📋 Step 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Your Repository**
   - Connect your GitHub account if not already connected
   - Select your `event-planner-private` repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `frontend` (since your Next.js app is in the frontend folder)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**
   Add these environment variables in the Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api/v1
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like: `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Link to existing project or create new
   - Set environment variables when prompted

## 🗄️ Step 2: Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set Up Database Schema**
   - Use the SQL migrations in your `backend/db/migrations/` folder
   - Run them in the Supabase SQL editor

3. **Configure Authentication**
   - Set up email authentication
   - Configure redirect URLs to include your Vercel domain

## ⚙️ Step 3: Deploy Backend API

Since Vercel is primarily for frontend deployment, you'll need to deploy your FastAPI backend separately. Here are the recommended options:

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Add environment variables:
   ```
   DATABASE_URL=your-supabase-postgres-url
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. Deploy and get your API URL

### Option B: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables and deploy

### Option C: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect your GitHub repository
4. Set buildpacks and environment variables
5. Deploy

## 🔧 Step 4: Update Environment Variables

Once your backend is deployed, update your Vercel environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to point to your deployed backend:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   ```

## 🌐 Step 5: Configure Custom Domain (Optional)

1. In your Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update your Supabase redirect URLs to include the custom domain

## 🔄 Step 6: Set Up Automatic Deployments

Vercel automatically deploys when you push to your main branch. To set up:

1. **Enable Auto-Deploy** (should be enabled by default)
2. **Set up Preview Deployments** for pull requests
3. **Configure Branch Protection** in GitHub if needed

## 🧪 Step 7: Testing Your Deployment

1. **Test Authentication**
   - Try registering a new user
   - Test login functionality
   - Verify redirects work correctly

2. **Test API Integration**
   - Create an event
   - Test RSVP functionality
   - Verify data persistence

3. **Test Responsive Design**
   - Check mobile and desktop views
   - Test different screen sizes

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**
   - Double-check all environment variables are set
   - Ensure they're prefixed with `NEXT_PUBLIC_` for client-side access
   - Restart deployment after adding new variables

3. **API Connection Issues**
   - Verify your backend URL is correct
   - Check CORS settings in your backend
   - Ensure your backend is accessible

4. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs in Supabase settings
   - Ensure proper CORS configuration

### Useful Commands:

```bash
# Check build locally
cd frontend
npm run build

# Test production build locally
npm run start

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 📊 Monitoring and Analytics

1. **Vercel Analytics** (Optional)
   - Enable in your Vercel dashboard
   - Track performance and user behavior

2. **Error Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor application errors

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to your repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **CORS Configuration**
   - Configure your backend to only allow requests from your Vercel domain
   - Use proper CORS headers

3. **Authentication**
   - Ensure proper session management
   - Use secure cookies and tokens

## 🎉 Success!

Your Event Planner application is now deployed and accessible worldwide! 

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend-url.com`
- **Supabase**: Your Supabase project dashboard

Remember to:
- Monitor your application performance
- Set up proper logging and error tracking
- Keep your dependencies updated
- Regularly backup your database

Happy coding! 🚀
