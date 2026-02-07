// Type definitions for Valentine's Week application

export type ValentineDay =
    | 'rose-day'
    | 'propose-day'
    | 'chocolate-day'
    | 'teddy-day'
    | 'promise-day'
    | 'hug-day'
    | 'kiss-day'
    | 'valentine-day';

export type DayStatus = 'locked' | 'current' | 'unlocked' | 'completed';

import { ElementType } from 'react';

export interface DayConfig {
    id: ValentineDay;
    name: string;
    date: string; // Format: 'YYYY-MM-DD'
    description: string;
    icon: ElementType;
    color: string;
}

export interface RoseDayResult {
    color: 'red' | 'pink' | 'white' | 'yellow' | 'lavender';
    message: string;
}

export interface ProposeDayResult {
    scenario: string;
    choices: string[];
    outcome: string;
}

export interface ChocolateDayResult {
    moves: number;
    timeSeconds: number;
    completed: boolean;
}

export interface TeddyDayResult {
    color: 'brown' | 'pink' | 'white';
    mood: 'happy' | 'shy' | 'loving';
    accessory: 'bow' | 'heart' | 'flower';
}

export interface PromiseDayResult {
    promise: string;
    isCustom: boolean;
}

export interface HugDayResult {
    durationSeconds: number;
    completed: boolean;
}

export interface KissDayResult {
    kissCount: number;
    message: string;
}

export interface ValentineDayResult {
    story: string;
    allDaysCompleted: boolean;
}

export type DayResult =
    | RoseDayResult
    | ProposeDayResult
    | ChocolateDayResult
    | TeddyDayResult
    | PromiseDayResult
    | HugDayResult
    | KissDayResult
    | ValentineDayResult;

export interface DayProgress {
    day: ValentineDay;
    completed: boolean;
    result: DayResult | null;
    timestamp: number;
    shareableImageUrl?: string;
}

export interface UserProgress {
    userId: string;
    days: Record<ValentineDay, DayProgress | null>;
    completionPercentage: number;
    lastUpdated: number;
}

export interface ShareableCard {
    dayName: string;
    result: string;
    quote: string;
    date: string;
    imageDataUrl: string;
}
