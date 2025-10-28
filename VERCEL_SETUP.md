# Vercel Environment Variables Setup

## Required Environment Variables

To make the application work on Vercel production, you need to configure the following environment variables:

### 1. Click Analytics API

**Variable Name**: `NEXT_PUBLIC_SOLUTIONS_API_URL`

**Value (Production)**:
```
https://solutions-backend-f900a16e5ff6.herokuapp.com
```

**Value (Local Development)**:
```
http://localhost:8002
```

**Used by**:
- `hooks/useClickAnalytics.ts` - tracks user clicks
- `app/solutions/page.tsx` - solutions overview page

---

### 2. OpenAbroad API (Optional - uses mock data if not set)

**Variable Name**: `NEXT_PUBLIC_OPENABROAD_API_URL`

**Status**: ⚠️ **Optional** - OpenAbroad automatically uses mock data when this variable is not set

**Value (Production)** - if you deploy OpenAbroad separately:
```
https://openabroad-backend.herokuapp.com
```
*Note: OpenAbroad service is not yet deployed. Page works in mock mode without this variable.*

**Value (Local Development)**:
```
http://localhost:8001
```

**Used by**:
- `app/solutions/openAbroad/page.tsx` - business relocation page

**Mock Mode**:
- Automatically enabled when `NEXT_PUBLIC_OPENABROAD_API_URL` is not set
- Provides test data for UI/UX demonstration
- Shows banner: "🎭 Режим тестирования (mock data)"
- To use real API: deploy OpenAbroad service and set this variable

---

## How to Configure on Vercel

### Option 1: Via Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `upgrowplan-frontend`
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SOLUTIONS_API_URL`)
   - **Value**: Production URL (e.g., `https://solutions-backend-f900a16e5ff6.herokuapp.com`)
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
5. Click **Save**
6. **Important**: Redeploy your application after adding variables

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SOLUTIONS_API_URL production
# Enter: https://solutions-backend-f900a16e5ff6.herokuapp.com

vercel env add NEXT_PUBLIC_OPENABROAD_API_URL production
# Enter: https://openabroad-backend.herokuapp.com
```

---

## Verifying Configuration

After adding environment variables and redeploying:

### 1. Check Build Logs

In Vercel dashboard → Deployments → Latest deployment → Build logs

Look for:
```
Environment Variables:
✓ NEXT_PUBLIC_SOLUTIONS_API_URL
✓ NEXT_PUBLIC_OPENABROAD_API_URL
```

### 2. Test in Browser

1. Visit: https://www.upgrowplan.com/solutions
2. Open browser DevTools (F12) → Console
3. Click on any solution card
4. You should see API calls to Heroku URLs, NOT localhost

### 3. Check API Calls

In Network tab, verify:
- Click Analytics: `https://solutions-backend-f900a16e5ff6.herokuapp.com/api/track-click`
- OpenAbroad: `https://openabroad-backend.herokuapp.com/api/validate-business-type`

Should **NOT** see:
- `localhost:8002` ❌
- `localhost:8001` ❌

---

## Troubleshooting

### Problem: Still seeing localhost URLs in production

**Solution**:
1. Verify environment variables are added to "Production" environment in Vercel
2. Trigger a new deployment (push a commit or redeploy from Vercel dashboard)
3. Clear browser cache and hard reload (Ctrl+Shift+R)

### Problem: ERR_CONNECTION_REFUSED

**Causes**:
- Environment variables not set in Vercel
- Heroku backend services are down
- CORS not configured on backend

**Solution**:
1. Check Heroku backend is running: `curl https://solutions-backend-f900a16e5ff6.herokuapp.com/health`
2. Verify environment variables in Vercel
3. Check browser console for CORS errors

### Problem: Environment variables not applying

**Solution**:
After adding/changing environment variables, you MUST:
1. Redeploy the application
2. Variables are only applied during build time, not runtime

---

## Current Backend Deployments

### Click Analytics (Deployed)
- **URL**: https://solutions-backend-f900a16e5ff6.herokuapp.com
- **Status**: ✅ Deployed on Heroku
- **Endpoints**:
  - `POST /api/track-click` - Track clicks
  - `GET /api/analytics` - Get analytics
  - `GET /health` - Health check

### OpenAbroad (Not Yet Deployed)
- **Status**: ⚠️ Needs separate Heroku deployment
- **Local**: http://localhost:8001
- **Action Required**: Deploy OpenAbroad service to Heroku or another platform

---

## Next Steps

### Required (for Click Analytics to work):
1. ✅ Add `NEXT_PUBLIC_SOLUTIONS_API_URL` to Vercel
2. ✅ Redeploy frontend on Vercel
3. ✅ Test Click Analytics on production

### Optional (for OpenAbroad real API):
4. ⚠️ Deploy OpenAbroad service to Heroku (separate app) - *currently uses mock data*
5. ⚠️ Add `NEXT_PUBLIC_OPENABROAD_API_URL` to Vercel after deployment

**Current Status**:
- ✅ Click Analytics: Ready for production
- ⚠️ OpenAbroad: Works in mock mode (no backend needed yet)

---

## Local Development

For local development, create `.env.local`:

```bash
# .env.local (not committed to git)
NEXT_PUBLIC_SOLUTIONS_API_URL=http://localhost:8002
NEXT_PUBLIC_OPENABROAD_API_URL=http://localhost:8001
```

Then start both backend services:
```bash
cd ../solutions-backend
python start_services.py
```

And frontend:
```bash
npm run dev
```

---

## Documentation Links

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Solutions Backend Repo](https://github.com/Upgrowplan-project/solutions-backend)
