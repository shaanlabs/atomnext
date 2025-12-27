# 🚀 Deploy AtomNext to Netlify

This guide will walk you through deploying your AtomNext website to **free Netlify hosting** with full functionality.

## Prerequisites

- [ ] GitHub account
- [ ] Netlify account (free) - [Sign up here](https://netlify.com)
- [ ] Resend account (free) for sending emails - [Sign up here](https://resend.com)

## Quick Deploy (Recommended)

### Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your email address
3. Go to your dashboard and click "API Keys"
4. Create a new API key and copy it (you'll need this later)

> **Note:** Resend free tier includes 100 emails/day which is more than enough for most small businesses.

### Step 2: Push Code to GitHub

```bash
# Initialize git if not already done  
git init
git add .
git commit -m "Prepare for Netlify deployment"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/atomnext.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Netlify

1. **Log in to** [netlify.com](https://netlify.com)

2. **Click** "Add new site" → "Import an existing project"

3. **Choose** "Deploy with GitHub"

4. **Select** your AtomNext repository

5. **Configure** build settings:
   - **Build command:** Leave empty
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`

6. **Click** "Deploy site"

### Step 4: Add Environment Variables

1. Go to **Site settings** → **Environment variables**

2. Add the following variables:

   | Key | Value |
   |-----|-------|
   | `RESEND_API_KEY` | Your Resend API key from Step 1 |
   | `OWNER_EMAIL` | atomnextai@gmail.com (or your business email) |

3. **Click** "Save"

4. **Redeploy** your site:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Step 5: Verify Everything Works

1. Visit your live site (e.g., `https://your-site-name.netlify.app`)

2. **Test Service Request Form:**
   - Go to `/order.html`
   - Fill out all fields
   - Submit
   - ✅ Check your email for confirmation

3. **Test Book Call Form:**
   - Go to `/book-call.html`
   - Fill out all fields
   - Submit
   - ✅ Check your email for confirmation

4. **Test Chatbot:**
   - Click chatbot icon
   - Send a message like "Tell me about your services"
   - ✅ Should respond instantly

## Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow instructions to add your domain (e.g., `atomnext.ai`)
4. Netlify provides free HTTPS automatically!

## Continuous Deployment

Every time you push to GitHub, Netlify automatically rebuilds and deploys your site. No manual steps needed!

```bash
# Make changes
git add .
git commit -m "Update homepage"
git push

# Netlify automatically deploys! 🎉
```

## Testing Locally (Before Deploy)

Want to test your Netlify Functions locally?

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd atomnext

# Start local dev server
netlify dev
```

This runs your site at `http://localhost:8888` with full Netlify Functions support!

## Troubleshooting

### Forms not sending emails?

- ✅ Check environment variables are set in Netlify
- ✅ Verify Resend API key is valid
- ✅ Check Netlify Functions logs: **Functions** tab in dashboard

### Chatbot not responding?

- ✅ Check browser console for errors
- ✅ Verify `/netlify/functions/chat.js` exists
- ✅ Check Netlify Functions logs

### 404 errors?

- ✅ Ensure publish directory is set to `.` (root)
- ✅ Check all file names are correct

## Support

Need help? Contact the development team at[atomnextai@gmail.com](mailto:atomnextai@gmail.com)

---

**🎉 Congratulations!** Your AtomNext website is now live on Netlify with:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Form submissions with email notifications
- ✅ Working chatbot
- ✅ Continuous deployment from GitHub
