'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Share2, Flower2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROSE_COLORS } from '@/lib/valentine-config';
import { RoseDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface RoseDayProps {
    onComplete: () => void;
    onBack: () => void;
}

type RoseColor = keyof typeof ROSE_COLORS;

export default function RoseDay({ onComplete, onBack }: RoseDayProps) {
    const [selectedColor, setSelectedColor] = useState<RoseColor | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleColorSelect = (color: RoseColor) => {
        setSelectedColor(color);
        setShowMessage(true);
    };

    const handleSave = async () => {
        if (!selectedColor) return;

        setSaving(true);
        const userId = getUserId();
        const result: RoseDayResult = {
            color: selectedColor,
            message: ROSE_COLORS[selectedColor].message,
        };

        await saveDayProgress(userId, 'rose-day', result);
        setSaving(false);

        // Small delay before completing
        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-50 py-12 px-4">
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
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-pink-500 mb-4"
                    >
                        <Flower2 size={96} />
                    </motion.div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Rose Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        Choose a rose color to reveal its special meaning
                    </p>
                </motion.div>

                {/* Rose Color Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                    {Object.entries(ROSE_COLORS).map(([color, data], index) => (
                        <motion.button
                            key={color}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleColorSelect(color as RoseColor)}
                            className={`
                relative p-6 rounded-2xl border-4 transition-all duration-300
                ${selectedColor === color
                                    ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-200'
                                    : 'border-gray-200 bg-white hover:border-pink-300'
                                }
              `}
                        >
                            <div className={`mb-2 ${data.color}`}>
                                <data.icon size={64} />
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">{data.name}</p>

                            {selectedColor === color && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-2"
                                >
                                    <Heart size={16} fill="currentColor" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Message Display */}
                <AnimatePresence>
                    {showMessage && selectedColor && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200"
                        >
                            <div className="text-center mb-6">
                                <div className={`flex justify-center mb-4 ${ROSE_COLORS[selectedColor].color}`}>
                                    {(() => {
                                        const Icon = ROSE_COLORS[selectedColor].icon;
                                        return <Icon size={80} />;
                                    })()}
                                </div>
                                <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                                    {ROSE_COLORS[selectedColor].name}
                                </h2>
                                <p className="font-lora text-lg text-gray-600 leading-relaxed">
                                    {ROSE_COLORS[selectedColor].message}
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                                >
                                    {saving ? 'Saving...' : 'Save & Continue'}
                                    <Heart className="ml-2" size={20} fill="currentColor" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedColor(null);
                                        setShowMessage(false);
                                    }}
                                    className="px-8 py-6 text-lg"
                                >
                                    Choose Different Rose
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Hearts */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                            animate={{
                                y: '-20vh',
                                opacity: [0, 0.6, 0],
                            }}
                            transition={{
                                duration: 8 + Math.random() * 4,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: 'linear',
                            }}
                            className="absolute text-pink-300"
                        >
                            <Heart size={24 + Math.random() * 24} fill="currentColor" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
