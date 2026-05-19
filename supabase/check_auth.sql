-- 启用邮箱认证
-- 在 Supabase Authentication 设置中启用 Email provider

-- 这个 SQL 不能直接启用 provider，但可以帮助诊断

-- 检查用户表
SELECT COUNT(*) as user_count FROM auth.users;

-- 检查最近的注册错误
SELECT id, created_at, email 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;