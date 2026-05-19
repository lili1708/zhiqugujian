import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

export default function CTA() {
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
      {/* Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-[#e63946] to-[#c1121f] transition-all duration-800 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          transitionTimingFunction: 'var(--ease-ink)',
          backgroundSize: '200% 200%',
          animation: isVisible ? 'gradient-shift 8s ease infinite' : 'none'
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          style={{ animation: isVisible ? 'float 10s ease-in-out infinite' : 'none' }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"
          style={{ animation: isVisible ? 'float 8s ease-in-out infinite reverse' : 'none' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white text-center lg:text-left">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-normal mb-6 transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-brush)',
                transitionDelay: '200ms'
              }}
            >
              立即下载古建智趣
            </h2>
            
            <p 
              className={`text-lg text-white/90 mb-8 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-ink)',
                transitionDelay: '500ms'
              }}
            >
              开启你的古建探索之旅，发现身边的文化瑰宝
            </p>

            {/* Download Buttons */}
            <div 
              className={`flex flex-wrap justify-center lg:justify-start gap-4 transition-all duration-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ 
                transitionTimingFunction: 'var(--ease-elastic)',
                transitionDelay: '700ms'
              }}
            >
              <Button 
                size="lg"
                className="bg-white text-[#e63946] hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.07-3.11-1.05.05-2.31.72-3.06 1.64-.68.84-1.27 2.18-1.11 3.27 1.19.09 2.38-.61 3.1-1.8"/>
                </svg>
                App Store
              </Button>
              <Button 
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 border-2 border-white/30"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div 
            className={`hidden lg:flex justify-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-12 rotate-[45deg]'
            }`}
            style={{ 
              transitionTimingFunction: 'var(--ease-architect)',
              transitionDelay: '400ms'
            }}
          >
            <div className="relative perspective-1000">
              <div 
                className="relative w-[240px] h-[480px] bg-white rounded-[32px] p-2 shadow-2xl preserve-3d"
                style={{ 
                  animation: isVisible ? 'float 5s ease-in-out infinite' : 'none'
                }}
              >
                {/* Phone Frame */}
                <div className="absolute inset-0 rounded-[32px] border-4 border-gray-800 pointer-events-none" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-full" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-gray-50 rounded-[28px] overflow-hidden">
                  {/* App Header */}
                  <div className="bg-[#e63946] px-3 py-2 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm font-medium">古建智趣</div>
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#e63946]/10 rounded-lg p-3 text-center">
                        <div className="text-[#e63946] text-xl font-bold">500+</div>
                        <div className="text-[#e63946]/70 text-xs">古建</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <div className="text-gray-700 text-xl font-bold">10万+</div>
                        <div className="text-gray-500 text-xs">用户</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-16 bg-white rounded-lg shadow-sm p-2 flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#e63946]/20 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-[#e63946]" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-3/4" />
                          <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
                        </div>
                      </div>
                      <div className="h-16 bg-white rounded-lg shadow-sm p-2 flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-2/3" />
                          <div className="h-2 bg-gray-100 rounded w-1/3 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
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
