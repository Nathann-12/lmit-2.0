import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { labApi } from '../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    labApi.getNews()
      .then(data => setNews(data))
      .catch(err => console.error('Failed to fetch news:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="news" className="py-20 bg-gray-50" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="news-heading">
            News & Announcements
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Stay updated with the latest developments, publications, and achievements
            from our laboratory.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <Card 
                key={item.id} 
                data-testid={`news-card-${item.id}`}
                className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Calendar size={14} />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
