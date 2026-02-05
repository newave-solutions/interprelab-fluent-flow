import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, GraduationCap, HandMetal, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

import interpretestBot from "/interpretest-bot.png";
import interprecoachBot from "/interprecoach-bot.png";
import interprestudyBot from "/interprestudy-bot.png";

const cards = [
  {
    id: 1,
    title: 'InterpreTest',
    subtitle: 'Skills Assessment',
    description: 'AI-powered evaluation with personalized feedback',
    icon: Bot,
    imageSrc: interpretestBot,
    gradient: 'from-nobel-gold/20 to-amber-500/20',
    route: '/interpretest',
    features: ['Real-time Assessment', 'Detailed Feedback']
  },
  {
    id: 2,
    title: 'InterpreCoach',
    subtitle: 'Real-Time Assistant',
    description: 'Your AI co-pilot during live interpretation calls',
    icon: Brain,
    imageSrc: interprecoachBot,
    gradient: 'from-yellow-600/20 to-nobel-gold/20',
    route: '/interprecoach',
    features: ['Live Assistance', 'Smart Terminology']
  },
  {
    id: 3,
    title: 'InterpreStudy',
    subtitle: 'Personalized Learning',
    description: 'AI-curated training paths for your goals',
    icon: GraduationCap,
    imageSrc: interprestudyBot,
    gradient: 'from-amber-600/20 to-yellow-500/20',
    route: '/interprestudy',
    features: ['Custom Learning', 'Skill Mastery']
  },
  {
    id: 4,
    title: 'InterpreSigns',
    subtitle: 'ASL Learning',
    description: 'Interactive ASL training with AI feedback',
    icon: HandMetal,
    imageSrc: null,
    gradient: 'from-amber-500/20 to-nobel-gold/20',
    route: '/interpresigns',
    features: ['Sign Recognition', 'AI Feedback']
  },
  {
    id: 5,
    title: 'Certification',
    subtitle: 'NBCMI & CCHI Approved',
    description: '40-60 hour approved training courses',
    icon: Award,
    imageSrc: null,
    gradient: 'from-yellow-500/20 to-amber-600/20',
    route: '/courses',
    features: ['NBCMI Approved', 'CCHI Approved']
  },
];

export default function CardStackStacked() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const getCardStyle = (index: number) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    
    if (position === 0) {
      return { scale: 1, y: 0, zIndex: 50, opacity: 1, rotateX: 0 };
    } else if (position === 1) {
      return { scale: 0.95, y: -20, zIndex: 40, opacity: 0.7, rotateX: 2 };
    } else if (position === 2) {
      return { scale: 0.9, y: -40, zIndex: 30, opacity: 0.4, rotateX: 4 };
    } else {
      return { scale: 0.85, y: -60, zIndex: 20, opacity: 0, rotateX: 6 };
    }
  };

  return (
    <div
      className="relative w-full max-w-sm h-[420px] flex items-end justify-center"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const style = getCardStyle(index);

          return (
            <Link key={card.id} to={card.route} className="absolute bottom-0 w-full">
              <motion.div
                className="w-full h-[380px] rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  transformStyle: 'preserve-3d',
                  border: '2px solid hsl(var(--nobel-gold) / 0.6)',
                  boxShadow: style.zIndex === 50 
                    ? '0 20px 60px rgba(197, 160, 89, 0.3), 0 10px 30px rgba(0, 0, 0, 0.4)'
                    : '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
                initial={false}
                animate={{
                  scale: style.scale,
                  y: style.y,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  rotateX: style.rotateX,
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                whileHover={style.zIndex === 50 ? { scale: 1.02 } : {}}
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} backdrop-blur-xl`} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col items-center justify-between text-center">
                  {/* Image/Icon */}
                  <div className="flex-1 flex items-center justify-center">
                    {card.imageSrc ? (
                      <img
                        src={card.imageSrc}
                        alt={`${card.title} Bot`}
                        className="w-28 h-28 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'drop-shadow(0 8px 20px hsl(var(--nobel-gold) / 0.4))' }}
                      />
                    ) : (
                      <Icon
                        className="w-24 h-24 text-nobel-gold group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'drop-shadow(0 8px 20px hsl(var(--nobel-gold) / 0.5))' }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="w-full space-y-2">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white group-hover:text-nobel-gold transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm font-semibold text-nobel-gold">{card.subtitle}</p>
                    <p className="text-xs text-white/70 line-clamp-2">{card.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      {card.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white/90"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-nobel-gold shadow-[0_0_8px_hsl(var(--nobel-gold))]'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
