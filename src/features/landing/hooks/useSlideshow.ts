'use client';

import { useState, useEffect } from 'react';
import type { HeroSlide } from '../types';

export const useSlideshow = (slides: HeroSlide[], interval: number = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPaused, slides.length, interval]);

  const togglePause = () => setIsPaused(!isPaused);
  const goToSlide = (index: number) => setCurrentSlide(index);

  return {
    currentSlide,
    isPaused,
    togglePause,
    goToSlide
  };
};