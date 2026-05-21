import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLabInfo } from '../context/LabInfoContext';

const Hero = () => {
  const { labInfo, loading } = useLabInfo();

  const scrollToResearch = () => {
    const element = document.getElementById('research');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: labInfo?.hero_background_image
            ? `url(${labInfo.hero_background_image})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {loading ? (
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
        ) : labInfo ? (
          <>
            <h1 className="!font-bold !text-5xl mb-6 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight" data-testid="hero-title">
              {labInfo.name}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 font-light" data-testid="hero-tagline">
              {labInfo.tagline}
            </p>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed" data-testid="hero-description">
              {labInfo.description}
            </p>
            
            <button
              onClick={scrollToResearch}
              data-testid="hero-cta-button"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-md text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Our Research
              <ChevronDown className="animate-bounce" size={20} />
            </button>
          </>
        ) : null}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToResearch}
          className="text-white/70 hover:text-white transition-colors duration-200"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
