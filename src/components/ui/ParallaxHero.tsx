import React, { useEffect, useState } from 'react';

interface ParallaxHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  overlay?: boolean;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  overlay = true
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div
          className="absolute w-20 h-20 bg-white/10 rounded-full blur-sm"
          style={{
            top: '20%',
            left: '10%',
            transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.1}deg)`
          }}
        />
        <div
          className="absolute w-16 h-16 bg-blue-500/20 rounded-full blur-sm"
          style={{
            top: '60%',
            right: '15%',
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.15}deg)`
          }}
        />
        <div
          className="absolute w-12 h-12 bg-purple-500/20 rounded-full blur-sm"
          style={{
            top: '30%',
            right: '30%',
            transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.2}deg)`
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div
            className="transform transition-all duration-700 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`
            }}
          >
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
              style={{
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              {title}
            </h1>
            <p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {subtitle}
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}
              >
                Get Started
              </button>
              <button
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div
              className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"
              style={{
                animation: 'bounce 2s infinite'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxHero;
