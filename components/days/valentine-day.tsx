'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Download, Flower2, Gem, Gift, Smile, HeartHandshake, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/user-id';
import { getAllProgress, areAllDaysCompleted } from '@/lib/firestore-service';
import { ValentineDayResult, DayProgress } from '@/lib/types';
import Confetti from '@/components/confetti';

interface ValentineDayProps {
    onBack: () => void;
}

export default function ValentineDay({ onBack }: ValentineDayProps) {
    const [progress, setProgress] = useState<Record<string, DayProgress | null>>({});
    const [allCompleted, setAllCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, []);

    async function loadProgress() {
        const userId = getUserId();
        const userProgress = await getAllProgress(userId);
        const completed = await areAllDaysCompleted(userId);

        setProgress(userProgress);
        setAllCompleted(completed);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-100 to-rose-50">
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

    const roseDay = progress['rose-day'];
    const proposeDay = progress['propose-day'];
    const chocolateDay = progress['chocolate-day'];
    const teddyDay = progress['teddy-day'];
    const promiseDay = progress['promise-day'];
    const hugDay = progress['hug-day'];
    const kissDay = progress['kiss-day'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-rose-50 py-12 px-4">
            {allCompleted && <Confetti />}

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

                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-red-500 mb-4 flex justify-center"
                    >
                        <Heart size={128} fill="currentColor" />
                    </motion.div>
                    <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gray-800 mb-4">
                        Valentine's Day
                    </h1>
                    <p className="font-lora text-2xl text-gray-600">
                        Your Complete Love Story
                    </p>
                </motion.div>

                {/* Love Story Summary */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-pink-300 mb-8"
                >
                    <h2 className="font-playfair text-3xl font-bold text-center text-gray-800 mb-8">
                        Our Valentine's Week Journey
                    </h2>

                    <div className="space-y-6">
                        {/* Rose Day */}
                        {roseDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-rose-50 rounded-xl p-6 border-2 border-rose-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Flower2 size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Rose Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            You chose a <strong>{(roseDay.result as any).color}</strong> rose, symbolizing{' '}
                                            {(roseDay.result as any).message?.split('.')[0].toLowerCase()}.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Propose Day */}
                        {proposeDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Gem size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Propose Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            {(proposeDay.result as any).outcome}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Chocolate Day */}
                        {chocolateDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Gift size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Chocolate Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            You matched all the chocolates in just <strong>{(chocolateDay.result as any).moves}</strong> moves! Sweet success!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Teddy Day */}
                        {teddyDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Smile size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Teddy Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            You created a <strong>{(teddyDay.result as any).color}</strong> teddy bear with a{' '}
                                            <strong>{(teddyDay.result as any).mood}</strong> expression and a{' '}
                                            <strong>{(teddyDay.result as any).accessory}</strong> accessory. Adorable!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Promise Day */}
                        {promiseDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <HeartHandshake size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Promise Day
                                        </h3>
                                        <p className="font-lora text-gray-700 italic">
                                            "{(promiseDay.result as any).promise}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Hug Day */}
                        {hugDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Users size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Hug Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            You sent a warm {(hugDay.result as any).durationSeconds}-second hug. So comforting!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Kiss Day */}
                        {kissDay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-red-50 rounded-xl p-6 border-2 border-red-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-pink-500">
                                        <Sparkles size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                                            Kiss Day
                                        </h3>
                                        <p className="font-lora text-gray-700">
                                            You sent <strong>{(kissDay.result as any).kissCount}</strong> sweet kisses. {(kissDay.result as any).message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Final Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mt-12 text-center"
                    >
                        <div className="bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-8 border-2 border-pink-300">
                            <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                                {allCompleted ? 'Complete Love Story!' : 'Your Journey Continues...'}
                            </h3>
                            <p className="font-lora text-xl text-gray-700 leading-relaxed">
                                {allCompleted
                                    ? "You've completed every day of Valentine's Week! This journey shows the depth of your love and commitment. Every rose, every promise, every hug - they all tell the beautiful story of us. Happy Valentine's Day!"
                                    : "Your Valentine's Week story is unfolding beautifully. Complete all the days to see your full love story!"}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Sparkles Animation */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh` }}
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                            className="absolute text-pink-400"
                        >
                            <Sparkles size={24} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
