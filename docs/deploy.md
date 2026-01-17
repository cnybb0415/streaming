# Deploy (Vercel + Render)

This project has two parts:
- Next.js app (frontend + `/api/*` routes) → deploy to Vercel
- Spring Boot chart backend (`korea-music-chart-api`) → deploy to Render

## 1) Deploy backend (Render)

1. Go to Render → **New** → **Blueprint**
2. Choose this GitHub repo and let Render read `render.yaml`
3. Create the service
4. After deploy finishes, copy the public URL:
   - Example: `https://korea-music-chart-api.onrender.com`

If you created a service manually (not Blueprint), make sure these settings match:

- **Environment**: Java
- **Root Directory**: `korea-music-chart-api`
- **Build Command**: `chmod +x mvnw && ./mvnw -DskipTests clean package`
- **Start Command**: `java -jar target/music-chart-api-0.1.jar`
- **Environment Variables**: `JAVA_VERSION=11`

Troubleshooting:

- If logs show **Node.js** being used and `JAVA_HOME` errors, the service is running in the wrong runtime.
  Switch the service Environment to **Java** (or recreate it via **Blueprint** so `render.yaml` is applied).

Quick checks:
- Open `https://<RENDER_URL>/` (should respond)
- Or hit a known endpoint like `https://<RENDER_URL>/melon/chart/EXO`

## 2) Deploy frontend (Vercel)

1. Import the GitHub repo in Vercel
2. Add these Environment Variables (Settings → Environment Variables):

- `YOUTUBE_API_KEY` = your YouTube Data API key
- `KOREA_MUSIC_CHART_API_BASE_URL` = `https://<RENDER_URL>` (from step 1)

Optional:
- `YOUTUBE_VIDEO_ID` = default video id

3. Redeploy (Deployments → Redeploy)

## 3) Point custom domain (Cafe24 DNS → Vercel)

Set DNS records:
- Root domain `exo-strm.com`
  - Type: `A`
  - Host: `@`
  - Value: `76.76.21.21`

- `www.exo-strm.com`
  - Type: `CNAME`
  - Host: `www`
  - Value: `cname.vercel-dns.com`

Then go to Vercel → Project → Settings → Domains and verify.
