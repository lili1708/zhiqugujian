-- 超级安全版本 - 检查表是否存在再创建
-- 这个脚本会先检查表是否已存在，避免冲突

-- 检查并创建 buildings 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'buildings') THEN
    CREATE TABLE buildings (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      image VARCHAR(500),
      rating DECIMAL(2,1) DEFAULT 0,
      checkin_count INT DEFAULT 0
    );
  END IF;
END $$;

-- 检查并创建 profiles 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username VARCHAR(100),
      avatar_url VARCHAR(500),
      bio TEXT
    );
  END IF;
END $$;

-- 检查并创建 check_ins 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'check_ins') THEN
    CREATE TABLE check_ins (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE,
      note TEXT,
      image_url VARCHAR(500),
      likes_count INT DEFAULT 0,
      comments_count INT DEFAULT 0
    );
  END IF;
END $$;

-- 检查并创建 favorites 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
    CREATE TABLE favorites (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE,
      UNIQUE(user_id, building_id)
    );
  END IF;
END $$;

-- 检查并创建 likes 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes') THEN
    CREATE TABLE likes (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      check_in_id BIGINT REFERENCES check_ins(id) ON DELETE CASCADE,
      UNIQUE(user_id, check_in_id)
    );
  END IF;
END $$;

-- 检查并创建 comments 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      check_in_id BIGINT REFERENCES check_ins(id) ON DELETE CASCADE,
      content TEXT NOT NULL
    );
  END IF;
END $$;

-- 检查并创建 achievements 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'achievements') THEN
    CREATE TABLE achievements (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      icon VARCHAR(50),
      requirement INT NOT NULL,
      type VARCHAR(50) NOT NULL
    );
  END IF;
END $$;

-- 检查并创建 courses 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses') THEN
    CREATE TABLE courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      cover_image VARCHAR(500),
      category VARCHAR(50),
      duration INT
    );
  END IF;
END $$;

-- 检查并创建 course_progress 表
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_progress') THEN
    CREATE TABLE course_progress (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
      progress INT DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE,
      UNIQUE(user_id, course_id)
    );
  END IF;
END $$;

-- 启用 RLS（仅对有权限的表）
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'buildings') THEN
    ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'check_ins') THEN
    ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes') THEN
    ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
    ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_progress') THEN
    ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 插入种子数据（使用 INSERT...ON CONFLICT 或检查是否存在）
INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('故宫太和殿', '北京', 'palace', '紫禁城内最大的殿宇', '/building-1.jpg', 4.9, 12580)
ON CONFLICT DO NOTHING;

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('拙政园', '苏州', 'garden', '中国四大名园之一', '/building-2.jpg', 4.8, 8920)
ON CONFLICT DO NOTHING;

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('悬空寺', '山西', 'temple', '悬挂在悬崖峭壁上的千年古寺', '/building-3.jpg', 4.9, 6540)
ON CONFLICT DO NOTHING;

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('福建土楼', '福建', 'folk', '客家传统民居', '/building-4.jpg', 4.7, 4320)
ON CONFLICT DO NOTHING;

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('天坛祈年殿', '北京', 'temple', '明清皇帝祭天的场所', '/building-5.jpg', 4.9, 11200)
ON CONFLICT DO NOTHING;

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
VALUES ('大雁塔', '西安', 'tower', '唐代佛教建筑', '/building-6.jpg', 4.8, 7890)
ON CONFLICT DO NOTHING;

INSERT INTO achievements (name, description, icon, requirement, type)
VALUES ('初探古建', '首次打卡古建', '🏛️', 1, 'checkin')
ON CONFLICT DO NOTHING;

INSERT INTO achievements (name, description, icon, requirement, type)
VALUES ('学习达人', '完成5门课程', '📚', 5, 'course')
ON CONFLICT DO NOTHING;

INSERT INTO achievements (name, description, icon, requirement, type)
VALUES ('打卡狂人', '打卡10个古建', '📍', 10, 'checkin')
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, cover_image, category, duration)
VALUES ('斗拱的奥秘', '探索中国古代建筑特有的结构构件', '/feature-learn.jpg', 'structure', 15)
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, cover_image, category, duration)
VALUES ('榫卯传奇', '不用钉子的中国传统木艺', '/feature-learn.jpg', 'technique', 20)
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, cover_image, category, duration)
VALUES ('屋顶之美', '中国古建筑屋顶的形式与等级', '/feature-learn.jpg', 'design', 12)
ON CONFLICT DO NOTHING;

-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- 检查触发器是否存在，不存在则创建
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;