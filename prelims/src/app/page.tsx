"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Users, Shield, Sparkles, ArrowRight, Star, Zap, Crown } from 'lucide-react';

export default function ModernLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [completionMessage, setCompletionMessage] = useState<string>('');
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3
    }));
    setParticles(generatedParticles);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check for completion message from logout
  useEffect(() => {
    const message = sessionStorage.getItem('completionMessage');
    if (message) {
      setCompletionMessage(message);
      setShowCompletion(true);
      // Clear the message from sessionStorage
      sessionStorage.removeItem('completionMessage');
      
      // Hide the message after 10 seconds
      const timer = setTimeout(() => {
        setShowCompletion(false);
        setCompletionMessage('');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Completion Message Overlay */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl border border-green-500/50 rounded-2xl p-8 max-w-2xl w-full text-center shadow-2xl animate-pulse">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowCompletion(false);
                setCompletionMessage('');
              }}
              className="absolute top-4 right-4 p-2 text-green-300 hover:text-white hover:bg-green-800/50 rounded-full transition-colors duration-200"
              aria-label="Close message"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🎉 Congratulations!
              </h2>
            </div>
            
            <div className="bg-black/30 rounded-lg p-6 mb-6">
              <p className="text-green-200 text-lg md:text-xl leading-relaxed whitespace-pre-wrap break-words">
                {completionMessage}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-green-300 text-sm">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              This message will disappear in 10 seconds...
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '60%',
            right: '10%',
            animationDelay: '2s',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-pink-600/25 to-red-600/25 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            left: '30%',
            animationDelay: '4s',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(160, 32, 240, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(160, 32, 240, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating Particles - Only render after hydration */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12 md:px-10 md:py-16">
        <div className={`w-full max-w-md md:max-w-lg lg:max-w-xl transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Logo Section */}
          <div className="text-center mb-10 md:mb-12">
            <div className="relative inline-block mb-6 md:mb-7">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-2xl">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-5 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              PetManager
            </h1>
            
            <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed px-2">
              The ultimate platform for modern pet care
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              {[
                { icon: Heart, text: "Smart Care" },
                { icon: Shield, text: "Secure" },
                { icon: Zap, text: "Fast Setup" }
              ].map(({ icon: Icon, text }, index) => (
                <div 
                  key={text}
                  className={`flex items-center gap-1.5 px-2.5 py-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full text-xs text-gray-300 transform transition-all duration-500 hover:bg-white/10 hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="w-3 h-3" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Card */}
          <div className="relative mt-4 md:mt-6">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-md opacity-75 animate-pulse" />
            
            <div className="relative bg-black/70 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                  Ready to Start?
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Join thousands of happy pet owners
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Link href="/login" className="group w-full inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 md:py-4 px-4 md:px-6 rounded-lg text-sm md:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Login to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>

                <Link href="/signup" className="group w-full inline-flex items-center justify-center bg-transparent border-2 border-purple-500 text-white font-bold py-3.5 md:py-4 px-4 md:px-6 rounded-lg text-sm md:text-base transition-all duration-300 transform hover:scale-105 hover:bg-purple-500/10 hover:border-purple-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Create Account
                    <Star className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
                {[
                  { number: "10k+", label: "Happy Pets" },
                  { number: "99%", label: "Uptime" },
                  { number: "24/7", label: "Support" }
                ].map(({ number, label }, index) => (
                  <div 
                    key={label} 
                    className={`text-center transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {number}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 md:mt-8">
            <p className="text-xs text-gray-600">
              Trusted by pet lovers worldwide 🐾
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-full p-2">
          <ArrowRight className="w-4 h-4 text-purple-400 rotate-90" />
        </div>
      </div>
    </div>
  );
}