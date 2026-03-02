# Deployment Guide for QuizGuard

## Production Deployment on Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add global shareable links for deployed domain"
git push origin join-quiz-feature
```

### Step 2: Create Pull Request & Merge
1. Go to https://github.com/Pavan2267/Quiz-System
2. Create Pull Request from `join-quiz-feature` to `main`
3. Merge to trigger automatic Vercel deployment

### Step 3: Set Environment Variable on Vercel

After deployment, you need to configure the site URL:

1. Go to your Vercel Dashboard
2. Select your **Quiz-System** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** Your deployed domain (e.g., `https://quiz-app.vercel.app`)
   - **Environments:** Select Production, Preview, and Development
5. Click **Save**
6. Redeploy to apply changes

### What This Does

The `NEXT_PUBLIC_SITE_URL` environment variable ensures that quiz shareable links:
- Work globally (not just localhost)
- Can be shared with anyone worldwide
- Direct students to your actual deployed domain
- Continue to work after redeployment

### Example Links

**Before (localhost only):**
```
http://localhost:3000/quiz/quiz_abc123_1234567890
```

**After (global):**
```
https://your-domain.vercel.app/quiz/quiz_abc123_1234567890
```

## Local Development

For local development, the app automatically defaults to `http://localhost:3000`. No configuration needed!

## Troubleshooting

**Links still show localhost?**
- Check that `NEXT_PUBLIC_SITE_URL` is set in Vercel Environment Variables
- Verify the value matches your actual domain
- Redeploy after adding the variable

**Can't find Environment Variables in Vercel?**
- Go to Settings tab of your Vercel project
- Select "Environment Variables" from the left menu
- Make sure you're in the right project

## Support

For issues with deployment, contact Vercel support or check their documentation at vercel.com/help
