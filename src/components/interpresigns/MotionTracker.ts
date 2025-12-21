// src/components/interpresigns/MotionTracker.ts
// Motion tracking service for dynamic ASL gestures (J, X, Z)

type Point3D = [number, number, number];
type HandLandmarks = Point3D[];

interface MotionFrame {
    landmarks: HandLandmarks;
    timestamp: number;
}

/**
 * Tracks hand motion over time to detect dynamic ASL gestures
 * Supports J, X, and Z gestures which require movement tracking
 */
class MotionTracker {
    private history: MotionFrame[] = [];
    private readonly maxHistoryLength = 30; // ~1 second at 30fps
    private readonly minFramesForDetection = 15; // Minimum frames needed

    /**
     * Add a new frame of hand landmarks to the tracking history
     */
    addFrame(landmarks: HandLandmarks): void {
        this.history.push({
            landmarks,
            timestamp: Date.now()
        });

        // Keep history within bounds
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    /**
     * Clear tracking history (e.g., when gesture is recognized)
     */
    clear(): void {
        this.history = [];
    }

    /**
     * Get the path traced by a specific landmark over time
     */
    private getLandmarkPath(landmarkIndex: number): Point3D[] {
        return this.history.map(frame => frame.landmarks[landmarkIndex]);
    }

    /**
     * Calculate Euclidean distance between two 3D points
     */
    private distance(p1: Point3D, p2: Point3D): number {
        return Math.sqrt(
            Math.pow(p2[0] - p1[0], 2) +
            Math.pow(p2[1] - p1[1], 2) +
            Math.pow(p2[2] - p1[2], 2)
        );
    }

    /**
     * Detect J gesture: Pinky extended, downward movement with left hook
     * Gesture: Straight down, then hook to the left
     */
    detectJGesture(): boolean {
        if (this.history.length < this.minFramesForDetection) return false;

        const currentFrame = this.history[this.history.length - 1];
        const landmarks = currentFrame.landmarks;

        // Check hand shape: Pinky (finger 4) extended, others curled
        const pinkyTip = landmarks[20]; // Pinky tip
        const pinkyBase = landmarks[17]; // Pinky base
        const indexTip = landmarks[8];
        const indexBase = landmarks[5];

        // Pinky should be extended
        const pinkyExtended = this.distance(pinkyTip, pinkyBase) > 0.06;
        // Other fingers should be curled
        const indexCurled = this.distance(indexTip, indexBase) < 0.05;

        if (!pinkyExtended || !indexCurled) return false;

        // Track pinky tip path
        const pinkyPath = this.getLandmarkPath(20);
        if (pinkyPath.length < this.minFramesForDetection) return false;

        // Analyze movement: should be downward first, then left
        const startPoint = pinkyPath[0];
        const midPoint = pinkyPath[Math.floor(pinkyPath.length / 2)];
        const endPoint = pinkyPath[pinkyPath.length - 1];

        // First half: downward movement (Y increases)
        const downwardMovement = midPoint[1] - startPoint[1];
        // Second half: leftward movement (X decreases)
        const leftwardMovement = midPoint[0] - endPoint[0];

        return downwardMovement > 0.03 && leftwardMovement > 0.02;
    }

    /**
     * Detect X gesture: Hooked index finger with shaking motion
     * Gesture: Index finger bent, horizontal oscillation
     */
    detectXGesture(): boolean {
        if (this.history.length < this.minFramesForDetection) return false;

        const currentFrame = this.history[this.history.length - 1];
        const landmarks = currentFrame.landmarks;

        // Check hand shape: Index finger hooked (half curl)
        const indexTip = landmarks[8];
        const indexMid = landmarks[7];
        const indexBase = landmarks[5];

        const indexLength = this.distance(indexTip, indexBase);
        const indexHooked = indexLength > 0.03 && indexLength < 0.06;

        if (!indexHooked) return false;

        // Detect oscillation in index finger tip
        const indexPath = this.getLandmarkPath(8);
        if (indexPath.length < this.minFramesForDetection) return false;

        // Count direction changes in X-axis (horizontal shake)
        let directionChanges = 0;
        for (let i = 2; i < indexPath.length; i++) {
            const prevDelta = indexPath[i - 1][0] - indexPath[i - 2][0];
            const currentDelta = indexPath[i][0] - indexPath[i - 1][0];

            // Direction changed (sign flip)
            if (prevDelta * currentDelta < 0) {
                directionChanges++;
            }
        }

        // Shaking motion should have multiple direction changes (at least 3-4)
        return directionChanges >= 3;
    }

    /**
     * Detect Z gesture: Index finger tracing Z shape
     * Gesture: Right-diagonal down, left horizontal, right-diagonal down
     */
    detectZGesture(): boolean {
        if (this.history.length < this.minFramesForDetection) return false;

        const currentFrame = this.history[this.history.length - 1];
        const landmarks = currentFrame.landmarks;

        // Check hand shape: Index extended, others curled
        const indexTip = landmarks[8];
        const indexBase = landmarks[5];
        const middleTip = landmarks[12];
        const middleBase = landmarks[9];

        const indexExtended = this.distance(indexTip, indexBase) > 0.08;
        const middleCurled = this.distance(middleTip, middleBase) < 0.05;

        if (!indexExtended || !middleCurled) return false;

        // Track index finger tip path
        const indexPath = this.getLandmarkPath(8);
        if (indexPath.length < this.minFramesForDetection) return false;

        // Divide path into three segments
        const segment1End = Math.floor(indexPath.length / 3);
        const segment2End = Math.floor((2 * indexPath.length) / 3);

        const seg1Start = indexPath[0];
        const seg1End = indexPath[segment1End];
        const seg2End = indexPath[segment2End];
        const seg3End = indexPath[indexPath.length - 1];

        // Segment 1: Right-diagonal down (X increases, Y increases)
        const seg1_dx = seg1End[0] - seg1Start[0];
        const seg1_dy = seg1End[1] - seg1Start[1];
        const segment1Diagonal = seg1_dx > 0.02 && seg1_dy > 0.02;

        // Segment 2: Left horizontal (X decreases, Y relatively stable)
        const seg2_dx = seg2End[0] - seg1End[0];
        const seg2_dy = Math.abs(seg2End[1] - seg1End[1]);
        const segment2Horizontal = seg2_dx < -0.02 && seg2_dy < 0.015;

        // Segment 3: Right-diagonal down (X increases, Y increases)
        const seg3_dx = seg3End[0] - seg2End[0];
        const seg3_dy = seg3End[1] - seg2End[1];
        const segment3Diagonal = seg3_dx > 0.02 && seg3_dy > 0.02;

        return segment1Diagonal && segment2Horizontal && segment3Diagonal;
    }

    /**
     * Detect any motion-based gesture
     */
    detectMotionGesture(): string | null {
        if (this.detectJGesture()) return 'J';
        if (this.detectXGesture()) return 'X';
        if (this.detectZGesture()) return 'Z';
        return null;
    }
}

export default MotionTracker;
