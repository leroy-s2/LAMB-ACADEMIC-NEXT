'use client';

import React from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/shared/components';
import type { HeroSlide } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  currentSlide: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onSlideChange: (index: number) => void;
  onLoginClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  currentSlide,
  isPaused,
  onTogglePause,
  onSlideChange,
  onLoginClick
}) => {
  return (
    <section className="relative h-[600px] mt-16 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: 0,
          }}
          src="https://res.cloudinary.com/df6m46xxz/video/upload/v1759633727/Grabaci%C3%B3n_2025-10-01_181312_gwllwh.mp4"
        />
        <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className={`text-7xl md:text-8xl font-bold text-white mb-4 transition-all duration-1000 bg-gradient-to-r ${slides[currentSlide].bgGradient} bg-clip-text text-transparent`}>
            {slides[currentSlide].title}
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-2 animate-fade-in">
            {slides[currentSlide].subtitle}
          </p>
          <p className="text-xl md:text-2xl text-cyan-300 mb-8 animate-fade-in">
            {slides[currentSlide].description}
          </p>
          <Button onClick={onLoginClick} size="lg">
            Iniciar sesión
          </Button>
        </div>
      </div>

      {/* Pause/Play Button */}
      <button
        onClick={onTogglePause}
        className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all"
      >
        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;