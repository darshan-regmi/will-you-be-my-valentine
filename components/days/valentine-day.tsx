'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Flower2, Gem, Gift, Smile, HeartHandshake, Users, Mail, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/user-id';
import { getAllProgress, areAllDaysCompleted, saveDayProgress } from '@/lib/firestore-service';
import type { DayProgress, ValentineDay, ValentineDayResult } from '@/lib/types';
import Confetti from '@/components/confetti';

interface ValentineDayProps {
    onBack: () => void;
}

// Floating Hearts Background Component
const FloatingHearts = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        scale: 0,
                        x: Math.random() * 100 + 'vw',
                        y: '100vh',
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0.5],
                        y: '-10vh',
                        x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`,
                        rotate: Math.random() * 360,
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear",
                    }}
                    className="absolute text-pink-300/30"
                >
                    <Heart size={20 + Math.random() * 40} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Typewriter Effect Component
const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset text when prop changes
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;
            if (index === text.length) {
                clearInterval(intervalId);
                onComplete && onComplete();
            }
        }, 50); // Adjust typing speed here (lower is faster)

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <span className="font-handwriting text-lg md:text-xl leading-relaxed">{displayedText}</span>;
};


export default function ValentineDay({ onBack }: ValentineDayProps) {
    const [progress, setProgress] = useState<Record<string, DayProgress | null>>({});
    const [allCompleted, setAllCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [letterOpen, setLetterOpen] = useState(false);
    const [showProposal, setShowProposal] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const [sevenDaysCompleted, setSevenDaysCompleted] = useState(false);

    useEffect(() => {
        loadProgress();
    }, []);

    async function loadProgress() {
        const userId = getUserId();
        const userProgress = await getAllProgress(userId);
        const completed = await areAllDaysCompleted(userId);

        // Check if previous 7 days are completed
        const requiredDays: ValentineDay[] = [
            'rose-day', 'propose-day', 'chocolate-day',
            'teddy-day', 'promise-day', 'hug-day', 'kiss-day'
        ];
        const prevDaysDone = requiredDays.every(day => userProgress[day]?.completed);

        setProgress(userProgress);
        setAllCompleted(completed);
        setSevenDaysCompleted(prevDaysDone);
        setLoading(false);
    }

    async function handleAccept() {
        setAccepted(true);
        const userId = getUserId();

        await saveDayProgress(userId, 'valentine-day', {
            story: "We're officially Valentines! The journey continues forever.",
            allDaysCompleted: true
        } as ValentineDayResult);

        setAllCompleted(true);
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

    const finalMessage = allCompleted
        ? "You've completed every day of Valentine's Week! This journey shows the depth of your love and commitment. Every rose, every promise, every hug - they all tell the beautiful story of us. Happy Valentine's Day!"
        : sevenDaysCompleted
            ? "You've completed every day of Valentine's Week! This journey shows the depth of your love and commitment. Every rose, every promise, every hug - they all tell the beautiful story of us. But there is one last question..."
            : "Your Valentine's Week story is unfolding beautifully. Complete all the days to see your full love story!";

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-rose-50 py-12 px-4 overflow-x-hidden relative">
            <FloatingHearts />
            {accepted && <Confetti />}

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="absolute top-4 left-4 z-20"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back
                    </Button>

                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-red-500 mb-4 flex justify-center drop-shadow-lg"
                    >
                        <Heart size={100} fill="currentColor" />
                    </motion.div>
                    <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gray-800 mb-4 drop-shadow-sm">
                        Valentine's Day
                    </h1>
                    <p className="font-lora text-2xl text-rose-700 italic">
                        Your Complete Love Story
                    </p>
                </motion.div>

                {/* Love Story Summary */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-pink-200 mb-12"
                >
                    <h2 className="font-playfair text-3xl font-bold text-center text-gray-800 mb-8">
                        Our Journey Together
                    </h2>

                    <div className="space-y-6">
                        {/* Summary Items - Rendered conditionally based on progress */}
                        {roseDay && (
                            <div className="flex items-center gap-4 bg-rose-50/80 p-4 rounded-xl border border-rose-100">
                                <Flower2 className="text-pink-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    A <strong>{(roseDay.result as any).color}</strong> rose for {(roseDay.result as any).message?.split('.')[0].toLowerCase()}.
                                </p>
                            </div>
                        )}

                        {proposeDay && (
                            <div className="flex items-center gap-4 bg-pink-50/80 p-4 rounded-xl border border-pink-100">
                                <Gem className="text-pink-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    {(proposeDay.result as any).outcome}
                                </p>
                            </div>
                        )}

                        {chocolateDay && (
                            <div className="flex items-center gap-4 bg-amber-50/80 p-4 rounded-xl border border-amber-100">
                                <Gift className="text-amber-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    Matched all chocolates in <strong>{(chocolateDay.result as any).moves}</strong> moves.
                                </p>
                            </div>
                        )}

                        {teddyDay && (
                            <div className="flex items-center gap-4 bg-purple-50/80 p-4 rounded-xl border border-purple-100">
                                <Smile className="text-purple-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    A cute <strong>{(teddyDay.result as any).color}</strong> teddy with a <strong>{(teddyDay.result as any).mood}</strong> smile.
                                </p>
                            </div>
                        )}

                        {promiseDay && (
                            <div className="flex items-center gap-4 bg-indigo-50/80 p-4 rounded-xl border border-indigo-100">
                                <HeartHandshake className="text-indigo-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base italic">
                                    "{(promiseDay.result as any).promise}"
                                </p>
                            </div>
                        )}

                        {hugDay && (
                            <div className="flex items-center gap-4 bg-yellow-50/80 p-4 rounded-xl border border-yellow-100">
                                <Users className="text-yellow-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    A warm {(hugDay.result as any).durationSeconds}-second hug.
                                </p>
                            </div>
                        )}

                        {kissDay && (
                            <div className="flex items-center gap-4 bg-red-50/80 p-4 rounded-xl border border-red-100">
                                <Sparkles className="text-red-500 shrink-0" size={24} />
                                <p className="font-lora text-gray-700 text-sm md:text-base">
                                    <strong>{(kissDay.result as any).kissCount}</strong> sweet kisses sent.
                                </p>
                            </div>
                        )}

                    </div>
                </motion.div>

                {/* Interactive Envelope / Love Letter */}
                <div className="flex justify-center mb-16">
                    <AnimatePresence mode='wait'>
                        {!letterOpen ? (
                            <motion.button
                                key="envelope"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0, rotateX: -90 }}
                                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                                onClick={() => setLetterOpen(true)}
                                className="relative group cursor-pointer"
                            >
                                <div className="bg-red-100 p-8 rounded-lg shadow-xl border-2 border-red-200 relative overflow-hidden w-64 h-48 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    <Mail size={64} className="text-rose-500" />
                                    <div className="absolute bottom-4 text-rose-600 font-handwriting font-bold">
                                        Tap to Open
                                    </div>
                                    <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 drop-shadow-md group-hover:scale-110 transition-transform" size={32} fill="currentColor" />
                                </div>
                            </motion.button>
                        ) : (
                            <motion.div
                                key="letter"
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="bg-[#fff9f0] p-8 md:p-12 rounded-lg shadow-2xl max-w-2xl w-full border border-[#e6d5c3] relative rotate-1"
                            >
                                {/* Paper Texture Effect */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-20 rounded-lg pointer-events-none"></div>

                                <div className="text-center mb-6">
                                    <MailOpen size={48} className="text-rose-400 mx-auto mb-2" />
                                    <h3 className="font-playfair text-2xl font-bold text-gray-800">My Dearest Valentine</h3>
                                </div>

                                <div className="font-handwriting text-xl text-gray-700 leading-loose mb-8 min-h-[150px]">
                                    {allCompleted || sevenDaysCompleted ? (
                                        <TypewriterText
                                            key={finalMessage}
                                            text={finalMessage}
                                            onComplete={() => {
                                                if (!allCompleted && sevenDaysCompleted) {
                                                    setTimeout(() => setShowProposal(true), 1000);
                                                }
                                            }} />
                                    ) : (
                                        <p>{finalMessage}</p>
                                    )}
                                </div>

                                {showProposal && !accepted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 pt-8 border-t border-rose-100 text-center"
                                    >
                                        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-rose-600 mb-8 drop-shadow-sm">
                                            Will you be my Valentine?
                                        </h2>
                                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                                            <Button
                                                size="lg"
                                                onClick={handleAccept}
                                                className="bg-rose-500 hover:bg-rose-600 text-white text-xl py-8 px-12 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                            >
                                                Yes, Forever! 💖
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={handleAccept}
                                                className="bg-pink-400 hover:bg-pink-500 text-white text-xl py-8 px-12 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                            >
                                                Absolutely! 🌹
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {accepted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 text-center"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <HeartHandshake size={64} className="text-rose-600" />
                                        </div>
                                        <h3 className="font-playfair text-3xl font-bold text-rose-600 mb-2">
                                            I Love You!
                                        </h3>
                                        <p className="font-lora text-gray-600">
                                            Here's to us, today and always.
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Accepted Overlay Background */}
            <AnimatePresence>
                {accepted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        className="fixed inset-0 bg-rose-500 z-0 mix-blend-overlay pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
