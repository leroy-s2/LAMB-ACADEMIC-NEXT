'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ExploreSection from '../components/ExploreSection';
import CampusSection from '../components/CampusSection';
import FooterCTA from '../components/FooterCTA';
import { useSlideshow } from '../hooks';
import type { HeroSlide } from '../types';

const LandingPage: React.FC = () => {
	const router = useRouter();

	const heroSlides: HeroSlide[] = [
		{
			title: "DEL MUNDO",
			subtitle: "Se parte de este cambio",
			description: "Líderes con principios UPEU",
			bgGradient: "from-blue-900/80 to-cyan-500/60"
		},
		{
			title: "SOSTENIBLE",
			subtitle: "Educación de calidad",
			description: "Formando profesionales íntegros",
			bgGradient: "from-emerald-900/80 to-teal-500/60"
		},
		{
			title: "INNOVACIÓN",
			subtitle: "Tecnología educativa",
			description: "Campus digital moderno",
			bgGradient: "from-indigo-900/80 to-blue-500/60"
		}
	];

	const { currentSlide, isPaused, togglePause, goToSlide } = useSlideshow(heroSlides);

	const handleLoginClick = () => {
		router.push('/log');
	};

	return (
		<div className="min-h-screen">
			<Header />
			<HeroSection
				slides={heroSlides}
				currentSlide={currentSlide}
				isPaused={isPaused}
				onTogglePause={togglePause}
				onSlideChange={goToSlide}
				onLoginClick={handleLoginClick}
			/>
			<ExploreSection />
			<CampusSection />
			<FooterCTA />
		</div>
	);
};

export default LandingPage;

