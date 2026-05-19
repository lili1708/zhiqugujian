import { useEffect, useRef, useState } from 'react';

export default function About() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words1 = "古建智趣是一款专注于中国古代建筑文化的移动应用。我们通过数字化技术，将千年建筑智慧呈现于指尖。".split('');
  const words2 = "从榫卯结构到飞檐斗拱，从宫殿庙宇到园林民居，带你领略中华建筑的独特魅力。".split('');
  const words3 = "在这里，你可以探索古建的精妙之处，记录你的文化之旅，与志同道合的朋友分享心得。".split('');

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Decorative Line */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 Q400,50 800,150 T1600,100"
          fill="none"
          stroke="#e63946"
          strokeWidth="1"
          strokeDasharray="8 8"
          className={`transition-all duration-800 ${
            isVisible ? 'opacity-20' : 'opacity-0'
          }`}
          style={{ 
            strokeDashoffset: isVisible ? 0 : 1000,
            transition: 'stroke-dashoffset 1.5s var(--ease-architect)'
          }}
        />
      </svg>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Title */}
        <h2 
          className={`text-3xl sm:text-4xl lg:text-5xl text-[#1d3557] mb-12 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-ink)' }}
        >
          关于古建智趣
        </h2>

        {/* Content with staggered word reveal */}
        <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-gray-700">
          <p className="overflow-hidden">
            {words1.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-brush)',
                  transitionDelay: `${200 + i * 30}ms`
                }}
              >
                {char}
              </span>
            ))}
          </p>
          
          <p 
            className={`pl-0 sm:pl-8 overflow-hidden transition-all duration-400 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              transitionTimingFunction: 'var(--ease-brush)',
              transitionDelay: '400ms'
            }}
          >
            {words2.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-brush)',
                  transitionDelay: `${400 + i * 30}ms`
                }}
              >
                {char}
              </span>
            ))}
          </p>
          
          <p 
            className={`pl-0 sm:pl-16 overflow-hidden transition-all duration-400 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              transitionTimingFunction: 'var(--ease-brush)',
              transitionDelay: '600ms'
            }}
          >
            {words3.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-brush)',
                  transitionDelay: `${600 + i * 30}ms`
                }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* Decorative Elements */}
        <div 
          className={`mt-16 flex items-center gap-4 transition-all duration-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transitionTimingFunction: 'var(--ease-brush)',
            transitionDelay: '800ms'
          }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-[#e63946] to-transparent" />
          <div className="w-3 h-3 rounded-full bg-[#e63946] animate-pulse" />
          <div className="h-px flex-1 bg-gradient-to-l from-[#e63946] to-transparent" />
        </div>
      </div>
    </section>
  );
}
