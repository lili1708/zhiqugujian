import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Download, ChevronRight } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      {/* Background Image */}
      <div 
        className={`absolute inset-0 transition-all duration-1200 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-ink)' }}
      >
        <img 
          src="/hero-bg.jpg" 
          alt="中国古代建筑" 
          className="w-full h-full object-cover"
        />
        {/* Ink Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-[#e63946]/80 via-[#e63946]/50 to-transparent transition-all duration-800 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transitionTimingFunction: 'var(--ease-brush)',
            transitionDelay: '300ms'
          }}
        />
      </div>

      {/* Floating Decorative Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white/20 animate-float transition-all duration-400 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              width: `${8 + i * 3}px`,
              height: `${8 + i * 3}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`,
              transitionTimingFunction: 'var(--ease-elastic)',
              transitionDelay: `${1400 + i * 100}ms`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-16 xl:px-24 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h1 
                className={`text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide transition-all duration-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-ink)',
                  transitionDelay: '400ms'
                }}
              >
                发现
              </h1>
              <h1 
                className={`text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-brush)',
                  transitionDelay: '700ms'
                }}
              >
                古建智慧
              </h1>
            </div>

            {/* Subtitle */}
            <p 
              className={`text-lg sm:text-xl text-white/90 max-w-lg leading-relaxed transition-all duration-500 ${
                isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-reveal)',
                transitionDelay: '1000ms'
              }}
            >
              探索中国古代建筑的精妙结构，分享你的文化打卡之旅
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-wrap gap-4 transition-all duration-600 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-elastic)',
                transitionDelay: '1200ms'
              }}
            >
              <Button 
                size="lg"
                className="bg-white text-[#e63946] hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                立即下载
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                观看视频
              </Button>
            </div>

            {/* App Store Badges */}
            <div 
              className={`flex gap-4 pt-4 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-ink)',
                transitionDelay: '1400ms'
              }}
            >
              <div className="bg-black/80 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-black/90 transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.07-3.11-1.05.05-2.31.72-3.06 1.64-.68.84-1.27 2.18-1.11 3.27 1.19.09 2.38-.61 3.1-1.8"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/80">Download on the</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </div>
              <div className="bg-black/80 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-black/90 transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/80">GET IT ON</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div 
            className={`hidden lg:flex justify-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-24 rotate-[25deg]'
            }`}
            style={{ 
              transitionTimingFunction: 'var(--ease-architect)',
              transitionDelay: '800ms'
            }}
          >
            <div className="relative perspective-1000">
              <div 
                className="relative w-[280px] h-[560px] bg-white rounded-[40px] p-3 shadow-2xl animate-float preserve-3d"
                style={{ animationDuration: '6s' }}
              >
                {/* Phone Frame */}
                <div className="absolute inset-0 rounded-[40px] border-8 border-gray-800 pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-full" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-gray-50 rounded-[32px] overflow-hidden">
                  {/* App Header */}
                  <div className="bg-[#e63946] px-4 py-3 pt-8">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">古建智趣</div>
                      <div className="w-8 h-8 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src="/feature-explore.jpg" 
                        alt="太和殿" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="text-white font-medium">太和殿</div>
                        <div className="text-white/80 text-xs">故宫博物院</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1 h-20 bg-[#e63946]/10 rounded-lg flex items-center justify-center">
                        <span className="text-[#e63946] text-xs">打卡</span>
                      </div>
                      <div className="flex-1 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">分享</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1600ms' }}
      >
        <div className="flex flex-col items-center text-white/80 animate-bounce">
          <span className="text-sm mb-2">向下滚动</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </div>
    </section>
  );
}
