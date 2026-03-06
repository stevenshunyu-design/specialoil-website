import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // 格式化日期
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-[var(--bg-light)] p-6 rounded-sm transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden mb-6">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mb-3 flex items-center text-sm text-gray-500">
        <span className="text-[var(--accent-600)] mr-3">{post.category}</span>
        <span>{formattedDate}</span>
      </div>
        <h3 className="font-display text-xl font-semibold mb-3 text-[var(--text-dark)] line-clamp-2">
          {post.title}
        </h3>
        <p className="font-body text-[var(--text-body)] mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="font-body text-xs px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/blog/${post.id}`}
          className="inline-block bg-[var(--primary-900)] text-white px-6 py-2 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all"
        >
          Read More
        </Link>
    </div>
  );
};

export default BlogCard;