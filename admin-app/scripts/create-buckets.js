import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量获取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('请先设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket(bucketName, options = {}) {
  try {
    console.log(`正在创建存储桶: ${bucketName}`);
    
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      ...options
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`存储桶 ${bucketName} 已存在，跳过`);
        return true;
      }
      throw error;
    }
    
    console.log(`存储桶 ${bucketName} 创建成功`);
    return true;
  } catch (err) {
    console.error(`创建存储桶 ${bucketName} 失败:`, err.message);
    return false;
  }
}

async function main() {
  console.log('开始创建存储桶...\n');
  
  const buckets = [
    { name: 'buildings', options: { allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'] } },
    { name: 'courses-images', options: { allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'] } },
    { name: 'courses-videos', options: { allowedMimeTypes: ['video/mp4', 'video/webm'] } }
  ];
  
  let successCount = 0;
  for (const bucket of buckets) {
    const success = await createBucket(bucket.name, bucket.options);
    if (success) successCount++;
    console.log('');
  }
  
  console.log(`\n创建完成！成功创建 ${successCount}/${buckets.length} 个存储桶`);
  
  // 验证存储桶是否存在
  console.log('\n验证存储桶列表:');
  const { data: bucketsList } = await supabase.storage.listBuckets();
  bucketsList.forEach(bucket => {
    console.log(`- ${bucket.name} (公共: ${bucket.public})`);
  });
}

main().catch(err => {
  console.error('执行失败:', err);
  process.exit(1);
});