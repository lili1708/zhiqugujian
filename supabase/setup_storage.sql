-- Supabase Storage 存储桶设置脚本
-- 需要先在 Supabase 控制台中手动创建存储桶

/*
在 Supabase 控制台中创建存储桶的步骤：

1. 登录 Supabase 控制台：https://supabase.com/dashboard
2. 进入你的项目：mgvqbgevkhcteawehzag
3. 点击左侧菜单的 "Storage"
4. 点击 "Create a new bucket"
5. 创建以下三个存储桶：

存储桶 1:
- Name: buildings
- Public access: 启用 (Enable public access)
- Click "Create bucket"

存储桶 2:
- Name: courses-images
- Public access: 启用
- Click "Create bucket"

存储桶 3:
- Name: courses-videos
- Public access: 启用
- Click "Create bucket"

创建完成后，运行以下 SQL 脚本设置访问权限：
*/

-- 为存储桶创建访问策略

-- buildings 存储桶
CREATE POLICY "Allow public read access to buildings"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'buildings');

CREATE POLICY "Allow authenticated write access to buildings"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'buildings');

-- courses-images 存储桶
CREATE POLICY "Allow public read access to courses-images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'courses-images');

CREATE POLICY "Allow authenticated write access to courses-images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'courses-images');

-- courses-videos 存储桶
CREATE POLICY "Allow public read access to courses-videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'courses-videos');

CREATE POLICY "Allow authenticated write access to courses-videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'courses-videos');

-- 验证策略创建成功
SELECT * FROM pg_policies WHERE schemaname = 'storage';
