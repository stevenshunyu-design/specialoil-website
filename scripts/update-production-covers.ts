/**
 * 更新生产环境博客文章封面图
 * 将 Coze 内部存储的图片替换为公开可访问的 Unsplash 图片
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseKey);

// 公开可访问的封面图（Unsplash - 工业/石油主题）
const publicCoverImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop', // 工业设施
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop', // 石油管道
  'https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=800&h=450&fit=crop', // 工厂
];

async function updateCovers() {
  console.log('🔄 Updating blog post cover images for production...\n');

  // 获取需要更新的文章
  const { data: articles, error: fetchError } = await client
    .from('blog_posts')
    .select('id, title, featured_image')
    .order('created_at', { ascending: false })
    .limit(3);

  if (fetchError) {
    console.error('❌ Failed to fetch articles:', fetchError);
    process.exit(1);
  }

  console.log(`📋 Found ${articles?.length || 0} articles to update\n`);

  if (!articles || articles.length === 0) {
    console.log('⚠️ No articles found');
    return;
  }

  // 更新每篇文章的封面图
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const newCover = publicCoverImages[i % publicCoverImages.length];

    console.log(`📝 Updating: ${article.title.substring(0, 50)}...`);
    console.log(`   Old: ${article.featured_image?.substring(0, 60)}...`);
    console.log(`   New: ${newCover}`);

    const { error: updateError } = await client
      .from('blog_posts')
      .update({ featured_image: newCover })
      .eq('id', article.id);

    if (updateError) {
      console.error(`   ❌ Failed: ${updateError.message}\n`);
    } else {
      console.log(`   ✅ Updated successfully\n`);
    }
  }

  // 验证更新
  console.log('🔍 Verifying updates...');
  const { data: updated } = await client
    .from('blog_posts')
    .select('id, title, featured_image')
    .order('created_at', { ascending: false })
    .limit(3);

  updated?.forEach((article, i) => {
    console.log(`\n${i + 1}. ${article.title.substring(0, 50)}...`);
    console.log(`   Cover: ${article.featured_image}`);
  });

  console.log('\n✨ Done!');
}

updateCovers().catch(console.error);
