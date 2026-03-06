import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity 客户端配置
// 您需要在 .env 文件中设置 VITE_SANITY_PROJECT_ID
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // 使用 CDN 加速内容获取
});

// 图片 URL 构建器
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ 查询语句
export const queries = {
  // 获取所有博客文章
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "category": category->title,
    "tags": tags[]->title,
    featuredImage,
    publishedAt,
    author
  }`,
  
  // 获取单篇博客文章
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    "category": category->title,
    "tags": tags[]->title,
    featuredImage,
    publishedAt,
    author
  }`,
  
  // 获取所有分类
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug
  }`,
  
  // 按分类获取文章
  postsByCategory: `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "category": category->title,
    "tags": tags[]->title,
    featuredImage,
    publishedAt,
    author
  }`,
  
  // 搜索文章
  searchPosts: `*[_type == "post" && (title match $searchTerm || excerpt match $searchTerm || content match $searchTerm)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "category": category->title,
    "tags": tags[]->title,
    featuredImage,
    publishedAt,
    author
  }`
};
