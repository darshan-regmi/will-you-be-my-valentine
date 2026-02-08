'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, RotateCcw, Trophy, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHOCOLATE_PAIRS } from '@/lib/valentine-config';
import { ChocolateDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface ChocolateDayProps {
    onComplete: () => void;
    onBack: () => void;
}

interface Card {
    id: number;
    pairId: number;
    icon: React.ElementType; // Changed from emoji string
    name: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function ChocolateDay({ onComplete, onBack }: ChocolateDayProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    function initializeGame() {
        // Create pairs of cards
        const cardPairs: Card[] = [];
        CHOCOLATE_PAIRS.forEach((pair, index) => {
            cardPairs.push({
                id: index * 2,
                pairId: pair.id,
                icon: pair.icon,
                name: pair.name,
                isFlipped: false,
                isMatched: false,
            });
            cardPairs.push({
                id: index * 2 + 1,
                pairId: pair.id,
                icon: pair.icon,
                name: pair.name,
                isFlipped: false,
                isMatched: false,
            });
        });

        // Shuffle cards
        const shuffled = cardPairs.sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setStartTime(Date.now());
        setGameCompleted(false);
    }

    function handleCardClick(cardId: number) {
        if (flippedCards.length === 2) return;
        if (flippedCards.includes(cardId)) return;
        if (cards.find(c => c.id === cardId)?.isMatched) return;

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);
            checkMatch(newFlippedCards);
        }
    }

    function checkMatch(flipped: number[]) {
        const [firstId, secondId] = flipped;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.pairId === secondCard?.pairId) {
            // Match found!
            setTimeout(() => {
                setCards(cards.map(card =>
                    card.id === firstId || card.id === secondId
                        ? { ...card, isMatched: true }
                        : card
                ));
                setFlippedCards([]);

                // Check if game is complete
                const allMatched = cards.every(c =>
                    c.isMatched || c.id === firstId || c.id === secondId
                );
                if (allMatched) {
                    setGameCompleted(true);
                }
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                setFlippedCards([]);
            }, 1000);
        }
    }

    async function handleSave() {
        setSaving(true);
        const userId = getUserId();
        const timeSeconds = Math.floor((Date.now() - startTime) / 1000);

        const result: ChocolateDayResult = {
            moves,
            timeSeconds,
            completed: true,
        };

        await saveDayProgress(userId, 'chocolate-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-brown-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="absolute top-4 left-4"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back
                    </Button>

                    <div className="text-brown-600 mb-4 flex justify-center">
                        <Gift size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Chocolate Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600 mb-4">
                        Match the chocolate pairs!
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 justify-center items-center">
                        <div className="bg-white rounded-lg px-4 py-2 shadow">
                            <p className="text-sm text-gray-600">Moves</p>
                            <p className="text-2xl font-bold text-brown-600">{moves}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={initializeGame}
                            className="gap-2"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </Button>
                    </div>
                </motion.div>

                {/* Game Board */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {cards.map((card, index) => {
                        const isFlipped = flippedCards.includes(card.id) || card.isMatched;

                        return (
                            <motion.button
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleCardClick(card.id)}
                                disabled={isFlipped || gameCompleted}
                                className="aspect-square relative"
                                style={{ perspective: '1000px' }}
                            >
                                <motion.div
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full relative"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Card Back */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-brown-400 to-brown-600 rounded-xl flex items-center justify-center shadow-lg"
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <Heart size={32} className="text-white" fill="currentColor" />
                                    </div>

                                    {/* Card Front */}
                                    <div
                                        className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center shadow-lg ${card.isMatched ? 'bg-green-100 border-2 border-green-400' : 'bg-white'
                                            }`}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <div className="text-pink-500 mb-2">
                                            <card.icon size={48} />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700">{card.name}</p>
                                    </div>
                                </motion.div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Completion Modal */}
                <AnimatePresence>
                    {gameCompleted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
                        >
                            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                                <Trophy className="text-yellow-500 mx-auto mb-4" size={64} />
                                <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                                    Sweet Success!
                                </h2>
                                <p className="font-lora text-gray-600 mb-6">
                                    You matched all the chocolates in <strong>{moves}</strong> moves!
                                </p>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-brown-500 hover:bg-brown-600 text-black px-8 py-6 text-lg w-full"
                                >
                                    {saving ? 'Saving...' : 'Continue'}
                                    <Heart className="ml-2" size={20} fill="currentColor" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
