import { DayConfig, ValentineDay } from './types';
import {
    Flower2,
    Gem,
    Gift,
    Ghost, // Using Ghost as a cute proxy for Teddy/Toy or maybe just Heart
    HeartHandshake,
    Users, // For Hug
    Sparkles, // For Kiss/Magic
    Heart,
    Candy, // Checking if Candy exists, if not will fallback in next step or use verify
    Smile,
    Palette // For colors
} from 'lucide-react';

// Valentine's Week 2026 Configuration
export const VALENTINE_WEEK_DAYS: DayConfig[] = [
    {
        id: 'rose-day',
        name: 'Rose Day',
        date: '2026-02-07',
        description: 'Choose a rose color and discover its meaning',
        icon: Flower2,
        color: '#ff6b9d',
    },
    {
        id: 'propose-day',
        name: 'Propose Day',
        date: '2026-02-08',
        description: 'An interactive proposal story',
        icon: Gem,
        color: '#ff1493',
    },
    {
        id: 'chocolate-day',
        name: 'Chocolate Day',
        date: '2026-02-09',
        description: 'Match the chocolate pairs',
        icon: Gift, // Replaced Chocolate with Gift as generic "Treat"
        color: '#8b4513',
    },
    {
        id: 'teddy-day',
        name: 'Teddy Day',
        date: '2026-02-10',
        description: 'Build your perfect teddy bear',
        icon: Smile, // Replaced Teddy with Smile/Toy proxy
        color: '#dda0dd',
    },
    {
        id: 'promise-day',
        name: 'Promise Day',
        date: '2026-02-11',
        description: 'Make a heartfelt promise',
        icon: HeartHandshake,
        color: '#ff69b4',
    },
    {
        id: 'hug-day',
        name: 'Hug Day',
        date: '2026-02-12',
        description: 'Send a warm virtual hug',
        icon: Users,
        color: '#ffb6c1',
    },
    {
        id: 'kiss-day',
        name: 'Kiss Day',
        date: '2026-02-13',
        description: 'Share sweet moments',
        icon: Sparkles, // Replaced Kiss with Sparkles
        color: '#ff1493',
    },
    {
        id: 'valentine-day',
        name: "Valentine's Day",
        date: '2026-02-14',
        description: 'Your complete love story',
        icon: Heart,
        color: '#dc143c',
    },
];

// Rose Day Configuration
export const ROSE_COLORS = {
    red: {
        name: 'Red Rose',
        message: 'Red roses symbolize deep love and passion. Like this rose, my love for you is timeless and true.',
        icon: Heart,
        color: 'text-red-500'
    },
    pink: {
        name: 'Pink Rose',
        message: 'Pink roses represent admiration and joy. You bring endless happiness to my life.',
        icon: Flower2, // Using Flower2 as generic flowery/pink thing
        color: 'text-pink-400'
    },
    white: {
        name: 'White Rose',
        message: 'White roses signify purity and new beginnings. With you, every day feels like a fresh start.',
        icon: Sparkles,
        color: 'text-slate-400'
    },
    yellow: {
        name: 'Yellow Rose',
        message: 'Yellow roses mean friendship and care. You are my best friend and my greatest love.',
        icon: Smile,
        color: 'text-yellow-400'
    },
    lavender: {
        name: 'Lavender Rose',
        message: 'Lavender roses represent enchantment. I am completely enchanted by you.',
        icon: Gem, // Magical/Enchantment
        color: 'text-purple-400'
    },
};

// Chocolate Day Configuration
export const CHOCOLATE_PAIRS = [
    { id: 1, name: 'Dark Chocolate', icon: Heart },
    { id: 2, name: 'Milk Chocolate', icon: Smile },
    { id: 3, name: 'White Chocolate', icon: Sparkles },
    { id: 4, name: 'Truffle', icon: Gem },
];

// Teddy Day Configuration
export const TEDDY_OPTIONS = {
    colors: [
        { id: 'brown', name: 'Classic Brown', hex: '#8B4513' },
        { id: 'pink', name: 'Sweet Pink', hex: '#FFB6C1' },
        { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
    ],
    moods: [
        { id: 'happy', name: 'Happy', icon: Smile },
        { id: 'shy', name: 'Shy', icon: Ghost },
        { id: 'loving', name: 'Loving', icon: Heart },
    ],
    accessories: [
        { id: 'bow', name: 'Bow Tie', icon: Gift },
        { id: 'heart', name: 'Heart', icon: Heart },
        { id: 'flower', name: 'Flower', icon: Flower2 },
    ],
    decorationColors: [
        { id: 'red', name: 'Red', hex: '#EF4444', class: 'text-red-500' },
        { id: 'pink', name: 'Pink', hex: '#EC4899', class: 'text-pink-500' },
        { id: 'rose', name: 'Rose', hex: '#E11D48', class: 'text-rose-600' },
        { id: 'purple', name: 'Purple', hex: '#9333EA', class: 'text-purple-600' },
        { id: 'blue', name: 'Blue', hex: '#2563EB', class: 'text-blue-600' },
        { id: 'gold', name: 'Gold', hex: '#D97706', class: 'text-amber-600' },
    ],
};

// Promise Day Templates
export const PROMISE_TEMPLATES = [
    "I promise to always make you smile, even on your darkest days.",
    "I promise to be your biggest supporter in everything you do.",
    "I promise to love you more with each passing day.",
    "I promise to always be honest and communicate openly with you.",
    "I promise to cherish every moment we spend together.",
    "I promise to be your safe place, your home, your forever.",
    "I promise to dance with you in the kitchen and laugh at your jokes.",
    "I promise to choose you, every single day, for the rest of my life.",
];

// Romantic Quotes for Shareable Cards
export const ROMANTIC_QUOTES = [
    "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
    "You are my today and all of my tomorrows.",
    "In you, I've found the love of my life and my closest, truest friend.",
    "Every love story is beautiful, but ours is my favorite.",
    "I love you not only for what you are, but for what I am when I am with you.",
    "You are my sun, my moon, and all my stars.",
    "Together is a wonderful place to be.",
    "I choose you. And I'll choose you over and over and over. Without pause, without a doubt, in a heartbeat. I'll keep choosing you.",
    "You are the finest, loveliest, tenderest, and most beautiful person I have ever known.",
    "My heart is perfect because you are inside.",
];

// Helper function to get day config by ID
export function getDayConfig(dayId: ValentineDay): DayConfig | undefined {
    return VALENTINE_WEEK_DAYS.find(day => day.id === dayId);
}

// Helper function to get day config by date
export function getDayConfigByDate(date: string): DayConfig | undefined {
    return VALENTINE_WEEK_DAYS.find(day => day.date === date);
}

// Helper function to get random romantic quote
export function getRandomQuote(): string {
    return ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)];
}
