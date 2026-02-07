/**
 * Generate or retrieve a unique user ID for anonymous tracking
 * Stored in localStorage for persistence across sessions
 */

const USER_ID_KEY = 'valentine_user_id';

/**
 * Generate a random user ID
 */
function generateUserId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${randomStr}`;
}

/**
 * Get or create user ID
 */
export function getUserId(): string {
    if (typeof window === 'undefined') {
        // Server-side rendering - return temporary ID
        return 'ssr_temp_user';
    }

    try {
        // Try to get existing ID from localStorage
        let userId = localStorage.getItem(USER_ID_KEY);

        if (!userId) {
            // Generate new ID if not found
            userId = generateUserId();
            localStorage.setItem(USER_ID_KEY, userId);
        }

        return userId;
    } catch (error) {
        // Fallback if localStorage is not available
        console.warn('localStorage not available, using session-based ID');

        // Try sessionStorage as fallback
        try {
            let userId = sessionStorage.getItem(USER_ID_KEY);
            if (!userId) {
                userId = generateUserId();
                sessionStorage.setItem(USER_ID_KEY, userId);
            }
            return userId;
        } catch {
            // Last resort - generate temporary ID for this session
            return generateUserId();
        }
    }
}

/**
 * Clear user ID (for testing purposes)
 */
export function clearUserId(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(USER_ID_KEY);
        sessionStorage.removeItem(USER_ID_KEY);
    } catch (error) {
        console.warn('Could not clear user ID:', error);
    }
}
