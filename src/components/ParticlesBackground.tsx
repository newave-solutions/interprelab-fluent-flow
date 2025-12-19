import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
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
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: variant === 'stars' 
          ? Math.random() * 3 + 1 
          : variant === 'dots' 
            ? Math.random() * 4 + 2 
            : Math.random() * 4 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setParticles(generated);
  }, [particleCount, variant]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: variant === 'stars' 
              ? 'hsl(var(--nobel-gold))' 
              : variant === 'dots'
                ? 'hsl(var(--foreground) / 0.3)'
                : particle.id % 3 === 0 
                  ? 'hsl(var(--nobel-gold))' 
                  : 'hsl(var(--foreground) / 0.2)',
            boxShadow: variant === 'stars' || (variant === 'mixed' && particle.id % 3 === 0)
              ? `0 0 ${particle.size * 2}px hsl(var(--nobel-gold) / 0.5)`
              : 'none',
            animation: `particleFloat ${particle.duration}s ease-in-out infinite, particleTwinkle ${particle.duration / 2}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s, ${particle.delay + 2}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(90deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(180deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(270deg);
          }
        }
        
        @keyframes particleTwinkle {
          0%, 100% {
            opacity: var(--particle-opacity, 0.3);
          }
          50% {
            opacity: calc(var(--particle-opacity, 0.3) * 1.8);
          }
        }
      `}</style>
    </div>
  );
};
