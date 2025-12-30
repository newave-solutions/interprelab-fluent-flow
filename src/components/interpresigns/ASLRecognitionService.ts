// src/components/interpresigns/ASLRecognitionService.ts
// Dynamic imports for lazy loading TensorFlow.js dependencies
import type * as handposeType from '@tensorflow-models/handpose';
import type * as fpType from 'fingerpose';
// Import TensorFlow.js core and backend for proper initialization
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { gestures } from './asl-gestures';
import MotionTracker from './MotionTracker';

interface GestureEstimate {
  name: string;
  score: number;
}

class ASLRecognitionService {
  private net: handposeType.HandPose | null = null;
  private gestureEstimator: fpType.GestureEstimator | null = null;
  private loadingPromise: Promise<void> | null = null;
  private motionTracker: MotionTracker = new MotionTracker();

  async loadModel(): Promise<void> {
    // Prevent multiple simultaneous loads
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    if (this.net && this.gestureEstimator) {
      return; // Already loaded
    }

    this.loadingPromise = (async () => {
      try {
        // Dynamic import to defer loading until needed
        const [handposeModule, fpModule] = await Promise.all([
          import('@tensorflow-models/handpose'),
          import('fingerpose')
        ]);

        if (!this.net) {
          this.net = await handposeModule.load();
        }
        if (!this.gestureEstimator) {
          this.gestureEstimator = new fpModule.GestureEstimator(gestures);
        }
      } finally {
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  async estimateSign(videoElement: HTMLVideoElement): Promise<string | null> {
    if (!this.net || !this.gestureEstimator) {
      await this.loadModel();
    }

    const hand = await this.net!.estimateHands(videoElement);
    if (hand.length > 0) {
      // @tensorflow-models/handpose returns landmarks as arrays [x, y, z]
      const rawLandmarks = hand[0].landmarks as unknown as [number, number, number][];

      // Add frame to motion tracker
      this.motionTracker.addFrame(rawLandmarks);

      // First, try to detect motion-based gestures (J, X, Z)
      const motionGesture = this.motionTracker.detectMotionGesture();
      if (motionGesture) {
        this.motionTracker.clear(); // Clear history after successful detection
        return motionGesture;
      }

      // Convert to fingerpose-compatible format (Keypoint3D requires {x, y, z} objects)
      const landmarks = rawLandmarks.map(([x, y, z]) => ({ x, y, z }));

      // Fall back to static gesture detection for all other letters
      const estimatedGestures = await this.gestureEstimator!.estimate(landmarks, 6.5);

      if (estimatedGestures.gestures && estimatedGestures.gestures.length > 0) {
        const scores = estimatedGestures.gestures.map(p => p.score);
        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        return estimatedGestures.gestures[maxScoreIndex].name;
      }
    }
    return null;
  }

  /**
   * Clear motion tracking history (useful for resetting between practice sessions)
   */
  clearMotionHistory(): void {
    this.motionTracker.clear();
  }
}

export default new ASLRecognitionService();
