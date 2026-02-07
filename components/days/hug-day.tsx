'use client'

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HugDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface HugDayProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function HugDay({ onComplete, onBack }: HugDayProps) {
    const [isHugging, setIsHugging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [saving, setSaving] = useState(false);
    const startTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const HUG_DURATION = 4000; // 4 seconds

    const handleHugStart = () => {
        setIsHugging(true);
        setProgress(0);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / HUG_DURATION) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                handleHugComplete();
            }
        }, 50);
    };

    const handleHugEnd = () => {
        setIsHugging(false);
        setProgress(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleHugComplete = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsHugging(false);
        setCompleted(true);
    };

    const longPressHandlers = {
        onMouseDown: handleHugStart,
        onMouseUp: handleHugEnd,
        onMouseLeave: handleHugEnd,
        onTouchStart: handleHugStart,
        onTouchEnd: handleHugEnd,
    };

    async function handleSave() {
        setSaving(true);
        const userId = getUserId();

        const result: HugDayResult = {
            durationSeconds: HUG_DURATION / 1000,
            completed: true,
        };

        await saveDayProgress(userId, 'hug-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="absolute top-4 left-4"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back
                    </Button>

                    <div className="text-pink-500 mb-4 flex justify-center">
                        <Users size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Hug Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        {completed ? 'Hug received!' : 'Hold to send a warm virtual hug'}
                    </p>
                </motion.div>

                {!completed ? (
                    <div className="flex flex-col items-center justify-center">
                        {/* Hug Button */}
                        <motion.div
                            {...longPressHandlers}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={isHugging ? { scale: [1, 1.1, 1] } : {}}
                            transition={isHugging ? { repeat: Infinity, duration: 0.8 } : {}}
                            className="relative cursor-pointer select-none"
                        >
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                {/* Progress Circle */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeOpacity="0.3"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                                        strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Center Content */}
                                <div className="text-center z-10">
                                    <div className="text-white mb-2 flex justify-center">
                                        <Users size={72} />
                                    </div>
                                    <p className="text-white font-bold text-lg">
                                        {isHugging ? 'Hugging...' : 'Hold Me'}
                                    </p>
                                    {isHugging && (
                                        <p className="text-white text-sm mt-2">
                                            {Math.round(progress)}%
                                        </p>
                                    )}
                                </div>

                                {/* Ripple Effect */}
                                {isHugging && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 rounded-full bg-white"
                                    />
                                )}
                            </div>
                        </motion.div>

                        <p className="mt-8 text-gray-600 font-lora text-center max-w-md">
                            Press and hold the button for {HUG_DURATION / 1000} seconds to send a warm, loving hug
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        {/* Success Animation */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-pink-500 mb-8 flex justify-center"
                        >
                            <Users size={128} />
                        </motion.div>

                        <h2 className="font-playfair text-4xl font-bold text-gray-800 mb-4">
                            Hug Delivered!
                        </h2>
                        <p className="font-lora text-xl text-gray-600 mb-8">
                            You held on for the full {HUG_DURATION / 1000} seconds. That's a real hug!
                        </p>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                        >
                            {saving ? 'Saving...' : 'Continue'}
                            <Heart className="ml-2" size={20} fill="currentColor" />
                        </Button>

                        {/* Floating Hearts */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                                    animate={{
                                        y: '-20vh',
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'linear',
                                    }}
                                    className="absolute text-pink-400"
                                >
                                    <Heart size={24 + Math.random() * 24} fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
