import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: '张先生',
    role: '建筑爱好者',
    content: '作为一个对中国建筑深感兴趣的人，这款应用让我发现了许多之前不知道的古建瑰宝。界面设计精美，内容专业详实。',
    avatar: '/avatar-1.jpg',
    rating: 5
  },
  {
    name: '李女士',
    role: '旅行达人',
    content: '每次去古城游玩都会用古建智趣打卡，不仅能记录行程，还能学到很多建筑知识，让旅行更有意义。',
    avatar: '/avatar-2.jpg',
    rating: 5
  },
  {
    name: '王同学',
    role: '设计专业学生',
    content: '应用里的榫卯结构图解太棒了！作为设计专业的学生，这些传统智慧给了我很多灵感。',
    avatar: '/avatar-3.jpg',
    rating: 5
  },
  {
    name: '陈先生',
    role: '摄影师',
    content: '通过这款应用发现了很多拍摄古建的好去处，每个地点都有详细的介绍和拍摄建议，非常实用。',
    avatar: '/avatar-4.jpg',
    rating: 5
  },
  {
    name: '赵女士',
    role: '文化工作者',
    content: '古建智趣让传统文化以更年轻的方式呈现，我推荐给了很多朋友，大家都很喜欢。',
    avatar: '/avatar-5.jpg',
    rating: 5
  },
  {
    name: '刘先生',
    role: '历史爱好者',
    content: '终于有一款专注于中国古建的应用了！内容专业，界面优雅，用起来很舒服。',
    avatar: '/avatar-6.jpg',
    rating: 5
  }
];

export default function Testimonials() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(testimonials.length).fill(false));
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
          titleObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (titleRef.current) {
      titleObserver.observe(titleRef.current);
    }

    return () => titleObserver.disconnect();
  }, []);

  useEffect(() => {
    const itemRefs = sectionRef.current?.querySelectorAll('.testimonial-card');
    
    const observers = Array.from(itemRefs || []).map((ref, index) => {
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

      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-500 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1d3557] mb-4">
            用户评价
          </h2>
          <p className="text-lg text-gray-600">
            听听用户们怎么说
          </p>
        </div>

        {/* Testimonials Grid */}
        <div 
          ref={sectionRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => {
            const isVisible = visibleItems[index];
            const rotation = index % 2 === 0 ? -2 : 2;
            
            return (
              <div
                key={index}
                className={`testimonial-card group relative bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-600 hover:shadow-xl hover:-translate-y-2 ${
                  isVisible 
                    ? 'opacity-100 rotate-0' 
                    : `opacity-0 rotate-[${rotation}deg]`
                }`}
                style={{ 
                  transitionTimingFunction: 'var(--ease-architect)',
                  transitionDelay: `${100 + index * 100}ms`,
                  transform: isVisible ? `rotate(0deg)` : `rotateY(-90deg)`
                }}
              >
                {/* Quote Icon */}
                <Quote 
                  className={`absolute top-4 right-4 w-8 h-8 text-[#e63946]/20 transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-12'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-4 h-4 fill-[#e63946] text-[#e63946]"
                      style={{
                        animation: isVisible ? 'pulse-soft 2s ease-in-out infinite' : 'none',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#e63946] transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="font-medium text-[#1d3557]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
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
