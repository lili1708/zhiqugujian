-- 创建存储桶的 SQL 脚本
-- 注意：Supabase Storage 存储桶通常通过控制台或 API 创建
-- 此脚本用于记录需要创建的存储桶配置

/*
需要创建的存储桶：

1. buildings - 用于存放古建图片
2. courses-images - 用于存放课程图片  
3. courses-videos - 用于存放课程视频

创建步骤（在 Supabase 控制台中）：
1. 登录 Supabase 控制台
2. 进入 Storage 页面
3. 点击 "Create a new bucket"
4. 依次创建以下存储桶：
   - Name: buildings
   - Name: courses-images  
   - Name: courses-videos
5. 为每个存储桶设置权限：
   - Enable public access (勾选)
   - 或者设置适当的 RLS 策略

存储桶设置建议：
- Public access: 启用（用于前端展示图片/视频）
- File size limit: 根据需求设置
- Allowed mime types: 
  - buildings: image/jpeg, image/png, image/gif
  - courses-images: image/jpeg, image/png, image/gif
  - courses-videos: video/mp4, video/webm
*/

-- 如果需要通过 SQL 管理存储桶权限，可以使用以下方式：
-- 注意：存储桶本身的创建需要通过 API 或控制台

-- 示例：创建存储桶访问策略（需要先创建存储桶）
-- CREATE POLICY "Public access for buildings" ON storage.objects
--   FOR SELECT USING (bucket_id = 'buildings');

-- CREATE POLICY "Allow upload to buildings" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'buildings');
