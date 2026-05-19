-- 添加 email 和 password_hash 列到 profiles 表
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);