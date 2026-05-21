import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import { labApi } from '../services/api';

const ResearchFocus = () => {
  const [researchFocus, setResearchFocus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    labApi.getResearchFocus()
      .then(data => setResearchFocus(data))
      .catch(err => console.error('Failed to fetch research focus:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="research" className="py-20 bg-white" data-testid="research-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="research-heading">
            Research Focus
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our laboratory pursues cutting-edge research across multiple disciplines,
            bridging fundamental science with practical applications.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchFocus.map((focus) => (
              <Card 
                key={focus.id} 
                data-testid={`research-card-${focus.id}`}
                className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={focus.image}
                    alt={focus.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {focus.title}
                  </h3>
                </div>

                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {focus.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {focus.keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors duration-200"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResearchFocus;
