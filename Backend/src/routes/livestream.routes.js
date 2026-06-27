const express = require("express");
const https = require("https");

const router = express.Router();

// ── Simple in-memory cache (60 s TTL) to protect YouTube quota ───────────────
let _cache = null;
let _cacheAt = 0;
const CACHE_TTL = 60_000;

function ytGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error("YouTube API returned invalid JSON"));
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchLivestreamData() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId || apiKey.startsWith("your_") || channelId.startsWith("your_")) {
    return null;
  }

  const base = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&key=${apiKey}`;

  // 1. Check for an active live stream first
  const liveRes = await ytGet(`${base}&type=video&eventType=live`);
  if (liveRes.items && liveRes.items.length > 0) {
    const item = liveRes.items[0];
    return {
      isLive: true,
      isUpcoming: false,
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishTime || item.snippet.publishedAt,
    };
  }

  // 2. Check for an upcoming live stream
  const upcomingRes = await ytGet(`${base}&type=video&eventType=upcoming`);
  if (upcomingRes.items && upcomingRes.items.length > 0) {
    const item = upcomingRes.items[0];
    return {
      isLive: false,
      isUpcoming: true,
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishTime || item.snippet.publishedAt,
    };
  }

  // 3. Fallback: most recent upload
  const latestRes = await ytGet(`${base}&type=video&order=date`);
  if (latestRes.items && latestRes.items.length > 0) {
    const item = latestRes.items[0];
    return {
      isLive: false,
      isUpcoming: false,
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishTime || item.snippet.publishedAt,
    };
  }

  return null;
}

// GET /api/livestream — public
router.get("/", async (req, res) => {
  // Serve from cache if fresh
  if (_cache && Date.now() - _cacheAt < CACHE_TTL) {
    return res.json(_cache);
  }

  try {
    const data = await fetchLivestreamData();

    if (!data) {
      // YouTube not configured yet or no videos found
      return res.json({ configured: false });
    }

    _cache = { configured: true, ...data };
    _cacheAt = Date.now();
    return res.json(_cache);
  } catch (err) {
    console.error("[livestream] YouTube API error:", err.message);
    // Return stale cache if available rather than a hard error
    if (_cache) return res.json(_cache);
    return res.status(502).json({ error: "Failed to reach YouTube API." });
  }
});

module.exports = router;
