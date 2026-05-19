-- 由于无法删除 schema，我们逐个删除表
-- 注意：如果表不存在会报错但没关系，我们继续执行

-- 删除所有外层表（从最底层开始）
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS check_ins CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;

-- 删除旧函数
DROP FUNCTION IF EXISTS increment_building_checkins(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS decrement_building_checkins(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS increment_checkin_likes(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS decrement_checkin_likes(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS increment_checkin_comments(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS decrement_checkin_comments(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 删除触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建所有表
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0,
  checkin_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE check_ins (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id BIGINT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  note TEXT,
  image_url VARCHAR(500),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id BIGINT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, building_id)
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_id BIGINT NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, check_in_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_id BIGINT NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  requirement INT NOT NULL,
  type VARCHAR(50) NOT NULL
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  category VARCHAR(50),
  duration INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- 索引
CREATE INDEX idx_check_ins_user ON check_ins(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_comments_check_in ON comments(check_in_id);

-- 启用 RLS
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Anyone can view buildings." ON buildings FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view check-ins." ON check_ins FOR SELECT USING (true);
CREATE POLICY "Users can insert their own check-ins." ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own check-ins." ON check_ins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own check-ins." ON check_ins FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view favorites." ON favorites FOR SELECT USING (true);
CREATE POLICY "Users can manage own favorites." ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view likes." ON likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes." ON likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view comments." ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments." ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments." ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments." ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view course progress." ON course_progress FOR SELECT USING (true);
CREATE POLICY "Users can manage own course progress." ON course_progress FOR ALL USING (auth.uid() = user_id);

-- 种子数据
INSERT INTO buildings (name, location, category, description, image, rating, checkin_count) VALUES
('故宫太和殿', '北京', 'palace', '紫禁城内最大的殿宇，中国现存最大的木结构大殿', '/building-1.jpg', 4.9, 12580),
('拙政园', '苏州', 'garden', '中国四大名园之一，江南园林的代表作品', '/building-2.jpg', 4.8, 8920),
('悬空寺', '山西', 'temple', '悬挂在悬崖峭壁上的千年古寺', '/building-3.jpg', 4.9, 6540),
('福建土楼', '福建', 'folk', '客家传统民居，世界文化遗产', '/building-4.jpg', 4.7, 4320),
('天坛祈年殿', '北京', 'temple', '明清皇帝祭天的场所，中国古代建筑的杰作', '/building-5.jpg', 4.9, 11200),
('大雁塔', '西安', 'tower', '唐代佛教建筑，西安的标志性建筑', '/building-6.jpg', 4.8, 7890);

INSERT INTO achievements (name, description, icon, requirement, type) VALUES
('初探古建', '首次打卡古建', '🏛️', 1, 'checkin'),
('学习达人', '完成5门课程', '📚', 5, 'course'),
('打卡狂人', '打卡10个古建', '📍', 10, 'checkin');

INSERT INTO courses (title, description, cover_image, category, duration) VALUES
('斗拱的奥秘', '探索中国古代建筑特有的结构构件', '/feature-learn.jpg', 'structure', 15),
('榫卯传奇', '不用钉子的中国传统木艺', '/feature-learn.jpg', 'technique', 20),
('屋顶之美', '中国古建筑屋顶的形式与等级', '/feature-learn.jpg', 'design', 12);

-- 函数
CREATE OR REPLACE FUNCTION increment_building_checkins(building_id BIGINT) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN UPDATE buildings SET checkin_count = checkin_count + 1 WHERE id = building_id; END;
$$;

CREATE OR REPLACE FUNCTION increment_checkin_likes(check_in_id BIGINT) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN UPDATE check_ins SET likes_count = likes_count + 1 WHERE id = check_in_id; END;
$$;

CREATE OR REPLACE FUNCTION decrement_checkin_likes(check_in_id BIGINT) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN UPDATE check_ins SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = check_in_id; END;
$$;

CREATE OR REPLACE FUNCTION increment_checkin_comments(check_in_id BIGINT) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN UPDATE check_ins SET comments_count = comments_count + 1 WHERE id = check_in_id; END;
$$;

CREATE OR REPLACE FUNCTION decrement_checkin_comments(check_in_id BIGINT) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN UPDATE check_ins SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = check_in_id; END;
$$;

-- 触发器
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN INSERT INTO profiles (id, username, avatar_url) VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url'); RETURN new; END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('checkins', 'checkins', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Anyone can view checkin images" ON storage.objects FOR SELECT USING (bucket_id = 'checkins');
CREATE POLICY "Users can upload checkin images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'checkins');

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');