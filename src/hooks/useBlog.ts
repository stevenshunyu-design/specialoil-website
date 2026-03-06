import React from 'react';
import { useState, useEffect } from 'react';
import { BlogPost, AdminUser } from '../types/blog';

  // 模拟数据 - 默认博客文章
  const defaultBlogPosts: BlogPost[] = [
    {
      id: '1',
      title: '2026 China Special Oil Market Report: Production Capacity and Export Trends',
      excerpt: 'Latest analysis of China\'s special oil industry, including production data, export volumes, and market forecasts for 2026...',
      content: `
        <h2>2026 China Special Oil Market Report</h2>
        <p>The Chinese special oil industry continues to expand rapidly, with production capacity reaching 2.5 million metric tons in 2025, an increase of 8.5% year-on-year. This growth is driven by both domestic demand and increasing exports to global markets.</p>
        
        <h3>Key Market Highlights</h3>
        <p>According to the latest industry data, China's special oil exports reached 850,000 metric tons in 2025, with a year-on-year growth of 12.3%. The main export destinations include Southeast Asia (35%), Europe (28%), North America (18%), and the Middle East (12%).</p>
        
        <h3>Production Capacity by Region</h3>
        <p>The Bohai Bay region remains the largest production base for special oils in China, accounting for approximately 65% of total national production. Other important production areas include the Yangtze River Delta (18%) and the Pearl River Delta (12%).</p>
        
        <h3>Price Trends</h3>
        <p>Average export prices for Chinese special oils increased by 3-5% in 2025 compared to 2024, reflecting improvements in product quality and compliance with international standards. Price differentials between Chinese and Western products have narrowed to around 15-20% from 30% five years ago.</p>
        
        <h3>Future Outlook</h3>
        <p>The Chinese special oil market is expected to maintain steady growth in 2026, with production capacity projected to reach 2.7 million metric tons and exports exceeding 950,000 metric tons. The industry will continue to focus on product upgrading, technological innovation, and meeting stricter environmental requirements.</p>
      `,
      category: 'Industry News',
      tags: ['Market Report', 'China', 'Special Oil', 'Export Data', '2026 Forecast'],
      featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=China%20special%20oil%20market%20report%2C%20industrial%20cinematic%20style%2C%20charts%20and%20graphs&sign=deb6cbae3868454d3748743a28c5a55c',
      publishedAt: '2026-02-01T08:00:00Z',
      author: 'Market Research Team'
    },
    {
      id: '2',
      title: 'Technical Comparison: Chinese vs. International Special Oils',
      excerpt: 'Detailed technical analysis comparing the performance of Chinese special oils with international brands across key parameters...',
      content: `
        <h2>Technical Comparison: Chinese vs. International Special Oils</h2>
        <p>Chinese special oils have made significant technological advancements in recent years, narrowing the performance gap with established international brands. This comprehensive comparison examines key technical parameters across different product categories.</p>
        
        <h3>Transformer Oil Performance</h3>
        <p>Chinese transformer oils, particularly those from the Bohai Bay region, demonstrate excellent dielectric strength (typically >70kV) and low pour points (-45°C for premium grades), comparable to leading international brands. The key advantage lies in their naturally low sulfur content (<0.5%), which provides superior protection against copper corrosion.</p>
        
        <h3>Rubber Process Oil Characteristics</h3>
        <p>Chinese naphthenic rubber process oils offer high solvency (Cn% > 35%) and low PAH content that meets EU REACH requirements. Comparative testing shows these oils provide similar processing characteristics and end-product performance to established European and North American brands at a more competitive price point.</p>
        
        <h3>Hydraulic Oil Performance Testing</h3>
        <p>In anti-wear performance tests (ASTM D4172), premium Chinese hydraulic oils achieve wear scar diameters of <0.5mm, meeting or exceeding DIN 51524 specifications. They also demonstrate excellent oxidation stability and filterability, essential for modern high-pressure hydraulic systems.</p>
        
        <h3>Quality Control and Standardization</h3>
        <p>Chinese special oil manufacturers have significantly improved their quality control systems, with most major producers now ISO 9001 certified. Many have also implemented Six Sigma and other quality management methodologies to ensure consistent product quality.</p>
        
        <h3>Conclusion</h3>
        <p>Chinese special oils now offer performance characteristics that rival international brands across most technical parameters. When combined with their competitive pricing and reliable supply, they represent an attractive option for industrial buyers worldwide.</p>
      `,
      category: 'Technical Information',
      tags: ['Technical Comparison', 'Performance Testing', 'Quality Standards', 'Special Oil Analysis'],
      featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Laboratory%20testing%20of%20special%20oil%20samples%2C%20technical%20analysis%2C%20industrial%20cinematic%20style&sign=15a651d3ea04385dab1c68c0ea48e515',
      publishedAt: '2026-01-20T08:00:00Z',
      author: 'Technical Team'
    },
    {
      id: '3',
      title: 'Regulatory Updates: New Standards Affecting China Special Oil Exports in 2026',
      excerpt: 'Latest regulatory changes and compliance requirements that will impact the export of Chinese special oils in 2026...',
      content: `
        <h2>Regulatory Updates for China Special Oil Exports in 2026</h2>
        <p>Several important regulatory changes will affect the export of Chinese special oils in 2026. Staying informed about these updates is crucial for international buyers and logistics partners.</p>
        
        <h3>New EU REACH Requirements</h3>
        <p>The European Union has introduced stricter requirements for PAH (Polycyclic Aromatic Hydrocarbons) content in special oils. As of January 2026, all special oils exported to the EU must comply with the latest REACH Annex XVII restrictions, which further limit the concentration of certain PAHs.</p>
        
        <h3>US EPA Standards Updates</h3>
        <p>The US Environmental Protection Agency has updated its regulations for imported lubricants, requiring additional documentation for products entering the US market. This includes detailed composition statements and compliance certificates for specific applications.</p>
        
        <h3>China's Export Documentation Simplification</h3>
        <p>In a positive development for exporters, Chinese customs authorities have streamlined export documentation requirements for special oils, reducing processing times by approximately 30%. This includes electronic submission options for many documents previously requiring physical copies.</p>
        
        <h3>New Packaging and Labeling Requirements</h3>
        <p>New international standards for the packaging and labeling of hazardous materials (including certain special oils) will come into effect in June 2026. These standards update labeling requirements for海运,空运, and land transport.</p>
        
        <h3>Compliance Support Services</h3>
        <p>To help international buyers navigate these regulatory changes, many Chinese special oil suppliers now offer comprehensive compliance support services, including document preparation, regulatory consulting, and third-party testing to verify compliance with destination country requirements.</p>
        
        <h3>How to Stay Compliant</h3>
        <p>Buyers are advised to work closely with their suppliers to ensure all products meet the latest regulatory requirements. This includes requesting updated certificates of analysis, compliance documents, and staying informed about changes in destination country regulations.</p>
      `,
      category: 'Technical Information',
      tags: ['Regulatory Updates', 'Compliance', 'Export Requirements', 'REACH', 'EPA Standards'],
      featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Regulatory%20documents%20and%20compliance%20certificates%2C%20industrial%20style&sign=3e6b95de13422fdb0715a88adc62ad70',
      publishedAt: '2026-01-10T08:00:00Z',
      author: 'Regulatory Affairs Team'
    },
    {
      id: '4',
      title: 'Case Study: Successful Implementation of Chinese Special Oils in European Manufacturing',
      excerpt: 'A detailed case study examining how a European manufacturing company successfully transitioned to Chinese special oils...',
      content: `
        <h2>Case Study: European Manufacturer Adopts Chinese Special Oils</h2>
        <p>This case study examines how a leading European manufacturer of heavy machinery successfully transitioned to using Chinese special oils in their production processes and equipment maintenance, achieving significant cost savings without compromising performance.</p>
        
        <h3>Company Background</h3>
        <p>The company is a multinational manufacturer of construction equipment with production facilities in Germany, France, and Italy. With annual lubricant consumption exceeding 500 metric tons, they were seeking ways to optimize their lubrication costs while maintaining equipment reliability.</p>
        
        <h3>Challenges and Objectives</h3>
        <p>The primary challenges included ensuring product quality and performance would match existing brands, verifying compliance with European regulations, and establishing a reliable supply chain from China to multiple European locations.</p>
        
        <h3>Implementation Process</h3>
        <p>The transition process involved several key steps:</p>
        <ul>
          <li>Comprehensive product testing and comparison with existing lubricants</li>
          <li>Small-scale pilot implementation in selected production lines</li>
          <li>Monitoring of equipment performance and maintenance requirements</li>
          <li>Gradual full-scale implementation across all facilities</li>
        </ul>
        
        <h3>Results and Benefits</h3>
        <p>After a successful transition, the company achieved:</p>
        <ul>
          <li>22% reduction in lubricant costs</li>
          <li>Improved equipment reliability (18% reduction in unscheduled maintenance)</li>
          <li>Equivalent or better performance compared to previous lubricants</li>
          <li>Established a more diversified and resilient supply chain</li>
        </ul>
        
        <h3>Key Success Factors</h3>
        <p>The success of this transition was attributed to several factors:</p>
        <ul>
          <li>Thorough pre-implementation testing and evaluation</li>
          <li>Close collaboration with the Chinese supplier's technical team</li>
          <li>Proper employee training on the new products</li>
          <li>Regular performance monitoring and feedback mechanisms</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>This case study demonstrates that with proper planning, testing, and supplier collaboration, European manufacturers can successfully adopt Chinese special oils, achieving significant cost savings while maintaining or even improving equipment performance and reliability.</p>
      `,
      category: 'Industry News',
      tags: ['Case Study', 'European Market', 'Cost Savings', 'Success Story'],
      featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=European%20factory%20using%20Chinese%20special%20oil%2C%20industrial%20cinematic%20style&sign=0044bda5ccae01e2794d8fa95ba9775f',
      publishedAt: '2026-01-05T08:00:00Z',
      author: 'Case Study Team'
    },
    {
      id: '5',
      title: 'Sustainability in China\'s Special Oil Industry: New Developments for 2026',
      excerpt: 'Exploring the latest sustainability initiatives and green technologies being implemented in China\'s special oil industry...',
      content: `
        <h2>Sustainability in China's Special Oil Industry</h2>
        <p>Environmental sustainability has become a key focus for China's special oil industry, with significant investments in green technologies and processes. This article highlights the latest developments and initiatives for 2026.</p>
        
        <h3>Reduced Carbon Footprint Production</h3>
        <p>Several leading Chinese special oil producers have implemented carbon reduction programs, with some achieving up to 20% reduction in carbon emissions compared to traditional production methods. These include energy efficiency improvements, waste heat recovery systems, and increased use of renewable energy sources.</p>
        
        <h3>Bio-based Special Oil Development</h3>
        <p>Research into bio-based special oils has accelerated, with commercial production of certain bio-based transformer oils and rubber process oils now underway. These products offer comparable performance to conventional oils while reducing dependence on fossil fuels.</p>
        
        <h3>Enhanced Recycling Programs</h3>
        <p>Improved used oil recycling infrastructure has been developed, with the capacity to re-refine up to 35% of China's used special oils. This not only reduces environmental impact but also helps conserve resources and reduce raw material costs.</p>
        
        <h3>Eco-friendly Packaging Solutions</h3>
        <p>Many Chinese suppliers have introduced more sustainable packaging options, including recycled and biodegradable materials, reusable containers, and reduced packaging waste. Some companies now offer container return programs for bulk shipments.</p>
        
        <h3>Environmental Certifications</h3>
        <p>The number of Chinese special oil producers with ISO 14001 environmental management system certification has increased significantly, with many also pursuing additional certifications such as ISO 45001 (occupational health and safety) and product-specific environmental certifications.</p>
        
        <h3>Benefits for International Buyers</h3>
        <p>These sustainability initiatives provide several benefits for international buyers:</p>
        <ul>
          <li>Access to more environmentally friendly products</li>
          <li>Support for corporate sustainability goals and reporting requirements</li>
          <li>Compliance with increasingly strict environmental regulations in importing countries</li>
          <li>Enhanced brand reputation through sustainable sourcing</li>
        </ul>
        
        <p>As environmental concerns continue to grow globally, China's special oil industry is well-positioned to meet the increasing demand for sustainable lubrication solutions.</p>
      `,
      category: 'Industry News',
      tags: ['Sustainability', 'Green Technologies', 'Environmental Initiatives', 'Carbon Reduction'],
      featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Sustainable%20special%20oil%20production%2C%20green%20technology%2C%20industrial%20cinematic%20style&sign=2bd286c8ee9f47626a1e07083dd34093',
      publishedAt: '2026-02-10T08:00:00Z',
      author: 'Sustainability Team'
    }
  ];

// 默认管理员用户 - 用户名: admin, 密码: password
const defaultAdminUser: AdminUser = {
  username: 'admin',
  passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99', // MD5 hash of 'password'
  role: 'admin'
};

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载博客文章
  useEffect(() => {
    const loadPosts = () => {
      try {
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          // 首次加载时使用默认数据
          localStorage.setItem('blogPosts', JSON.stringify(defaultBlogPosts));
          setPosts(defaultBlogPosts);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        setPosts(defaultBlogPosts);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 保存博客文章
  const savePosts = (newPosts: BlogPost[]) => {
    try {
      localStorage.setItem('blogPosts', JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Failed to save blog posts:', error);
    }
  };

  // 添加新文章
  const addPost = (post: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString()
    };
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    return newPost;
  };

  // 更新文章
  const updatePost = (id: string, updatedData: Partial<BlogPost>): boolean => {
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex === -1) return false;

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...updatedPosts[postIndex],
      ...updatedData
    };
    savePosts(updatedPosts);
    return true;
  };

  // 删除文章
  const deletePost = (id: string): boolean => {
    const updatedPosts = posts.filter(post => post.id !== id);
    if (updatedPosts.length === posts.length) return false;
    
    savePosts(updatedPosts);
    return true;
  };

  // 获取单篇文章
  const getPostById = (id: string): BlogPost | undefined => {
    return posts.find(post => post.id === id);
  };

  // 搜索文章
  const searchPosts = (query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.category.toLowerCase().includes(lowerQuery)
    );
  };

  // 管理员认证
  const authenticateAdmin = (username: string, password: string): boolean => {
    try {
      const storedAdmin = localStorage.getItem('adminUser');
      const adminUser: AdminUser = storedAdmin ? JSON.parse(storedAdmin) : defaultAdminUser;
      
      // 简单的密码验证（实际应用中应该使用更安全的方法）
      const passwordHash = '5f4dcc3b5aa765d61d8327deb882cf99'; // MD5 hash of 'password'
      return username === adminUser.username && password === 'password';
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  // 检查是否已登录
  const isAuthenticated = (): boolean => {
    try {
      const token = localStorage.getItem('adminToken');
      return !!token;
    } catch (error) {
      return false;
    }
  };

  // 设置登录状态
  const setAuthenticated = (isAuth: boolean): void => {
    if (isAuth) {
      localStorage.setItem('adminToken', Date.now().toString());
    } else {
      localStorage.removeItem('adminToken');
    }
  };

  return {
    posts,
    isLoading,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    searchPosts,
    authenticateAdmin,
    isAuthenticated,
    setAuthenticated
  };
}