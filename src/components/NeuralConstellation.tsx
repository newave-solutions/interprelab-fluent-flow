import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
}

export default function NeuralConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            particlesRef.current = [];

            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particlesRef.current.push({
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(18, 18, 18, 0.1)'; // Slightly transparent to create trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            particles.forEach((particle) => {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    particle.x += (dx / distance) * force * 2;
                    particle.y += (dy / distance) * force * 2;
                }

                const returnForce = 0.05;
                particle.x += (particle.baseX - particle.x) * returnForce;
                particle.y += (particle.baseY - particle.y) * returnForce;

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -1;
                    particle.baseX = particle.x;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -1;
                    particle.baseY = particle.y;
                }
            });

            particles.forEach((particle, i) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#C5A059'; // Nobel Gold particles
                ctx.fill();

                particles.slice(i + 1).forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        const opacity = (120 - distance) / 120;
                        ctx.strokeStyle = `rgba(197, 160, 89, ${opacity * 0.3})`; // Nobel Gold lines
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'hsl(var(--background))' }}
        />
    );
}
