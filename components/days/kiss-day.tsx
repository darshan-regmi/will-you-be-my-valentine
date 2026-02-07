'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KissDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface KissDayProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function KissDay({ onComplete, onBack }: KissDayProps) {
    const [kissCount, setKissCount] = useState(0);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [completed, setCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    const REQUIRED_KISSES = 5;

    const handleKiss = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add particle effect
        const newParticle = { id: Date.now(), x, y };
        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);

        const newCount = kissCount + 1;
        setKissCount(newCount);

        if (newCount >= REQUIRED_KISSES) {
            setCompleted(true);
        }
    };

    async function handleSave() {
        setSaving(true);
        const userId = getUserId();

        const result: KissDayResult = {
            kissCount,
            message: 'Sweet kisses sent with love!',
        };

        await saveDayProgress(userId, 'kiss-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-rose-50 py-12 px-4">
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
                        <Sparkles size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Kiss Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        {completed ? 'All kisses received!' : `Send ${REQUIRED_KISSES} sweet kisses`}
                    </p>
                </motion.div>

                {!completed ? (
                    <div className="flex flex-col items-center justify-center">
                        {/* Kiss Counter */}
                        <div className="mb-8 text-center">
                            <p className="text-6xl font-bold text-pink-500 mb-2">
                                {kissCount} / {REQUIRED_KISSES}
                            </p>
                            <p className="text-gray-600 font-lora">
                                Tap the heart to send kisses
                            </p>
                        </div>

                        {/* Interactive Kiss Area */}
                        <motion.div
                            onClick={handleKiss}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer select-none"
                        >
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center shadow-2xl">
                                <Heart size={120} className="text-white" fill="currentColor" />
                            </div>

                            {/* Particle Effects */}
                            <AnimatePresence>
                                {particles.map(particle => (
                                    <motion.div
                                        key={particle.id}
                                        initial={{ scale: 0, x: particle.x, y: particle.y, opacity: 1 }}
                                        animate={{
                                            scale: [0, 1.5, 0],
                                            y: particle.y - 100,
                                            opacity: [1, 1, 0]
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="absolute pointer-events-none"
                                    >
                                        <Sparkles size={32} className="text-pink-500" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Kiss Emojis */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                                    animate={{
                                        y: '-20vh',
                                        opacity: [0, 0.6, 0],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 6 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                        ease: 'linear',
                                    }}
                                    className="absolute text-pink-300 text-3xl"
                                >
                                    <Sparkles size={24} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        {/* Success Animation */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-9xl mb-8"
                        >
                            💋
                        </motion.div>

                        <h2 className="font-playfair text-4xl font-bold text-gray-800 mb-4">
                            Sweet Kisses Sent!
                        </h2>
                        <p className="font-lora text-xl text-gray-600 mb-8">
                            You sent {kissCount} loving kisses. How sweet!
                        </p>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                        >
                            {saving ? 'Saving...' : 'Continue'}
                            <Heart className="ml-2" size={20} fill="currentColor" />
                        </Button>

                        {/* Celebration Hearts */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(20)].map((_, i) => (
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
                                        delay: i * 0.15,
                                        ease: 'linear',
                                    }}
                                    className="absolute text-red-400"
                                >
                                    <Heart size={20 + Math.random() * 30} fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Sparkles */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={`sparkle-${i}`}
                                    initial={{ scale: 0, x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh` }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                    className="absolute text-yellow-400"
                                >
                                    <Sparkles size={24} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
