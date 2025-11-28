// src/services/ASLRecognitionService.js
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import { gestures } from './asl-gestures';

class ASLRecognitionService {
  constructor() {
    this.net = null;
    this.gestureEstimator = null;
  }

  async loadModel() {
    if (!this.net) {
      this.net = await handpose.load();
    }
    if (!this.gestureEstimator) {
      this.gestureEstimator = new fp.GestureEstimator(gestures);
    }
  }

  async estimateSign(videoElement) {
    if (!this.net || !this.gestureEstimator) {
      await this.loadModel();
    }

    const hand = await this.net.estimateHands(videoElement);
    if (hand.length > 0) {
      const estimatedGestures = await this.gestureEstimator.estimate(hand[0].landmarks, 6.5);
      if (estimatedGestures.gestures && estimatedGestures.gestures.length > 0) {
        const confidence = estimatedGestures.gestures.map(p => p.confidence);
        const maxConfidence = confidence.indexOf(Math.max(...confidence));
        return estimatedGestures.gestures[maxConfidence].name;
      }
    }
    return null;
  }
}

export default new ASLRecognitionService();
