import { useEffect, useRef, useState } from 'react';

const stats = [
  { number: 500, suffix: '+', label: '精选古建' },
  { number: 10, suffix: '万+', label: '活跃用户' },
  { number: 50, suffix: '+', label: '覆盖城市' },
  { number: 100, suffix: '万+', label: '打卡记录' }
];

function AnimatedNumber({ 
  value, 
  suffix, 
  isVisible 
}: { 
  value: number; 
  suffix: string; 
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-[#e63946] via-[#e63946] to-[#c1121f] transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundSize: '200% 200%',
          animation: isVisible ? 'gradient-shift 8s ease infinite' : 'none'
        }}
      />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-800 ${
                isVisible 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-50'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-elastic)',
                transitionDelay: `${200 + index * 150}ms`
              }}
            >
              <div 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2"
                style={{ 
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  animation: isVisible ? 'pulse-soft 3s ease-in-out infinite' : 'none',
                  animationDelay: `${index * 0.5}s`
                }}
              >
                <AnimatedNumber 
                  value={stat.number} 
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <div className="text-white/80 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Connecting Lines (Desktop) */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 pointer-events-none hidden lg:block"
          viewBox="0 0 1200 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M100,50 Q300,20 500,50 T900,50 T1100,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="8 8"
            className={`transition-all duration-600 ${
              isVisible ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              strokeDashoffset: isVisible ? 0 : 1000,
              transition: 'stroke-dashoffset 1s var(--ease-brush) 800ms'
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
