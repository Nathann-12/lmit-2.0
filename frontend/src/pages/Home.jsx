import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ResearchFocus from '../components/ResearchFocus';
import Publications from '../components/Publications';
import LabMembers from '../components/LabMembers';
import VideoPreview from '../components/VideoPreview';
import News from '../components/News';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ResearchFocus />
        <Publications />
        <LabMembers />
        <VideoPreview />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;