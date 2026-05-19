# 智取古建 - 历史文化建筑打卡应用

基于 React + TypeScript + Vite 构建的Web应用，用于历史文化建筑的探索与打卡。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 7
- **样式方案**: Tailwind CSS 3.4 (shadcn/ui 主题)
- **UI组件库**: shadcn/ui (40+ 组件)
- **开发工具**: ESLint

## 项目结构

```
├── public/                  # 静态资源（图片）
├── src/
│   ├── components/          # UI 组件
│   │   └── ui/              # shadcn/ui 组件
│   ├── sections/            # 页面区块
│   │   ├── Hero.tsx         # 首屏区域
│   │   ├── Navigation.tsx   # 导航
│   │   ├── Footer.tsx       # 页脚
│   │   ├── Features.tsx     # 功能介绍
│   │   ├── About.tsx        # 关于我们
│   │   ├── CTA.tsx          # 行动召唤
│   │   ├── Testimonials.tsx # 用户评价
│   │   └── Statistics.tsx    # 统计数据
│   ├── pages/               # 页面
│   │   ├── Home.tsx         # 首页
│   │   ├── Profile.tsx      # 个人中心
│   │   ├── Learn.tsx       # 学习探索
│   │   └── CheckIn.tsx     # 打卡
│   ├── hooks/               # 自定义 Hooks
│   ├── lib/                 # 工具函数
│   ├── App.tsx              # 根组件
│   ├── App.css              # 应用样式
│   ├── index.css            # 全局样式
│   └── main.tsx             # 入口文件
├── index.html               # HTML 入口
├── tailwind.config.js       # Tailwind 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 依赖管理
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 使用组件

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
```