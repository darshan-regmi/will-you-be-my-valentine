'use client';

import { useEffect } from 'react';

export function SafeRepeat() {
    useEffect(() => {
        const originalRepeat = String.prototype.repeat;
        String.prototype.repeat = function (count: number) {
            if (count < 0) {
                console.warn(`[SafeRepeat] Prevented crash: String.repeat called with count ${count} on string "${this.substring(0, 20)}..."`);
                console.trace();
                return '';
            }
            return originalRepeat.call(this, count);
        };
    }, []);

    return null;
}
