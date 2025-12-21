import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
  variant?: 'stars' | 'dots' | 'mixed';
}

export const ParticlesBackground = ({
  className = '',
  particleCount = 50,
  variant = 'mixed'
}: ParticlesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameId = useRef<number>();

  // Brand colors based on your design system
  const brandColors = [
    'rgba(197, 160, 89, 0.8)',      // Nobel gold - primary
    'rgba(197, 160, 89, 0.6)',      // Nobel gold - lighter
    'rgba(249, 248, 244, 0.4)',     // Foreground/text
    'rgba(160, 180, 200, 0.5)',     // Accent blue-gray
    'rgba(197, 160, 89, 0.9)',      // Nobel gold - bright
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles with varied sizes
    const initParticles = () => {
      const generated: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const sizeVariation = variant === 'stars'
          ? Math.random() * 2 + 1  // 1-3px for stars
          : variant === 'dots'
            ? Math.random() * 3 + 2  // 2-5px for dots
            : Math.random() * 4 + 1; // 1-5px for mixed

        generated.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // Velocity X
          vy: (Math.random() - 0.5) * 0.5, // Velocity Y
          size: sizeVariation,
          opacity: Math.random() * 0.6 + 0.3,
          color: variant === 'stars'
            ? brandColors[0] // Always Nobel gold for stars
            : variant === 'dots'
              ? brandColors[2] // Foreground color for dots
              : brandColors[i % brandColors.length] // Mixed colors
        });
      }
      setParticles(generated);
      return generated;
    };

    let currentParticles = initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      currentParticles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Add glow for Nobel gold particles
        if (particle.color.includes('197, 160, 89')) {
          ctx.shadowBlur = particle.size * 3;
          ctx.shadowColor = 'rgba(197, 160, 89, 0.5)';
        }
      });

      // Draw connections between nearby particles
      const connectionDistance = 150; // pixels
      const connectionOpacity = 0.15;

      for (let i = 0; i < currentParticles.length; i++) {
        for (let j = i + 1; j < currentParticles.length; j++) {
          const dx = currentParticles[i].x - currentParticles[j].x;
          const dy = currentParticles[i].y - currentParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Opacity based on distance (closer = more visible)
            const opacity = connectionOpacity * (1 - distance / connectionDistance);

            ctx.beginPath();
            ctx.moveTo(currentParticles[i].x, currentParticles[i].y);
            ctx.lineTo(currentParticles[j].x, currentParticles[j].y);
            ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`; // Nobel gold connections
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particleCount, variant]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
    </div>
  );
};
