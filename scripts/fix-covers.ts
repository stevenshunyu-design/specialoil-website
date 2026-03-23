/**
 * 更新博客封面图为有效的 Unsplash 图片
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseKey);

// 经过验证的有效 Unsplash 图片（工业/石油主题）
const validCoverImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop', // 工业润滑
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop', // 石油设施
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=450&fit=crop', // 工业管道
];

async function updateCovers() {
  console.log('🔄 Updating blog post cover images with valid URLs...\n');

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
    const newCover = validCoverImages[i % validCoverImages.length];

    console.log(`📝 Updating: ${article.title.substring(0, 50)}...`);
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

  console.log('✨ Done!');
}

updateCovers().catch(console.error);
