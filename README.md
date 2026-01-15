This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Real data (YouTube / charts)

This template can show real YouTube view/like counts via a server-side API route.

1) Create `.env.local` from `.env.example`

2) Fill these values:
- `YOUTUBE_API_KEY`: YouTube Data API v3 key
- `YOUTUBE_VIDEO_ID`: the video id to track

3) Run the dev server:
- `npm run dev`

Optional:
- `CHARTS_JSON_URL`: override chart status data with your own JSON endpoint

### Using korea-music-chart-api (auto ranks)

If you run a compatible chart API server (e.g. the Java/Spring project `max-jang/korea-music-chart-api`), this app can convert it into the `ChartsData` JSON shape via:

- `GET /api/charts`

To enable:

1) Host the chart API server yourself and set:
- `KOREA_MUSIC_CHART_API_BASE_URL` (example: `https://your-chart-api.example.com`)

2) Point this app’s chart source to its own converter route:
- `CHARTS_JSON_URL=http://localhost:3000/api/charts` (dev)
- `CHARTS_JSON_URL=https://your-site.example.com/api/charts` (prod)

Optional query overrides:
- `/api/charts?artist=EXO&track=I'm%20Home`

Notes:
- The referenced repo is archived and may not be maintained.
- Make sure you have permission to deploy/use any upstream scraping service and that it complies with the target sites’ terms.

### Hourly refresh + local file cache (dev)

When `CHARTS_JSON_URL` points to this app’s `/api/charts`, the route maintains a local cache file so ranks can be compared across restarts (needed for providers that don’t include rank change info).

- Cache file path (default): `.cache/charts-cache.json`
- Override path: `CHARTS_CACHE_FILE=...`
- Background refresh: by default enabled in development
	- Set `CHARTS_BACKGROUND_REFRESH=0` to disable

Refresh policy:
- `/api/charts` refreshes the cache once per hour (on the top of the hour)
- You can force a refresh anytime: `/api/charts?force=1`

### Charts “real-time” integration (how it works)

This project does **not** directly call Melon/Genie/Bugs/etc. from the browser.
Instead, the home page reads chart status from a JSON source:

- Default: local file at src/data/charts.json
- Override: set `CHARTS_JSON_URL` to a URL that returns the same JSON shape

The app fetches `CHARTS_JSON_URL` on the server with caching (revalidate ~60s). If the URL fails or returns invalid JSON, it falls back to the local file.

#### JSON schema

Your JSON endpoint must return:

```json
{
	"lastUpdated": "2026-01-15T00:00:00.000Z",
	"items": [
		{ "label": "지니", "status": "TOP100 12위" },
		{ "label": "멜론 TOP100", "rank": 12, "prevRank": 15 },
		{ "label": "벅스", "status": "진입 성공" }
	]
}
```

Notes:
- `lastUpdated` must be an ISO string.
- `items[].label` is required.
- `items[].status` is optional (free-form).
- `items[].rank` and `items[].prevRank` are optional numbers.
	- If `rank`/`prevRank` are present, the UI can auto-derive status like “상승/하락/유지/진입”.

#### Recommended ways to keep it updated

Because many chart services don’t provide a public official API, a practical and safe approach is:
- Manual updates: edit src/data/charts.json and redeploy
- External status feed: publish a JSON (e.g. Google Sheets via Apps Script, or a small admin tool) and set `CHARTS_JSON_URL`

If you have an official/contracted data source (or an aggregator API you’re allowed to use), you can generate the JSON from that source and host it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
