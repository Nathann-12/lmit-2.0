export function extractYoutubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '').split('/')[0];
      return id || null;
    }
    const v = u.searchParams.get('v');
    if (v) return v;
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    const shortsMatch = u.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];
  } catch {
    const loose = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    if (loose) return loose[1];
  }
  return null;
}

export function getYoutubeEmbedUrl(url) {
  const id = extractYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
