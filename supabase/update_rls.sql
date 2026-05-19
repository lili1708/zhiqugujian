-- 更新 RLS 策略以允许管理后台操作
-- 对于管理后台功能，需要允许匿名用户进行写操作

-- buildings 表
DROP POLICY IF EXISTS "Admin can insert buildings" ON buildings;
DROP POLICY IF EXISTS "Admin can update buildings" ON buildings;
DROP POLICY IF EXISTS "Admin can delete buildings" ON buildings;

CREATE POLICY "Allow all on buildings" ON buildings FOR ALL USING (true);

-- courses 表
DROP POLICY IF EXISTS "Admin can insert courses" ON courses;
DROP POLICY IF EXISTS "Admin can update courses" ON courses;
DROP POLICY IF EXISTS "Admin can delete courses" ON courses;

CREATE POLICY "Allow all on courses" ON courses FOR ALL USING (true);

-- posts 表
DROP POLICY IF EXISTS "Admin can update posts" ON posts;
DROP POLICY IF EXISTS "Admin can delete posts" ON posts;

CREATE POLICY "Allow all on posts" ON posts FOR ALL USING (true);

-- profiles 表（用于用户管理）
DROP POLICY IF EXISTS "Admin can view profiles" ON profiles;
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true);
