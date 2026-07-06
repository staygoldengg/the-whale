# 🐋 The Whale — Deployment Guide

**One-click deployment to `thewhale.westhampton.app` with automated updates on every GitHub push.**

---

## **Quick Start (5 minutes)**

### **1. Deploy to Vercel**

```bash
npm install -g vercel
vercel --prod
```

Or use the web interface:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select `the-whale` GitHub repository
4. Click "Import"
5. Add environment variables (see below)
6. Click "Deploy"

### **2. Add Environment Variables**

In Vercel dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]
OPENAI_API_KEY=(optional - leave blank for demo mode)
OPENAI_MODEL=gpt-4o-mini
```

**How to find Supabase keys:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select "The Whale" project
3. Settings → API
4. Copy `Project URL` and `anon public key`
5. Go to Settings → Database → Configuration
6. Copy `Service Role Key`

**Note:** Keys are already in `.env.local` for development. For production, use Vercel secrets.

### **3. Connect Custom Domain**

1. Vercel dashboard → Project → Settings → Domains
2. Add `thewhale.westhampton.app`
3. Copy CNAME value
4. Go to domain registrar (GoDaddy, Namecheap, etc.) → DNS settings
5. Add CNAME record:
   ```
   subdomain: thewhale
   points to: cname.vercel-dns.com
   ```
6. Wait 5-10 minutes for DNS propagation
7. ✅ Visit `thewhale.westhampton.app`

### **4. Enable Automatic Deployments**

✅ **Already configured!** Every push to `main` branch auto-deploys.

```bash
# All you need to do is push
git add .
git commit -m "your message"
git push origin main
```

Vercel automatically:
- Builds the app
- Runs tests
- Deploys to production
- Updates `thewhale.westhampton.app`

---

## **Accessing the App**

### **Desktop**
- Browser: Visit `thewhale.westhampton.app`
- Works in Chrome, Firefox, Safari, Edge

### **Mobile (iPhone)**
1. Open Safari
2. Visit `thewhale.westhampton.app`
3. Tap Share → "Add to Home Screen"
4. Launch from home screen (fullscreen app)

### **Mobile (Android)**
1. Open Chrome
2. Visit `thewhale.westhampton.app`
3. Tap menu (⋮) → "Install app"
4. Launch from home screen (fullscreen app)

---

## **Features Included (All Free)**

✅ Guest mode (no login required)  
✅ Personalized dashboard  
✅ AI generation (with OpenAI API key, optional)  
✅ Index board with custom columns  
✅ Rotating teacher tips  
✅ Drag-and-drop interface  
✅ Offline support (PWA)  
✅ Mobile responsive  
✅ Desktop standalone  

---

## **Free Service Limits & Upgrades**

| Service | Free Tier | Cost to Upgrade |
|---------|-----------|-----------------|
| **Vercel Hosting** | 100GB bandwidth/mo | $20+/mo |
| **Supabase Database** | 500MB, 100k API calls/mo | $25+/mo |
| **OpenAI API** | Pay-as-you-go (~$0.001 per request) | N/A |

For a school with 50 teachers, expect:
- **Hosting:** ~$0 (fits free tier)
- **Database:** ~$0 (fits free tier)
- **API:** ~$5-20/month (if AI enabled)

---

## **Troubleshooting**

### Domain not working
- Check DNS CNAME record in registrar
- Wait 10+ minutes for propagation
- Try in incognito mode

### App shows loading indefinitely
- Check Vercel deployment status (vercel.com → Project → Deployments)
- Check browser console for errors (F12)
- Try hard refresh (Ctrl+Shift+R on Windows)

### Environment variables not loading
- Verify variables in Vercel dashboard
- Redeploy after adding variables (top-right → Redeploy)

### Mobile app won't install
- Use Chrome (Android) or Safari (iOS)
- Some corporate networks block PWA installation
- Try accessing from mobile hotspot first

---

## **Monitoring & Analytics**

### View deployment logs
```bash
vercel logs
```

### Monitor performance
- Vercel dashboard → Analytics
- Shows performance, errors, and usage

### Check Supabase health
- Go to [supabase.com](https://supabase.com) → Dashboard
- Project → Database → Health

---

## **Advanced: Custom Domain + Subdomain**

If `westhampton.app` domain is already registered:

1. Update DNS CNAME:
   ```
   thewhale.westhampton.app → cname.vercel-dns.com
   ```

2. Vercel auto-verifies ownership and enables SSL

3. (Optional) Add `www` subdomain:
   ```
   www.thewhale.westhampton.app → same CNAME
   ```

---

## **Rollback if Something Breaks**

```bash
# Push a fix
git commit -m "fix: revert broken feature"
git push origin main

# Or rollback to previous deployment
# Vercel dashboard → Deployments → hover over previous → Promote to Production
```

---

## **Environment Variables Reference**

```env
# Required - Supabase (database & auth)
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-project-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]

# Optional - OpenAI API
# Leave blank to skip AI generation features
OPENAI_API_KEY=sk-[your-openai-api-key]
OPENAI_MODEL=gpt-4o-mini

# Optional - Google Workspace (if setting up Docs/Sheets export)
GOOGLE_CLIENT_EMAIL=[your-google-client-email]
GOOGLE_PRIVATE_KEY=[your-google-private-key]
GOOGLE_DRIVE_FOLDER_ID=[your-folder-id]
GOOGLE_CALENDAR_ID=[your-calendar-id]
GOOGLE_IMPERSONATE_EMAIL=[admin-email]
```

See `README.md` for instructions on finding these values.

---

## **Support**

- 🐙 GitHub: https://github.com/staygoldengg/the-whale
- 📧 Issues: Create a GitHub Issue
- 🔗 Vercel Docs: https://vercel.com/docs

---

**Status:** ✅ Ready for production deployment
