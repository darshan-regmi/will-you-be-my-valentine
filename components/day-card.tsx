'use client'

import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { DayConfig, DayStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DayCardProps {
    day: DayConfig;
    status: DayStatus;
    onClick?: () => void;
    index: number;
}

export default function DayCard({ day, status, onClick, index }: DayCardProps) {
    const isLocked = status === 'locked';
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';
    const isAccessible = !isLocked;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
        >
            <motion.button
                onClick={isAccessible ? onClick : undefined}
                disabled={isLocked}
                whileHover={isAccessible ? { scale: 1.05, y: -5 } : {}}
                whileTap={isAccessible ? { scale: 0.98 } : {}}
                className={cn(
                    'relative w-full p-6 rounded-2xl border-2 transition-all duration-300',
                    'flex flex-col items-center gap-4 min-h-[200px]',
                    isLocked && 'opacity-50 cursor-not-allowed blur-[2px]',
                    isCurrent && 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg shadow-pink-200',
                    isCompleted && 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50',
                    !isCurrent && !isCompleted && !isLocked && 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md',
                    isLocked && 'border-gray-200 bg-gray-50'
                )}
                style={{
                    backgroundColor: !isLocked && !isCurrent && !isCompleted ? `${day.color}10` : undefined,
                }}
            >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white rounded-full p-1.5"
                        >
                            <Check size={16} />
                        </motion.div>
                    )}
                    {isLocked && (
                        <div className="bg-gray-400 text-white rounded-full p-1.5">
                            <Lock size={16} />
                        </div>
                    )}
                    {isCurrent && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-pink-500 text-white rounded-full p-1.5"
                        >
                            <Sparkles size={16} />
                        </motion.div>
                    )}
                </div>

                {/* Day Icon */}
                <motion.div
                    animate={isCurrent ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="text-pink-500"
                >
                    <day.icon size={64} />
                </motion.div>

                {/* Day Name */}
                <h3 className="font-playfair text-xl font-bold text-gray-800">
                    {day.name}
                </h3>

                {/* Day Date */}
                <p className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center">
                    {day.description}
                </p>

                {/* Current Day Indicator */}
                {isCurrent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
                    >
                        Today
                    </motion.div>
                )}
            </motion.button>

            {/* Locked Overlay Tooltip */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Unlocks on {new Date(day.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
