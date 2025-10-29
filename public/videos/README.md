# Sample Videos for InterpreLab Hero Section

## Overview
This directory contains sample videos for the hero section of the InterpreLab website.

## Video Requirements

### Format Specifications
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps or 60fps
- **Bitrate**: 5-10 Mbps for optimal quality/size balance
- **Duration**: 15-30 seconds (short, impactful clips)
- **File Size**: < 10MB per video (for fast loading)

### Content Suggestions

#### 1. LEP Statistics Video (`lep-statistics.mp4`)
**Theme**: Limited English Proficiency Statistics
- Show animated statistics about LEP patients
- Display growth charts of interpretation needs
- Highlight healthcare communication challenges
- Use professional medical imagery
- Color scheme: Blue/teal tones

#### 2. Interpreter Stress Video (`interpreter-stress.mp4`)
**Theme**: Challenges Faced by Medical Interpreters
- Show interpreter in action (stock footage)
- Display stress indicators and challenges
- Highlight the need for AI assistance
- Show before/after with InterpreLab solution
- Color scheme: Warm tones transitioning to cool

#### 3. Terminology Gap Video (`terminology-gap.mp4`)
**Theme**: Medical Terminology Complexity
- Animated medical terms floating/transforming
- Show translation challenges
- Display InterpreLab's AI-powered solution
- Demonstrate real-time assistance
- Color scheme: Purple/gradient tones

## How to Add Real Videos

### Option 1: Create Videos with Stock Footage
1. Use services like:
   - **Pexels Videos** (https://www.pexels.com/videos/)
   - **Pixabay** (https://pixabay.com/videos/)
   - **Unsplash** (https://unsplash.com/)

2. Edit with free tools:
   - **DaVinci Resolve** (Professional, free)
   - **OpenShot** (Simple, open-source)
   - **Shotcut** (Cross-platform)

3. Add text overlays and animations

### Option 2: Use AI Video Generation
1. **Runway ML** - AI video generation
2. **Synthesia** - AI avatar videos
3. **Pictory** - Text-to-video conversion

### Option 3: Commission Professional Videos
1. **Fiverr** - Affordable freelancers
2. **Upwork** - Professional videographers
3. **99designs** - Design contests

## Converting and Optimizing Videos

### Using FFmpeg (Command Line)
```bash
# Convert to optimized MP4
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4

# Resize to 1080p
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 -preset medium output.mp4

# Compress file size
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow output.mp4
```

### Using Online Tools
- **CloudConvert** (https://cloudconvert.com/)
- **Online-Convert** (https://www.online-convert.com/)
- **Compress Video** (https://www.compressvideo.io/)

## Current Placeholder Files

The following poster images are currently being used as placeholders:
- `lep-statistics-poster.jpg` - Poster for LEP statistics video
- `interpreter-stress-poster.jpg` - Poster for interpreter stress video
- `terminology-gap-poster.jpg` - Poster for terminology gap video

## Adding Videos to the Project

1. Place your MP4 files in this directory:
   ```
   public/videos/lep-statistics.mp4
   public/videos/interpreter-stress.mp4
   public/videos/terminology-gap.mp4
   ```

2. Update the Hero component (`src/components/Hero.tsx`):
   ```typescript
   const sampleVideos = [
     {
       src: "/videos/lep-statistics.mp4",
       poster: "/videos/lep-statistics-poster.jpg",
       title: "LEP Statistics"
     },
     {
       src: "/videos/interpreter-stress.mp4",
       poster: "/videos/interpreter-stress-poster.jpg",
       title: "Interpreter Stress"
     },
     {
       src: "/videos/terminology-gap.mp4",
       poster: "/videos/terminology-gap-poster.jpg",
       title: "Terminology Gap"
     }
   ];
   ```

3. The videos will automatically load when users click "Watch Demo"

## Performance Tips

1. **Lazy Loading**: Videos only load when requested
2. **Poster Images**: Always provide poster images for instant display
3. **Preload**: Use `preload="metadata"` for faster playback
4. **CDN**: Consider hosting videos on a CDN for global performance
5. **Adaptive Streaming**: For longer videos, consider HLS or DASH

## Accessibility

- Always provide captions/subtitles (WebVTT format)
- Include audio descriptions for visually impaired users
- Ensure videos can be paused and controlled
- Provide transcripts for all video content

## License and Attribution

Ensure all video content is:
- Properly licensed for commercial use
- Attributed if required
- Free from copyright infringement
- Compliant with stock footage terms

## Questions?

Contact the development team for assistance with video integration.
