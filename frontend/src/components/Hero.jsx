import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative h-[70vh] bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-800 dark:to-indigo-800 text-white py-16 md:py-24 overflow-hidden">
      {/* Background Elements for Visual Interest */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-gray-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white dark:bg-gray-200 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight animate-fade-in-up">
              Transform Text into Sign Language with Ease
            </h1>
            <p className="text-lg md:text-xl text-violet-100 dark:text-violet-200 mb-8 leading-relaxed animate-fade-in-up delay-100">
              Break communication barriers with our innovative tool that converts text to sign language visuals, making accessibility effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-200">
              <Link
                to="/texttosign"
                className="px-6 py-3 bg-white dark:bg-gray-100 text-violet-700 dark:text-violet-800 font-semibold rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-200 hover:scale-102 transition-all duration-300 focus:ring-2 focus:ring-violet-400/50"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-transparent border-2 border-white dark:border-violet-200 text-white dark:text-violet-200 font-semibold rounded-xl hover:bg-white/10 dark:hover:bg-violet-200/10 hover:scale-102 transition-all duration-300 focus:ring-2 focus:ring-violet-400/50"
              >
                Learn More
              </Link>
            </div>
          </div>
          {/* Visual Element / Image Placeholder */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80 bg-violet-500 dark:bg-violet-700 rounded-2xl shadow-xl overflow-hidden animate-fade-in-right">
              <img
                src="/assets/placeholder-sign.png" // Replace with actual sign language visual or illustration
                alt="Sign Language Illustration"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-800/70 to-transparent"></div>
              <p className="absolute bottom-4 left-4 text-violet-100 dark:text-violet-200 font-medium text-lg">
                Visualizing Communication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
