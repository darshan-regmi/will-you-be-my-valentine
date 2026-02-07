import { format, parseISO, isBefore, isAfter, isSameDay } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { DayStatus, ValentineDay } from './types';
import { VALENTINE_WEEK_DAYS } from './valentine-config';

// Nepal timezone
export const NEPAL_TIMEZONE = 'Asia/Kathmandu';

/**
 * Get current date/time in Nepal timezone
 */
export function getCurrentNepalTime(): Date {
    return toZonedTime(new Date(), NEPAL_TIMEZONE);
}

/**
 * Format date in Nepal timezone
 */
export function formatNepalDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatInTimeZone(dateObj, NEPAL_TIMEZONE, formatStr);
}

/**
 * Get current date string in Nepal timezone (YYYY-MM-DD)
 */
export function getCurrentNepalDateString(): string {
    return formatNepalDate(getCurrentNepalTime(), 'yyyy-MM-dd');
}

/**
 * Check if a date is in the past (Nepal timezone)
 */
export function isDatePast(dateString: string): boolean {
    const nepalNow = getCurrentNepalTime();
    const targetDate = parseISO(dateString);
    const nepalToday = parseISO(formatNepalDate(nepalNow, 'yyyy-MM-dd'));

    return isBefore(targetDate, nepalToday);
}

/**
 * Check if a date is today (Nepal timezone)
 */
export function isDateToday(dateString: string): boolean {
    const nepalNow = getCurrentNepalTime();
    const targetDate = parseISO(dateString);
    const nepalToday = parseISO(formatNepalDate(nepalNow, 'yyyy-MM-dd'));

    return isSameDay(targetDate, nepalToday);
}

/**
 * Check if a date is in the future (Nepal timezone)
 */
export function isDateFuture(dateString: string): boolean {
    const nepalNow = getCurrentNepalTime();
    const targetDate = parseISO(dateString);
    const nepalToday = parseISO(formatNepalDate(nepalNow, 'yyyy-MM-dd'));

    return isAfter(targetDate, nepalToday);
}

/**
 * Get the status of a Valentine's Day
 */
export function getDayStatus(dayId: ValentineDay, isCompleted: boolean = false): DayStatus {
    const dayConfig = VALENTINE_WEEK_DAYS.find(d => d.id === dayId);
    if (!dayConfig) return 'locked';

    if (isCompleted) return 'completed';
    if (isDateToday(dayConfig.date)) return 'current';
    if (isDatePast(dayConfig.date)) return 'unlocked';
    return 'locked';
}

/**
 * Get the current active Valentine's Day
 */
export function getCurrentDay(): ValentineDay | null {
    const currentDateStr = getCurrentNepalDateString();
    const currentDayConfig = VALENTINE_WEEK_DAYS.find(d => d.date === currentDateStr);
    return currentDayConfig?.id || null;
}

/**
 * Check if a day is accessible (unlocked or current)
 */
export function isDayAccessible(dayId: ValentineDay, isCompleted: boolean = false): boolean {
    const status = getDayStatus(dayId, isCompleted);
    return status === 'unlocked' || status === 'current' || status === 'completed';
}

/**
 * Get formatted date for display
 */
export function getDisplayDate(dateString: string): string {
    return formatInTimeZone(parseISO(dateString), NEPAL_TIMEZONE, 'MMMM d, yyyy');
}

/**
 * Get relative date description (e.g., "Today", "Tomorrow", "Feb 14")
 */
export function getRelativeDateDescription(dateString: string): string {
    if (isDateToday(dateString)) return 'Today';

    const nepalNow = getCurrentNepalTime();
    const targetDate = parseISO(dateString);
    const nepalToday = parseISO(formatNepalDate(nepalNow, 'yyyy-MM-dd'));

    const daysDiff = Math.round((targetDate.getTime() - nepalToday.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff === -1) return 'Yesterday';
    if (daysDiff > 1) return `In ${daysDiff} days`;
    if (daysDiff < -1) return `${Math.abs(daysDiff)} days ago`;

    return formatInTimeZone(targetDate, NEPAL_TIMEZONE, 'MMM d');
}
