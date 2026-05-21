import React, { useState, useEffect } from 'react';
import { Loader2, Play } from 'lucide-react';
import { labApi } from '../services/api';
import { getYoutubeEmbedUrl } from '../lib/youtube';

const VideoPreview = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    labApi
      .getYoutubeVideos()
      .then(setVideos)
      .catch((err) => console.error('Failed to fetch videos:', err))
      .finally(() => setLoading(false));
  }, []);

  const playable = videos
    .map((v) => ({ ...v, embedUrl: getYoutubeEmbedUrl(v.youtube_url) }))
    .filter((v) => v.embedUrl);

  if (!loading && playable.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-20 bg-slate-50" data-testid="videos-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="videos-heading">
            Research Videos
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Watch highlights from our lab, conferences, and outreach activities.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {playable.map((video) => (
              <article
                key={video.id}
                data-testid={`video-card-${video.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="relative aspect-video bg-slate-900">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Play className="w-4 h-4 text-teal-600 shrink-0" />
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{video.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoPreview;
