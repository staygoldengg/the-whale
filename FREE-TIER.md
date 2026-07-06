# 🆓 The Whale — Free Tier Configuration

**This app is designed to run 100% free with no paid services required.**

---

## **Services Used (All Free Tier)**

### **1. Vercel Hosting** ✅ FREE
- **What:** Web server & deployment
- **Free Tier:** 
  - 100 GB bandwidth per month
  - Unlimited deployments
  - Auto SSL certificate
  - Custom domains
  - Auto-deploys on git push
- **Cost:** $0/month
- **Estimate:** 50 teachers × 50 page views/day = ~2.5 GB/month (well under limit)
- **Setup:** See `DEPLOYMENT.md`

### **2. Supabase Database** ✅ FREE
- **What:** PostgreSQL database + authentication
- **Free Tier:**
  - 500 MB database storage
  - 2 Million API calls per month (~67k/day)
  - 1 GB file storage (optional)
  - Email auth included
- **Cost:** $0/month
- **Estimate:** 50 teachers with profiles + tips + index items = ~10 MB (well under limit)
- **Setup:** Already configured in `.env.local`
- **Dashboard:** https://supabase.com/dashboard

### **3. OpenAI API** ✅ OPTIONAL (Pay-as-you-go)
- **What:** AI content generation (lesson plans, messages, etc.)
- **Free Tier:** None - but pay-as-you-go
- **Cost:** ~$0.0002 per request (gpt-4o-mini)
- **Estimate:** 50 teachers × 10 generations/month = ~$0.10/month
- **Workaround:** Leave `OPENAI_API_KEY` blank to skip AI features
- **Setup:** Optional - add API key to Vercel dashboard if desired

---

## **What This Means for Schools**

### **100% Free Option** (No AI)
```
Monthly Cost: $0

Includes:
✅ Guest mode (no login)
✅ Personalized dashboard
✅ Index board with custom columns
✅ Rotating tips
✅ Mobile + desktop app
✅ Unlimited users
✅ Custom domain
✅ Automatic deployments
```

### **Minimal Cost Option** (With AI)
```
Monthly Cost: $5-20

Same as above, PLUS:
✅ AI lesson planning
✅ AI message generation
✅ AI parent feedback
✅ AI coloring prompts
✅ Cost scales with usage
```

---

## **Scaling Limits (When to Upgrade)**

| Metric | Free Limit | Typical School (50 users) | When to Upgrade |
|--------|-----------|---------------------------|-----------------|
| **Bandwidth** | 100 GB/mo | ~2-5 GB/mo | >1000 active users |
| **API Calls** | 2M/mo | ~50k/mo | >10k users or heavy usage |
| **Database** | 500 MB | ~50 MB | >2000 database records |
| **Custom Domains** | ∞ | 1 domain | Never |
| **SSL Certs** | Free | 1 cert | Never |
| **Auto-Deployments** | ∞ | Unlimited | Never |

**Summary:** Free tier supports **1,000+ concurrent users** and **10,000+ teachers** before upgrades needed.

---

## **How to Keep Costs at $0**

### **1. Don't Add OpenAI API Key**
Leave `OPENAI_API_KEY` blank in Vercel dashboard. The app will:
- Still launch normally
- Skip AI generation features (graceful degradation)
- Show message: "AI features require API key"

### **2. Use Supabase Free Tier**
- Already set up
- No action needed
- Automatically enforces 500 MB limit
- Upgrade only if you hit the limit

### **3. Use Vercel Free Tier**
- Already set up
- Auto-scales within free limits
- Pay-per-use after limit (one-time)
- Downgrade if you don't want to pay

### **4. Monitor Usage**

**Vercel Dashboard:**
```
vercel.com → Dashboard → The Whale → Analytics
Shows:
  • Bandwidth used this month
  • API requests
  • Serverless function calls
  • Performance metrics
```

**Supabase Dashboard:**
```
supabase.com → Dashboard → The Whale
Shows:
  • Database size
  • API calls
  • Storage used
```

---

## **Optional: Free Alternatives to OpenAI**

If you want AI features without OpenAI cost, options include:

### **Google Gemini API** (Free Tier)
- 60 requests/minute
- Free tier includes 2 months of $300 credits
- Switch by changing API endpoint in `lib/ai.ts`

### **Hugging Face** (Free Tier)
- Open-source models
- Community-supported
- No API calls required (runs locally in browser)

### **Anthropic Claude** (Minimal Cost)
- $0.003 per input, $0.015 per output (very cheap)
- Much cheaper than OpenAI

---

## **Emergency Shutdown / Cost Control**

If you see unexpected charges:

### **Immediate Actions**
```bash
# Disable OpenAI API
# Vercel Dashboard → Environment Variables → Delete OPENAI_API_KEY

# Pause deployments
# Vercel Dashboard → Settings → Pause Production

# Pause database (Supabase)
# Supabase Dashboard → Settings → Pause Project
```

### **Cost Alerts**
- Vercel: Settings → Notifications → Add billing alert
- Supabase: Account → Billing → Enable spend cap

---

## **Long-term Strategy**

### **Year 1: Free**
- Deploy for free
- Test with teachers
- Build usage patterns
- Cost: $0/month

### **Year 2: Scale (If Needed)**
- Upgrade Vercel ($20/month) if >1000 daily users
- Upgrade Supabase ($25/month) if >2000 items in database
- Add OpenAI budget ($100/month) for heavy AI use
- Cost: ~$50-150/month

### **Year 3+: Full-Featured**
- Add backup systems
- Dedicated analytics
- Premium support
- Cost: $200-500/month (optional)

---

## **Total Cost Ownership**

```
✅ Hosting:        $0 (free tier)
✅ Database:       $0 (free tier)
✅ SSL/Domain:     $0 (Vercel included)
✅ Auth:           $0 (Supabase included)
✅ Deployments:    $0 (automatic)
✅ CDN:            $0 (Vercel included)
✅ Monitoring:     $0 (Vercel included)
❓ AI (Optional):  $0-100/month

TOTAL:             $0/month base + optional AI
```

---

## **FAQ**

**Q: Can we use this for production?**
A: Yes! Free tier is production-ready for schools up to 1000 users.

**Q: What happens if we hit the free limit?**
A: Service doesn't break. You pay overage costs (capped at your settings).

**Q: Can we switch AI providers later?**
A: Yes. Code is designed to swap providers. See `lib/ai.ts`.

**Q: Do we need credit card for free tier?**
A: Yes, but won't be charged. It's for verification.

**Q: Can we run this on-premise instead?**
A: Yes! Next.js can run on any server. See `next start` in `package.json`.

**Q: Is teacher data private?**
A: Yes. Supabase uses encryption. See security settings in dashboard.

**Q: What if Vercel/Supabase change pricing?**
A: You own the code. Can move to any host (AWS, Railway, etc.) anytime.

---

## **Summary**

✅ **Base App:** $0/month forever  
✅ **Scales to 1000+ users:** $0/month  
✅ **With AI:** $0-100/month (optional, pay-as-you-go)  
✅ **No vendor lock-in:** Open source, can self-host  
✅ **Fully functional:** All core features included  

---

**Questions?** See `DEPLOYMENT.md` or `README.md`
