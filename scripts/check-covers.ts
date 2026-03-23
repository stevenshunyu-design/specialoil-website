import { createClient } from '@supabase/supabase-js';

const client = createClient(
  'https://hcjytmlavmcyzclqkzrj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjanl0bWxhdm1jeXpjbHFrenJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzg2MTIsImV4cCI6MjA4ODYxNDYxMn0.6-uMZlj0yPscOxgIzL-vLN3wwiwktaUeqj2G7u-mDeM'
);

async function check() {
  const { data, error } = await client
    .from('blog_posts')
    .select('id, title, featured_image')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${data?.length || 0} articles:\n`);
  data?.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title.substring(0, 50)}...`);
    console.log(`   Cover: ${a.featured_image || 'NO IMAGE'}\n`);
  });
}

check();
