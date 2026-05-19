import { NavLink } from 'react-router-dom';
import { Compass, BookOpen, Users, User, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: '探索', icon: Compass },
  { path: '/learn', label: '学习', icon: BookOpen },
  { path: '/checkin', label: '社区', icon: Users },
  { path: '/profile', label: '我的', icon: User }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full transition-colors duration-300 ${
                  isActive 
                    ? 'text-[#e63946]' 
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-[#e63946]/10' : ''
                  }`}>
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : ''
                    }`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e63946] rounded-full" />
                    )}
                  </div>
                  <span className={`text-xs mt-0.5 font-medium transition-all duration-300 ${
                    isActive ? 'scale-105' : ''
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
