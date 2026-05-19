-- 添加帖子表支持社区动态
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[],
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved posts." ON posts 
FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own posts." ON posts 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts." ON posts 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts." ON posts 
FOR DELETE USING (auth.uid() = user_id);

-- Admin can manage posts
CREATE POLICY "Admin can manage all posts." ON posts 
FOR ALL USING (true);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
