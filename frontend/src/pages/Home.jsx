import React from 'react';
import Hero from '../components/Hero';
import VideoPlayer from '../components/VideoPlayer';
import TextToSign from './TextToSign';
// Import additional components here as needed in the future
// e.g., import Features from '../components/Features';
// e.g., import CallToAction from '../components/CallToAction';

function Home() {
  return (
    <div className="w-full h-full">
      <Hero />
      {/* Add more components here as needed */}
      {/* e.g., <Features /> */}
      {/* e.g., <CallToAction /> */}
    </div>
  );
}

export default Home;
