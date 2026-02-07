import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ValentineDay, DayProgress, DayResult } from './types';

/**
 * Save progress for a specific Valentine's Day
 */
export async function saveDayProgress(
    userId: string,
    day: ValentineDay,
    result: DayResult,
    shareableImageUrl?: string
): Promise<boolean> {
    try {
        const progressRef = doc(db, 'users', userId, 'progress', day);

        const progressData: DayProgress = {
            day,
            completed: true,
            result,
            timestamp: Date.now(),
            ...(shareableImageUrl ? { shareableImageUrl } : {}),
        };

        await setDoc(progressRef, {
            ...progressData,
            serverTimestamp: serverTimestamp(),
        }, { merge: true });

        console.log(`Progress saved for ${day}`);
        return true;
    } catch (error) {
        console.error(`Error saving progress for ${day}:`, error);
        return false;
    }
}

/**
 * Get progress for a specific Valentine's Day
 */
export async function getDayProgress(
    userId: string,
    day: ValentineDay
): Promise<DayProgress | null> {
    try {
        const progressRef = doc(db, 'users', userId, 'progress', day);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
            const data = progressSnap.data();
            return {
                day: data.day,
                completed: data.completed,
                result: data.result,
                timestamp: data.timestamp,
                shareableImageUrl: data.shareableImageUrl,
            };
        }

        return null;
    } catch (error) {
        console.error(`Error getting progress for ${day}:`, error);
        return null;
    }
}

/**
 * Get all progress for a user
 */
export async function getAllProgress(userId: string): Promise<Record<ValentineDay, DayProgress | null>> {
    try {
        const progressCollection = collection(db, 'users', userId, 'progress');
        const progressSnap = await getDocs(progressCollection);

        const progress: Record<string, DayProgress | null> = {};

        progressSnap.forEach((doc) => {
            const data = doc.data();
            progress[doc.id] = {
                day: data.day,
                completed: data.completed,
                result: data.result,
                timestamp: data.timestamp,
                shareableImageUrl: data.shareableImageUrl,
            };
        });

        return progress as Record<ValentineDay, DayProgress | null>;
    } catch (error) {
        console.error('Error getting all progress:', error);
        return {} as Record<ValentineDay, DayProgress | null>;
    }
}

/**
 * Get completion status for all days
 */
export async function getCompletionStatus(userId: string): Promise<{
    completedDays: ValentineDay[];
    totalDays: number;
    percentage: number;
}> {
    try {
        const allProgress = await getAllProgress(userId);
        const completedDays = Object.entries(allProgress)
            .filter(([_, progress]) => progress?.completed)
            .map(([day, _]) => day as ValentineDay);

        const totalDays = 8; // Total Valentine's Week days
        const percentage = Math.round((completedDays.length / totalDays) * 100);

        return {
            completedDays,
            totalDays,
            percentage,
        };
    } catch (error) {
        console.error('Error getting completion status:', error);
        return {
            completedDays: [],
            totalDays: 8,
            percentage: 0,
        };
    }
}

/**
 * Check if all days are completed
 */
export async function areAllDaysCompleted(userId: string): Promise<boolean> {
    const status = await getCompletionStatus(userId);
    return status.percentage === 100;
}

