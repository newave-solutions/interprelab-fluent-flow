class AudioProcessor {
  constructor() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioStream = null;
    this.recognition = null;
    this.audioChunks = [];
    this.onTranscriptCallback = null;
    this.setupWebSpeechAPI();
  }

  setupWebSpeechAPI() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && this.onTranscriptCallback) {
          this.onTranscriptCallback(finalTranscript.trim(), true);
        } else if (interimTranscript && this.onTranscriptCallback) {
          this.onTranscriptCallback(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          if (this.isRecording) {
            setTimeout(() => {
              if (this.isRecording) {
                this.recognition.start();
              }
            }, 100);
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isRecording) {
          setTimeout(() => {
            if (this.isRecording) {
              this.recognition.start();
            }
          }, 100);
        }
      };
    }
  }

  async startCapture(onTranscript) {
    if (this.isRecording) return;

    this.onTranscriptCallback = onTranscript;
    this.isRecording = true;

    try {
      if (this.recognition) {
        this.recognition.start();
      } else {
        console.warn('Speech recognition not supported. Using mock transcription.');
        this.startMockTranscription();
      }

      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: 'audio/webm'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.securelyProcessAudioChunk(event.data);
        }
      };

      this.mediaRecorder.start(CONFIG.AUDIO_CHUNK_DURATION);

      return true;
    } catch (error) {
      console.error('Error starting audio capture:', error);
      this.isRecording = false;
      throw error;
    }
  }

  securelyProcessAudioChunk(audioBlob) {
    this.audioChunks.push(audioBlob);

    if (this.audioChunks.length > 3) {
      this.audioChunks.shift();
    }
  }

  startMockTranscription() {
    const mockPhrases = [
      'Patient reports chest pain',
      'History of hypertension',
      'Prescribed lisinopril 10mg daily',
      'Symptoms started three days ago',
      'Patient has diabetes mellitus type 2',
      'Take medication with food',
      'Follow up in two weeks',
      'Experiencing shortness of breath',
      'Blood pressure is elevated',
      'Allergic to penicillin'
    ];

    let index = 0;
    this.mockInterval = setInterval(() => {
      if (this.isRecording && this.onTranscriptCallback) {
        this.onTranscriptCallback(mockPhrases[index % mockPhrases.length], true);
        index++;
      }
    }, 5000);
  }

  stopCapture() {
    this.isRecording = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }

    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    this.securelyDisposeAudioData();
  }

  securelyDisposeAudioData() {
    this.audioChunks = [];

    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }
  }

  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}
