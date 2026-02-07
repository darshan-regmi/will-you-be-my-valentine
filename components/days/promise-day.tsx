'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PROMISE_TEMPLATES } from '@/lib/valentine-config';
import { PromiseDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface PromiseDayProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function PromiseDay({ onComplete, onBack }: PromiseDayProps) {
    const [selectedPromise, setSelectedPromise] = useState<string>('');
    const [customPromise, setCustomPromise] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleTemplateSelect = (template: string) => {
        setSelectedPromise(template);
        setIsCustom(false);
        setShowAnimation(true);
    };

    const handleCustomPromise = () => {
        if (customPromise.trim()) {
            setSelectedPromise(customPromise);
            setIsCustom(true);
            setShowAnimation(true);
        }
    };

    async function handleSave() {
        if (!selectedPromise) return;

        setSaving(true);
        const userId = getUserId();

        const result: PromiseDayResult = {
            promise: selectedPromise,
            isCustom,
        };

        await saveDayProgress(userId, 'promise-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-50 py-12 px-4">
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
                        <HeartHandshake size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Promise Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        Make a heartfelt promise
                    </p>
                </motion.div>

                {!showAnimation ? (
                    <div className="space-y-8">
                        {/* Promise Templates */}
                        <div>
                            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4 text-center">
                                Choose a Promise
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {PROMISE_TEMPLATES.map((template, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleTemplateSelect(template)}
                                        className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-400 transition-all text-left shadow-sm hover:shadow-md"
                                    >
                                        <p className="font-lora text-gray-700 leading-relaxed">
                                            "{template}"
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Promise */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200">
                            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4 text-center">
                                Or Write Your Own
                            </h2>
                            <Textarea
                                value={customPromise}
                                onChange={(e) => setCustomPromise(e.target.value)}
                                placeholder="I promise to..."
                                className="min-h-[120px] font-lora text-lg mb-4"
                            />
                            <Button
                                onClick={handleCustomPromise}
                                disabled={!customPromise.trim()}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                            >
                                Use Custom Promise
                                <Sparkles className="ml-2" size={20} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl p-12 shadow-2xl border-2 border-pink-300"
                    >
                        {/* Handwriting Animation */}
                        <div className="mb-8">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-lora text-3xl text-gray-800 leading-relaxed text-center mb-8"
                            >
                                {selectedPromise.split('').map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.p>

                            {/* Signature */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: selectedPromise.length * 0.03 + 0.5 }}
                                className="text-right"
                            >
                                <p className="font-playfair text-2xl italic text-gray-600 flex items-center justify-end gap-2">
                                    - With all my love <Heart size={24} className="text-red-500 inline" fill="currentColor" />
                                </p>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                            >
                                {saving ? 'Saving...' : 'Save Promise'}
                                <Heart className="ml-2" size={20} fill="currentColor" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowAnimation(false);
                                    setSelectedPromise('');
                                }}
                                className="px-8 py-6 text-lg"
                            >
                                Choose Different Promise
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Decorative Elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                            animate={{
                                y: '-20vh',
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{
                                duration: 10 + Math.random() * 5,
                                repeat: Infinity,
                                delay: i * 1.2,
                                ease: 'linear',
                            }}
                            className="absolute text-purple-300"
                        >
                            <Sparkles size={20 + Math.random() * 20} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
