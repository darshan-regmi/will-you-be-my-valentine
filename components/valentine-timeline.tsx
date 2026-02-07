'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import DayCard from './day-card';
import { VALENTINE_WEEK_DAYS } from '@/lib/valentine-config';
import { getDayStatus } from '@/lib/timezone-utils';
import { getUserId } from '@/lib/user-id';
import { getAllProgress, getCompletionStatus } from '@/lib/firestore-service';
import { ValentineDay, DayProgress } from '@/lib/types';

interface ValentineTimelineProps {
    onDaySelect: (dayId: ValentineDay) => void;
}

export default function ValentineTimeline({ onDaySelect }: ValentineTimelineProps) {
    const [progress, setProgress] = useState<Record<ValentineDay, DayProgress | null>>({} as any);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, []);

    async function loadProgress() {
        const userId = getUserId();
        const userProgress = await getAllProgress(userId);
        const completion = await getCompletionStatus(userId);

        setProgress(userProgress);
        setCompletionPercentage(completion.percentage);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-pink-500"
                >
                    <Heart size={64} fill="currentColor" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
                        <Heart className="text-pink-500" size={48} fill="currentColor" />
                        Valentine's Week
                        <Heart className="text-pink-500" size={48} fill="currentColor" />
                    </h1>
                    <p className="font-lora text-xl text-gray-600 mb-8">
                        A week of love, one day at a time
                    </p>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                            <span className="text-sm font-semibold text-pink-500">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VALENTINE_WEEK_DAYS.map((day, index) => {
                        const isCompleted = progress[day.id]?.completed || false;
                        const status = getDayStatus(day.id, isCompleted);

                        return (
                            <DayCard
                                key={day.id}
                                day={day}
                                status={status}
                                index={index}
                                onClick={() => {
                                    if (status !== 'locked') {
                                        onDaySelect(day.id);
                                    }
                                }}
                            />
                        );
                    })}
                </div>

                {/* Completion Message */}
                {completionPercentage === 100 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-12 text-center"
                    >
                        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-8 border-2 border-pink-300">
                            <Sparkles className="text-pink-500 mx-auto mb-4" size={48} />
                            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
                                You've Completed Valentine's Week! 🎉
                            </h2>
                            <p className="font-lora text-gray-600">
                                Check out your complete love story on Valentine's Day
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center text-gray-500 text-sm"
                >
                    <p>Made by <b>Your Love</b> for <b>You Meri Mayaaaaaaa</b> <br />♡♡♡♡♡♡</p>
                </motion.div>
            </div>
        </div>
    );
}
