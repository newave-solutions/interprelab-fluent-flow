// src/components/interpresigns/motion-gestures.ts
// Metadata and configuration for motion-based ASL gestures

export interface MotionGestureInfo {
    letter: string;
    name: string;
    description: string;
    instructionHint: string;
    requiresMotion: true;
    estimatedDuration: number; // in milliseconds
}

/**
 * Configuration for motion-based ASL gestures (J, X, Z)
 * These gestures cannot be detected from static hand poses alone
 */
export const motionGestures: Record<string, MotionGestureInfo> = {
    J: {
        letter: 'J',
        name: 'J Sign',
        description: 'Pinky extended, trace a J shape (down, then hook left)',
        instructionHint: 'Trace a J with your pinky finger',
        requiresMotion: true,
        estimatedDuration: 1000 // 1 second
    },
    X: {
        letter: 'X',
        name: 'X Sign',
        description: 'Hooked index finger, shake side to side',
        instructionHint: 'Hook your index finger and shake it',
        requiresMotion: true,
        estimatedDuration: 800 // 0.8 seconds
    },
    Z: {
        letter: 'Z',
        name: 'Z Sign',
        description: 'Extended index finger, trace a Z shape',
        instructionHint: 'Trace a Z with your index finger',
        requiresMotion: true,
        estimatedDuration: 1500 // 1.5 seconds
    }
};

/**
 * Check if a letter requires motion tracking
 */
export function isMotionGesture(letter: string): boolean {
    return letter in motionGestures;
}

/**
 * Get hint text for a gesture
 */
export function getGestureHint(letter: string): string {
    if (letter in motionGestures) {
        return motionGestures[letter].instructionHint;
    }
    return `Show the sign for ${letter}`;
}
