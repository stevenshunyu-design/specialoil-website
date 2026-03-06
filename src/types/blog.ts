import React from 'react';
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  publishedAt: string;
  author: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  role: 'admin';
}