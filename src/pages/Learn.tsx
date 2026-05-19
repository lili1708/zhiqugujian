import { useState } from 'react';
import { BookOpen, ChevronRight, Play, CheckCircle, Star, Loader2 } from 'lucide-react';
import { useCourses, useCourseProgress, useCourseCategories } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';

const CATEGORY_MAP: Record<string, string> = {
  structure: '建筑结构',
  technique: '工艺技术',
  design: '设计艺术',
  decoration: '装饰艺术',
  history: '历史沿革',
  culture: '文化内涵',
  craft: '工艺技术'
}

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [learningStep, setLearningStep] = useState(0);
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const { courses, loading } = useCourses(activeCategory === 'all' ? undefined : activeCategory)
  const { progressMap, loading: progressLoading, getProgress, updateProgress, completedCount } = useCourseProgress()
  const categories = useCourseCategories()

  const totalProgress = courses.length > 0
    ? Math.round(Array.from(progressMap.values()).reduce((sum, p) => sum + p.progress, 0) / courses.length)
    : 0

  const handleStartLearning = async (course: Course) => {
    if (!user) {
      navigate('/auth')
      return
    }
    setSelectedCourse(course)
    setLearningStep(0)
  }

  const handleContinueLearning = async () => {
    if (!user) return
    
    const newProgress = Math.min((learningStep + 1) / contentMap[selectedCourse?.id || 1].length * 100, 100)
    await updateProgress(selectedCourse!.id, newProgress)
    
    if (learningStep < (contentMap[selectedCourse?.id || 1].length - 1)) {
      setLearningStep(prev => prev + 1)
    } else {
      await updateProgress(selectedCourse!.id, 100)
      setSelectedCourse(null)
      setLearningStep(0)
    }
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-gradient-to-br from-[#e63946] to-[#c1121f] text-white px-4 py-6">
        <h1 className="text-xl font-bold mb-1">知识学习</h1>
        <p className="text-white/80 text-sm">探索千年建筑智慧</p>
        
        {/* Progress Card */}
        <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">学习进度</span>
            </div>
            <span className="text-2xl font-bold">{totalProgress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-white/70">
            <span>已完成 {completedCount}/{courses.length} 门课程</span>
            <span>{completedCount} 证书</span>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-[#e63946] text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            全部课程
          </button>
          {categories.map((cat) => (
            cat.count > 0 && (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#e63946] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            )
          ))}
        </div>
      </section>

      {/* Course List */}
      <section className="px-4">
        <h2 className="text-lg font-bold text-[#1d3557] mb-3">
          {activeCategory === 'all' ? '全部课程' : CATEGORY_MAP[activeCategory] || activeCategory}
        </h2>
        
        {loading || progressLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#e63946]" />
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => {
              const progress = getProgress(course.id)
              const progressValue = progress?.progress || 0
              const isCompleted = progress?.completed || false
              
              return (
                <div
                  key={course.id}
                  onClick={() => handleStartLearning(course)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={course.cover_image || '/feature-learn.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {isCompleted && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                      {progressValue === 0 && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-[#1d3557] text-sm">{course.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            course.duration <= 15 ? 'bg-green-100 text-green-600' :
                            course.duration <= 25 ? 'bg-amber-100 text-amber-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {course.duration <= 15 ? '初级' : course.duration <= 25 ? '中级' : '高级'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{course.duration}分钟</span>
                        {progressValue > 0 && progressValue < 100 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#e63946] rounded-full"
                                style={{ width: `${progressValue}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#e63946]">{progressValue}%</span>
                          </div>
                        ) : isCompleted ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> 已完成
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            开始学习 <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedCourse(null)}
        >
          <div 
            className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <img
              src={selectedCourse.cover_image || '/feature-learn.jpg'}
              alt={selectedCourse.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-bold text-[#1d3557] mb-2">{selectedCourse.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{selectedCourse.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm">
                  {selectedCourse.duration <= 15 ? '初级' : selectedCourse.duration <= 25 ? '中级' : '高级'}
                </span>
              </div>
              <div className="text-sm text-gray-500">{selectedCourse.duration}分钟</div>
              {getProgress(selectedCourse.id) && (
                <div className="text-sm text-[#e63946]">
                  已学习 {getProgress(selectedCourse.id)?.progress || 0}%
                </div>
              )}
            </div>

            <CourseContent courseId={selectedCourse.id} />

            <button 
              className="w-full py-3 bg-[#e63946] text-white rounded-xl font-medium hover:bg-[#c1121f] transition-colors mt-4"
              onClick={handleContinueLearning}
            >
              {learningStep < (contentMap[selectedCourse?.id || 1].length - 1) ? '下一节' : '完成学习'}
            </button>

            <button 
              className="w-full py-2 mt-2 text-gray-500 text-sm"
              onClick={() => { setSelectedCourse(null); setLearningStep(0) }}
            >
              关闭窗口
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const contentMap: Record<number, string[]> = {
  1: [
    '斗拱是中国古代建筑特有的结构构件',
    '它位于柱与梁之间，由弓形横木和方形斗形木块组成',
    '斗拱不仅具有结构作用，还具有装饰功能',
    '不同朝代的斗拱形式各有特色'
  ],
  2: [
    '榫卯是中国传统木作的精华',
    '不用一颗钉子就能牢固连接木构件',
    '常见的榫卯形式有直榫、燕尾榫、插肩榫等',
    '榫卯结构体现了中国古代的力学智慧'
  ],
  3: [
    '中国古建筑屋顶形式多样',
    '等级从高到低依次为庑殿、歇山、悬山、硬山',
    '飞檐是屋顶的重要装饰构件',
    '琉璃瓦最初用于皇家建筑'
  ],
  4: [
    '和玺彩画是最高等级的彩画',
    '旋子彩画次之，苏式彩画多用于园林',
    '彩画不仅美观，还有保护木材的作用',
    '不同的纹样有不同的寓意'
  ],
  5: [
    '门窗是中国建筑的重要组成部分',
    '格扇门又称隔扇，既可分隔空间又可采光',
    '窗棂纹样丰富，有步步锦、冰裂纹等',
    '门窗的雕刻工艺十分精湛'
  ]
}

function CourseContent({ courseId }: { courseId: number }) {
  const content = contentMap[courseId] || ['暂无课程内容']

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-[#1d3557]">课程内容</h3>
      {content.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#e63946]/10 text-[#e63946] flex items-center justify-center text-sm flex-shrink-0">
            {index + 1}
          </div>
          <p className="text-sm text-gray-600">{item}</p>
        </div>
      ))}
    </div>
  )
}
