'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProposeDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface ProposeDayProps {
    onComplete: () => void;
    onBack: () => void;
}

interface Choice {
    text: string;
    next?: number;
    outcome?: string;
}

interface Scene {
    id: number;
    text: string;
    choices: Choice[];
}

const PROPOSAL_STORY: Scene[] = [
    {
        id: 0,
        text: "You find yourself in a beautiful garden filled with roses. The sun is setting, painting the sky in shades of pink and orange. You see someone special waiting for you...",
        choices: [
            { text: "Walk towards them with a smile", next: 1 },
            { text: "Pick a rose first", next: 2 },
        ],
    },
    {
        id: 1,
        text: "As you approach, they turn around with the brightest smile. Their eyes light up when they see you. They take your hand gently...",
        choices: [
            { text: "Hold their hand warmly", next: 3 },
            { text: "Give them a hug", next: 4 },
        ],
    },
    {
        id: 2,
        text: "You pick the most beautiful rose and walk towards them. They blush when you offer it to them. 'For you,' you say softly...",
        choices: [
            { text: "Look into their eyes", next: 3 },
            { text: "Tell them how special they are", next: 4 },
        ],
    },
    {
        id: 3,
        text: "Time seems to stand still. The world fades away, and it's just the two of you. They whisper, 'I've been waiting for this moment...'",
        choices: [
            { text: "Say 'Me too'", outcome: "A perfect moment of mutual understanding. Your hearts beat as one." },
            { text: "Smile and nod", outcome: "Sometimes words aren't needed. Your smile says it all." },
        ],
    },
    {
        id: 4,
        text: "They look at you with such warmth and affection. 'You make every day feel like Valentine's Day,' they say. Your heart skips a beat...",
        choices: [
            { text: "Tell them they're your everything", outcome: "A beautiful confession of love. Pure and heartfelt." },
            { text: "Kiss their forehead gently", outcome: "A tender gesture that speaks volumes. Sweet and loving." },
        ],
    },
];

export default function ProposeDay({ onComplete, onBack }: ProposeDayProps) {
    const [currentScene, setCurrentScene] = useState(0);
    const [storyPath, setStoryPath] = useState<string[]>([]);
    const [outcome, setOutcome] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const scene = PROPOSAL_STORY[currentScene];

    const handleChoice = (choice: Choice) => {
        const newPath = [...storyPath, choice.text];
        setStoryPath(newPath);

        if (choice.outcome) {
            setOutcome(choice.outcome);
        } else if (choice.next !== undefined) {
            setCurrentScene(choice.next);
        }
    };

    async function handleSave() {
        if (!outcome) return;

        setSaving(true);
        const userId = getUserId();

        const result: ProposeDayResult = {
            scenario: 'Garden Proposal',
            choices: storyPath,
            outcome,
        };

        await saveDayProgress(userId, 'propose-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-50 py-12 px-4">
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
                        <Gem size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Propose Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        Your romantic story unfolds...
                    </p>
                </motion.div>

                {!outcome ? (
                    <motion.div
                        key={currentScene}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-pink-200"
                    >
                        {/* Story Text */}
                        <p className="font-lora text-xl text-gray-700 leading-relaxed mb-8 text-center">
                            {scene.text}
                        </p>

                        {/* Choices */}
                        <div className="space-y-4">
                            {scene.choices.map((choice, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleChoice(choice)}
                                    className="w-full p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-lora text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                                            {choice.text}
                                        </span>
                                        <Heart size={24} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-8 flex justify-center gap-2">
                            {PROPOSAL_STORY.slice(0, 5).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index <= currentScene ? 'bg-pink-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-12 shadow-2xl border-2 border-pink-300 text-center"
                    >
                        {/* Outcome */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="text-pink-500 mb-8 flex justify-center"
                        >
                            <Heart size={128} fill="currentColor" />
                        </motion.div>

                        <h2 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
                            Your Love Story
                        </h2>

                        <p className="font-lora text-2xl text-gray-700 leading-relaxed mb-8">
                            {outcome}
                        </p>

                        <div className="bg-pink-50 rounded-xl p-6 mb-8">
                            <p className="text-sm text-gray-600 mb-2">Your Journey:</p>
                            {storyPath.map((choice, index) => (
                                <p key={index} className="text-sm text-pink-600 font-semibold">
                                    {index + 1}. {choice}
                                </p>
                            ))}
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                        >
                            {saving ? 'Saving...' : 'Save Our Story'}
                            <Heart className="ml-2" size={20} fill="currentColor" />
                        </Button>

                        {/* Sparkles */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh` }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                    className="absolute text-pink-400"
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
