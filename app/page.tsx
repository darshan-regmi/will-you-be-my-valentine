'use client'

import { useState, useEffect } from 'react';
import ValentineTimeline from '@/components/valentine-timeline';
import RoseDay from '@/components/days/rose-day';
import ProposeDay from '@/components/days/propose-day';
import ChocolateDay from '@/components/days/chocolate-day';
import TeddyDay from '@/components/days/teddy-day';
import PromiseDay from '@/components/days/promise-day';
import HugDay from '@/components/days/hug-day';
import KissDay from '@/components/days/kiss-day';
import ValentineDay from '@/components/days/valentine-day';
import { ValentineDay as ValentineDayType } from '@/lib/types';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<ValentineDayType | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleDayComplete = () => {
    // Return to timeline after completing a day
    setSelectedDay(null);
  };

  const handleBackToTimeline = () => {
    setSelectedDay(null);
  };

  // Render selected day component
  if (selectedDay) {
    switch (selectedDay) {
      case 'rose-day':
        return <RoseDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'propose-day':
        return <ProposeDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'chocolate-day':
        return <ChocolateDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'teddy-day':
        return <TeddyDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'promise-day':
        return <PromiseDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'hug-day':
        return <HugDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'kiss-day':
        return <KissDay onComplete={handleDayComplete} onBack={handleBackToTimeline} />;
      case 'valentine-day':
        return <ValentineDay onBack={handleBackToTimeline} />;
      default:
        return <ValentineTimeline onDaySelect={setSelectedDay} />;
    }
  }

  // Render timeline by default
  return <ValentineTimeline onDaySelect={setSelectedDay} />;
}

