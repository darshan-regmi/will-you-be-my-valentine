'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Smile, Ghost, Gift, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEDDY_OPTIONS } from '@/lib/valentine-config';
import { TeddyDayResult } from '@/lib/types';
import { getUserId } from '@/lib/user-id';
import { saveDayProgress } from '@/lib/firestore-service';

interface TeddyDayProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function TeddyDay({ onComplete, onBack }: TeddyDayProps) {
    const [color, setColor] = useState<'brown' | 'pink' | 'white'>('brown');
    const [mood, setMood] = useState<'happy' | 'shy' | 'loving'>('happy');
    const [accessory, setAccessory] = useState<'bow' | 'heart' | 'flower'>('bow');

    // Default colors for mood and accessory
    const [moodColor, setMoodColor] = useState('pink');
    const [accessoryColor, setAccessoryColor] = useState('red');

    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        const userId = getUserId();

        const result: TeddyDayResult = {
            color,
            mood,
            accessory,
            moodColor,
            accessoryColor,
        };

        await saveDayProgress(userId, 'teddy-day', result);
        setSaving(false);

        setTimeout(() => {
            onComplete();
        }, 1000);
    }

    const selectedColorData = TEDDY_OPTIONS.colors.find(c => c.id === color);
    const selectedMoodData = TEDDY_OPTIONS.moods.find(m => m.id === mood);
    const selectedAccessoryData = TEDDY_OPTIONS.accessories.find(a => a.id === accessory);

    const selectedMoodColorData = TEDDY_OPTIONS.decorationColors?.find(c => c.id === moodColor);
    const selectedAccessoryColorData = TEDDY_OPTIONS.decorationColors?.find(c => c.id === accessoryColor);

    // Color picker component for reuse
    const ColorPicker = ({ selectedId, onSelect, label }: { selectedId: string, onSelect: (id: string) => void, label: string }) => (
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
            <div className="flex flex-wrap gap-2">
                {TEDDY_OPTIONS.decorationColors?.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedId === c.id ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select ${c.name} color`}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
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
                        <Smile size={96} />
                    </div>
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                        Teddy Day
                    </h1>
                    <p className="font-lora text-xl text-gray-600">
                        Build your perfect teddy bear
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Teddy Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200 flex flex-col items-center justify-center"
                    >
                        <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">
                            Your Teddy Bear
                        </h2>

                        <motion.div
                            key={`${color}-${mood}-${accessory}`}
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="relative"
                        >
                            {/* Teddy Bear Visualization */}
                            <div
                                className="mb-4 transition-colors duration-300"
                                style={{
                                    color: selectedColorData?.hex || '#FFB6C1',
                                    filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))'
                                }}
                            >
                                <Smile size={128} strokeWidth={1.5} />
                            </div>

                            {/* Mood Icon Overlay */}
                            <div
                                className="absolute top-0 right-0 transition-colors duration-300"
                                style={{ color: selectedMoodColorData?.hex || '#EC4899' }}
                            >
                                {selectedMoodData && <selectedMoodData.icon size={48} />}
                            </div>

                            {/* Accessory Icon Overlay */}
                            <div
                                className="absolute bottom-0 left-0 transition-colors duration-300"
                                style={{ color: selectedAccessoryColorData?.hex || '#EF4444' }}
                            >
                                {selectedAccessoryData && <selectedAccessoryData.icon size={48} />}
                            </div>
                        </motion.div>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                <strong>Color:</strong> {selectedColorData?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Mood:</strong> {selectedMoodData?.name} ({selectedMoodColorData?.name})
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Accessory:</strong> {selectedAccessoryData?.name} ({selectedAccessoryColorData?.name})
                            </p>
                        </div>
                    </motion.div>

                    {/* Customization Options */}
                    <div className="space-y-6">
                        {/* Color Selection */}
                        <div>
                            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                                Choose Color
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {TEDDY_OPTIONS.colors.map((colorOption, index) => (
                                    <motion.button
                                        key={colorOption.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setColor(colorOption.id as any)}
                                        className={`
                      p-4 rounded-xl border-2 transition-all
                      ${color === colorOption.id
                                                ? 'border-pink-500 bg-pink-50 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-pink-300'
                                            }
                    `}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-300"
                                            style={{ backgroundColor: colorOption.hex }}
                                        />
                                        <p className="text-sm font-semibold text-gray-800">
                                            {colorOption.name}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Mood Selection */}
                        <div>
                            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                                Choose Mood
                            </h3>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {TEDDY_OPTIONS.moods.map((moodOption, index) => (
                                    <motion.button
                                        key={moodOption.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setMood(moodOption.id as any)}
                                        className={`
                      p-4 rounded-xl border-2 transition-all
                      ${mood === moodOption.id
                                                ? 'border-pink-500 bg-pink-50 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-pink-300'
                                            }
                    `}
                                    >
                                        <div
                                            className="mb-2 flex justify-center transition-colors duration-300"
                                            style={{ color: mood === moodOption.id ? (selectedMoodColorData?.hex || '#EC4899') : '#EC4899' }}
                                        >
                                            <moodOption.icon size={32} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {moodOption.name}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                            <ColorPicker
                                label="Mood Color"
                                selectedId={moodColor}
                                onSelect={setMoodColor}
                            />
                        </div>

                        {/* Accessory Selection */}
                        <div>
                            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                                Choose Accessory
                            </h3>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {TEDDY_OPTIONS.accessories.map((accessoryOption, index) => (
                                    <motion.button
                                        key={accessoryOption.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAccessory(accessoryOption.id as any)}
                                        className={`
                      p-4 rounded-xl border-2 transition-all
                      ${accessory === accessoryOption.id
                                                ? 'border-pink-500 bg-pink-50 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-pink-300'
                                            }
                    `}
                                    >
                                        <div
                                            className="mb-2 flex justify-center transition-colors duration-300"
                                            style={{ color: accessory === accessoryOption.id ? (selectedAccessoryColorData?.hex || '#EF4444') : '#EF4444' }}
                                        >
                                            <accessoryOption.icon size={32} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {accessoryOption.name}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                            <ColorPicker
                                label="Accessory Color"
                                selectedId={accessoryColor}
                                onSelect={setAccessoryColor}
                            />
                        </div>

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                        >
                            {saving ? 'Saving...' : 'Save My Teddy'}
                            <Heart className="ml-2" size={20} fill="currentColor" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
