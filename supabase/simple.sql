-- 最小化版本 - 只创建应用需要的表和功能
-- 跳过 storage 相关（需要特殊权限）

-- 1. 创建 buildings 表
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0,
  checkin_count INT DEFAULT 0
);

-- 2. 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT
);

-- 3. 创建 check_ins 表
CREATE TABLE IF NOT EXISTS check_ins (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE,
  note TEXT,
  image_url VARCHAR(500),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0
);

-- 4. 创建 favorites 表
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE,
  UNIQUE(user_id, building_id)
);

-- 5. 创建 likes 表
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_id BIGINT REFERENCES check_ins(id) ON DELETE CASCADE,
  UNIQUE(user_id, check_in_id)
);

-- 6. 创建 comments 表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_id BIGINT REFERENCES check_ins(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);

-- 7. 创建 achievements 表
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  requirement INT NOT NULL,
  type VARCHAR(50) NOT NULL
);

-- 8. 创建 courses 表
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  category VARCHAR(50),
  duration INT
);

-- 9. 创建 course_progress 表
CREATE TABLE IF NOT EXISTS course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- 启用 RLS
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "buildings_select" ON buildings FOR SELECT USING (true);
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "checkins_select" ON check_ins FOR SELECT USING (true);
CREATE POLICY "checkins_insert" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checkins_update" ON check_ins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "checkins_delete" ON check_ins FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (true);
CREATE POLICY "favorites_all" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "likes_select" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_all" ON likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "course_progress_select" ON course_progress FOR SELECT USING (true);
CREATE POLICY "course_progress_all" ON course_progress FOR ALL USING (auth.uid() = user_id);

-- 插入种子数据
INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '故宫太和殿', '北京', 'palace', '紫禁城内最大的殿宇', '/building-1.jpg', 4.9, 12580
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '故宫太和殿');

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '拙政园', '苏州', 'garden', '中国四大名园之一', '/building-2.jpg', 4.8, 8920
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '拙政园');

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '悬空寺', '山西', 'temple', '悬挂在悬崖峭壁上的千年古寺', '/building-3.jpg', 4.9, 6540
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '悬空寺');

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '福建土楼', '福建', 'folk', '客家传统民居', '/building-4.jpg', 4.7, 4320
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '福建土楼');

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '天坛祈年殿', '北京', 'temple', '明清皇帝祭天的场所', '/building-5.jpg', 4.9, 11200
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '天坛祈年殿');

INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) 
SELECT '大雁塔', '西安', 'tower', '唐代佛教建筑', '/building-6.jpg', 4.8, 7890
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = '大雁塔');

INSERT INTO achievements (name, description, icon, requirement, type)
SELECT '初探古建', '首次打卡古建', '🏛️', 1, 'checkin'
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = '初探古建');

INSERT INTO achievements (name, description, icon, requirement, type)
SELECT '学习达人', '完成5门课程', '📚', 5, 'course'
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = '学习达人');

INSERT INTO achievements (name, description, icon, requirement, type)
SELECT '打卡狂人', '打卡10个古建', '📍', 10, 'checkin'
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = '打卡狂人');

INSERT INTO courses (title, description, cover_image, category, duration)
SELECT '斗拱的奥秘', '探索中国古代建筑特有的结构构件', '/feature-learn.jpg', 'structure', 15
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = '斗拱的奥秘');

INSERT INTO courses (title, description, cover_image, category, duration)
SELECT '榫卯传奇', '不用钉子的中国传统木艺', '/feature-learn.jpg', 'technique', 20
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = '榫卯传奇');

INSERT INTO courses (title, description, cover_image, category, duration)
SELECT '屋顶之美', '中国古建筑屋顶的形式与等级', '/feature-learn.jpg', 'design', 12
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = '屋顶之美');

-- 用户资料触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- 创建触发器（如果不存在）
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (new.email IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();