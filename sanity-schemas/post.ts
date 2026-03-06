// Sanity Schema 定义
// 将这些 Schema 复制到您的 Sanity Studio 项目中

// ============================================
// 1. 文章 Schema (post.ts)
// ============================================
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary of the article (shown in blog listing)'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'category' },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'tag' }
        }
      ]
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
      date: 'publishedAt'
    },
    prepare(selection: any) {
      const { title, author, media, date } = selection
      return {
        title,
        subtitle: `By ${author || 'Unknown'} • ${new Date(date).toLocaleDateString()}`,
        media
      }
    }
  }
}

// ============================================
// 2. 分类 Schema (category.ts)
// ============================================
export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}

// ============================================
// 3. 标签 Schema (tag.ts)
// ============================================
export const tagSchema = {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }
  ]
}

// ============================================
// 预设分类数据
// ============================================
const categories = [
  { title: 'Industry News', slug: { current: 'industry-news' }, description: 'Industry news and market updates' },
  { title: 'Technical Information', slug: { current: 'technical-information' }, description: 'Technical guides and product specifications' },
  { title: 'Market Analysis', slug: { current: 'market-analysis' }, description: 'Market research and analysis' },
  { title: 'Product Updates', slug: { current: 'product-updates' }, description: 'New product announcements and updates' }
]

// ============================================
// 预设标签数据
// ============================================
const tags = [
  'Market Report', 'China', 'Special Oil', 'Export Data', '2025 Forecast',
  'Transformer Oil', 'Export', 'Sinopec', 'Singapore', 'Breakthrough',
  'Technical Standards', 'IEC 60296', 'ASTM D3487', 'Quality',
  'Sustainability', 'Bio-based Oil', 'Green Technology', 'Carbon Reduction',
  'Rubber Process Oil', 'Naphthenic Oil', 'TDAE', 'REACH Compliance',
  'White Oil', 'Mineral Oil', 'Food Grade', 'Pharmaceutical', 'USP',
  'Hydraulic Oil', 'Anti-wear', 'DIN 51524', 'Industrial Lubricants',
  'Regulations', 'REACH', 'EPA', 'Compliance', 'Export Requirements'
]
