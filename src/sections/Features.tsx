import { useEffect, useRef, useState } from 'react';
import { Compass, BookOpen, MapPin } from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: '发现古建之美',
    description: '浏览数百座精选古建，从皇家宫殿到民间民居，每座建筑都有详细的图文介绍和专业解读。',
    image: '/feature-explore.jpg',
    reverse: false
  },
  {
    icon: BookOpen,
    title: '学习建筑智慧',
    description: '深入了解榫卯结构、斗拱技艺、飞檐设计等古建精髓，通过互动图解掌握千年匠心。',
    image: '/feature-learn.jpg',
    reverse: true
  },
  {
    icon: MapPin,
    title: '记录文化之旅',
    description: '到访古建，轻松打卡，分享你的见闻与感悟，与古建爱好者交流心得。',
    image: '/feature-checkin.jpg',
    reverse: false
  }
];

export default function Features() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(features.length).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      if (ref) {
        observer.observe(ref);
      }

      return observer;
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1d3557] mb-4">
            核心功能
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            三大核心功能，带你全方位探索中国古建筑的魅力
          </p>
        </div>

        {/* Features */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleItems[index];
            
            return (
              <div
                key={index}
                ref={el => { itemRefs.current[index] = el; }}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  feature.reverse ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image Card */}
                <div 
                  className={`relative group perspective-1000 ${
                    feature.reverse ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div 
                    className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-800 ${
                      isVisible 
                        ? 'opacity-100 translate-x-0 rotate-0' 
                        : `opacity-0 ${feature.reverse ? 'translate-x-12' : '-translate-x-12'} rotate-y-[-30deg]`
                    }`}
                    style={{ 
                      transitionTimingFunction: 'var(--ease-architect)',
                      transform: isVisible ? 'rotateY(0deg)' : `rotateY(${feature.reverse ? '30deg' : '-30deg'})`
                    }}
                  >
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Ink Reveal Overlay */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-[#e63946]/30 to-transparent transition-all duration-1000 ${
                        isVisible ? 'opacity-0' : 'opacity-100'
                      }`}
                      style={{ 
                        clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                        transitionTimingFunction: 'var(--ease-brush)'
                      }}
                    />
                  </div>
                  
                  {/* Floating Icon */}
                  <div 
                    className={`absolute -bottom-6 ${feature.reverse ? '-left-6' : '-right-6'} w-16 h-16 bg-[#e63946] rounded-2xl flex items-center justify-center shadow-lg transition-all duration-400 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'var(--ease-elastic)',
                      transitionDelay: '400ms',
                      animation: isVisible ? 'float 4s ease-in-out infinite' : 'none'
                    }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Text Card */}
                <div 
                  className={`${feature.reverse ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div 
                    className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-600 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'var(--ease-ink)',
                      transitionDelay: '200ms'
                    }}
                  >
                    <h3 className="text-2xl sm:text-3xl text-[#1d3557] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Decorative Line */}
                    <div 
                      className={`mt-6 h-1 bg-gradient-to-r from-[#e63946] to-[#e63946]/30 rounded-full transition-all duration-500 ${
                        isVisible ? 'w-full' : 'w-0'
                      }`}
                      style={{ 
                        transitionTimingFunction: 'var(--ease-brush)',
                        transitionDelay: '500ms'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
