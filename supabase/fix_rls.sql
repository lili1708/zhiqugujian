-- 修复管理后台的数据库操作权限
-- 添加 buildings 表的写权限
CREATE POLICY "Admin can insert buildings" ON buildings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update buildings" ON buildings FOR UPDATE USING (true);
CREATE POLICY "Admin can delete buildings" ON buildings FOR DELETE USING (true);

-- 添加 courses 表的写权限
CREATE POLICY "Admin can insert courses" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update courses" ON courses FOR UPDATE USING (true);
CREATE POLICY "Admin can delete courses" ON courses FOR DELETE USING (true);

-- 添加 posts 表的写权限（用于内容审核）
CREATE POLICY "Admin can update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Admin can delete posts" ON posts FOR DELETE USING (true);

-- 添加 profiles 表的读权限（用于用户管理）
CREATE POLICY "Admin can view profiles" ON profiles FOR SELECT USING (true);
