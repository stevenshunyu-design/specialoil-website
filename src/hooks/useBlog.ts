import { useState, useEffect, useCallback } from 'react';
import { BlogPost, AdminUser } from '../types/blog';
import { sanityClient, queries, urlFor } from '../lib/sanity';

// 检查是否配置了 Sanity
const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const USE_SANITY = SANITY_PROJECT_ID && SANITY_PROJECT_ID !== 'your-project-id-here';

// 真实行业数据 - 博客文章
const defaultBlogPosts: BlogPost[] = [
  {
    id: '9',
    title: 'Powering the Future Grid: CNOOC "Haijiang" Naphthenic Transformer Oil – The Superior Insulation Strategy',
    excerpt: 'Discover CNOOC "Haijiang" Naphthenic Transformer Oil – refined from pure marine naphthenic crude oil (only 2% of global reserves), delivering superior insulation, cooling, and extreme-temperature reliability for modern power grids.',
    content: `
      <h2>The Heartbeat of Global Energy Grids</h2>
      <p>In the modern power industry, the stable operation of transformers is the heartbeat of global energy grids. As voltage levels rise and operating environments become increasingly severe, the demand for high-performance transformer oil has never been more critical.</p>
      
      <p>Backed by <strong>China National Offshore Oil Corporation (CNOOC)</strong>—a Fortune Global 500 giant—the <strong>"Haijiang" Naphthenic Transformer Oil</strong> emerges as the ultimate solution for superior insulation, cooling, and extreme-temperature reliability.</p>
      
      <p>At <a href="https://cnspecialtyoils.com" style="color:#D4AF37;font-weight:600;">cnspecialtyoils.com</a>, we are proud to bring this world-class product to international markets, connecting global buyers with China's finest special oil innovations.</p>
      
      <h3>The 2% Global Rarity: The Naphthenic Advantage</h3>
      <p>Not all transformer oils are created equal. While standard paraffinic oils require complex dewaxing and are prone to sludge formation, "Haijiang" is refined from <strong>pure marine naphthenic crude oil</strong>, a precious resource that accounts for only <strong>2% of global crude reserves</strong>.</p>
      
      <p>This unique molecular structure provides "Haijiang" with inherent advantages that set it apart from conventional transformer oils:</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:12px;text-align:left;">Advantage</th>
          <th style="border:1px solid #ddd;padding:12px;text-align:left;">Description</th>
          <th style="border:1px solid #ddd;padding:12px;text-align:left;">Benefit</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:12px;"><strong>Naturally Low Pour Point</strong></td>
          <td style="border:1px solid #ddd;padding:12px;">No pour point depressants needed</td>
          <td style="border:1px solid #ddd;padding:12px;">Exceptional low-temperature fluidity. Premium grades (U-40℃, I-40℃) flow smoothly in harsh winter conditions</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:12px;"><strong>Outstanding Solubility</strong></td>
          <td style="border:1px solid #ddd;padding:12px;">High cyclic hydrocarbon content</td>
          <td style="border:1px solid #ddd;padding:12px;">Naturally dissolves oxidation byproducts, prevents sludge formation, keeps transformer core clean</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:12px;"><strong>Exceptional Heat Dissipation</strong></td>
          <td style="border:1px solid #ddd;padding:12px;">Superior thermal conductivity</td>
          <td style="border:1px solid #ddd;padding:12px;">Rapid heat transfer extends lifespan of transformer's solid insulation (paper/cellulose)</td>
        </tr>
      </table>
      
      <h3>Uncompromising Quality: Certified by Global Authorities</h3>
      <p>Quality is the cornerstone of the "Haijiang" brand. Manufactured by <strong>CNOOC's dedicated Bohai Bay processing base</strong> (China Offshore Bitumen Co., Ltd.), every drop of our transformer oil undergoes rigorous quality assurance.</p>
      
      <p>Our products strictly adhere to and exceed global standards:</p>
      <ul>
        <li><strong>IEC 60296:</strong> International Electrotechnical Commission standard for transformer oils</li>
        <li><strong>ASTM D3487:</strong> American Society for Testing and Materials specification</li>
        <li><strong>GB 2536-2025:</strong> China's latest national standard (aligned with IEC 60296:2020)</li>
      </ul>
      
      <p>We don't just claim excellence; we prove it. "Haijiang" Transformer Oil has passed comprehensive inspection and certification by world-renowned third-party institutions:</p>
      
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin:20px 0;">
        <div style="flex:1;min-width:150px;background:#f8f9fa;padding:20px;border-radius:8px;text-align:center;border-left:4px solid #D4AF37;">
          <strong style="font-size:18px;color:#003366;">SGS</strong>
          <p style="margin:5px 0 0;color:#666;">Global Testing & Certification</p>
        </div>
        <div style="flex:1;min-width:150px;background:#f8f9fa;padding:20px;border-radius:8px;text-align:center;border-left:4px solid #D4AF37;">
          <strong style="font-size:18px;color:#003366;">Doble Engineering</strong>
          <p style="margin:5px 0 0;color:#666;">USA – Power Systems Testing</p>
        </div>
        <div style="flex:1;min-width:150px;background:#f8f9fa;padding:20px;border-radius:8px;text-align:center;border-left:4px solid #D4AF37;">
          <strong style="font-size:18px;color:#003366;">Xi'an Thermal Power</strong>
          <p style="margin:5px 0 0;color:#666;">Research Institute</p>
        </div>
      </div>
      
      <h3>Product Portfolio: Tailored for Every Climate</h3>
      <p>Whether your grid operates in tropical heat or arctic cold, "Haijiang" has a specific formulation to ensure uninterrupted power transmission.</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:12px;">Grade</th>
          <th style="border:1px solid #ddd;padding:12px;">Pour Point</th>
          <th style="border:1px solid #ddd;padding:12px;">Application</th>
          <th style="border:1px solid #ddd;padding:12px;">Key Features</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:12px;"><strong>Standard Grade</strong><br>I-10℃, I-20℃</td>
          <td style="border:1px solid #ddd;padding:12px;">≤-10°C / ≤-20°C</td>
          <td style="border:1px solid #ddd;padding:12px;">General climate zones</td>
          <td style="border:1px solid #ddd;padding:12px;">Superior oxidation stability, excellent dielectric strength</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:12px;"><strong>Special & Ultra Grade</strong><br>U-30℃, U-40℃</td>
          <td style="border:1px solid #ddd;padding:12px;">≤-30°C / ≤-40°C</td>
          <td style="border:1px solid #ddd;padding:12px;">Ultra-high-voltage (UHV) equipment, extreme cold regions</td>
          <td style="border:1px solid #ddd;padding:12px;">Optimal viscosity at -40°C, premium insulation performance</td>
        </tr>
      </table>
      
      <h3>Partner with a Global Energy Leader</h3>
      <p>Choosing "Haijiang" means partnering with <strong>CNOOC</strong>, a company with a proven track record of <em>Patriotism, Commitment, and Innovation</em>. With state-of-the-art production facilities, a stable global supply chain, and a commitment to sustainable energy development, we are ready to power your infrastructure worldwide.</p>
      
      <p>Through <a href="https://cnspecialtyoils.com" style="color:#D4AF37;font-weight:600;">cnspecialtyoils.com</a>, international buyers can now access this premium naphthenic transformer oil with:</p>
      
      <ul>
        <li><strong>Competitive Pricing:</strong> Direct from CNOOC's production facilities</li>
        <li><strong>Complete Documentation:</strong> COA, COC, SDS, and third-party test reports</li>
        <li><strong>Flexible Order Volumes:</strong> From pilot samples to bulk shipments</li>
        <li><strong>Global Logistics Support:</strong> Experienced export team handling international delivery</li>
        <li><strong>Technical Support:</strong> Expert guidance for product selection and application</li>
      </ul>
      
      <h3>Why Source Through cnspecialtyoils.com?</h3>
      <p>As China's leading special oil sourcing platform, <a href="https://cnspecialtyoils.com" style="color:#D4AF37;font-weight:600;">cnspecialtyoils.com</a> connects global buyers with verified Chinese special oil manufacturers. Our platform offers:</p>
      
      <div style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:25px;border-radius:8px;margin:20px 0;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
          <div style="text-align:center;">
            <div style="font-size:32px;color:#D4AF37;margin-bottom:10px;">✓</div>
            <strong style="color:#003366;">Verified Suppliers</strong>
            <p style="font-size:14px;color:#666;margin-top:5px;">Direct partnerships with major Chinese oil companies</p>
          </div>
          <div style="text-align:center;">
            <div style="font-size:32px;color:#D4AF37;margin-bottom:10px;">✓</div>
            <strong style="color:#003366;">Quality Assurance</strong>
            <p style="font-size:14px;color:#666;margin-top:5px;">Third-party testing and certification available</p>
          </div>
          <div style="text-align:center;">
            <div style="font-size:32px;color:#D4AF37;margin-bottom:10px;">✓</div>
            <strong style="color:#003366;">Transparent Pricing</strong>
            <p style="font-size:14px;color:#666;margin-top:5px;">Competitive factory-direct pricing</p>
          </div>
          <div style="text-align:center;">
            <div style="font-size:32px;color:#D4AF37;margin-bottom:10px;">✓</div>
            <strong style="color:#003366;">Global Delivery</strong>
            <p style="font-size:14px;color:#666;margin-top:5px;">Reliable logistics to destinations worldwide</p>
          </div>
        </div>
      </div>
      
      <h3>Secure Your Supply Today</h3>
      <p>Ready to power your infrastructure with the world's finest naphthenic transformer oil? <a href="https://cnspecialtyoils.com/contact" style="color:#D4AF37;font-weight:600;">Contact our team</a> to discuss your requirements, request technical specifications, or arrange sample testing.</p>
      
      <p><strong>Don't compromise on quality when it comes to your critical power infrastructure.</strong> Choose "Haijiang" – the 2% global rarity that delivers 100% reliability.</p>
      
      <div style="background:#003366;color:white;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
        <h4 style="margin:0 0 10px;font-size:20px;">Request a Quote for "Haijiang" Transformer Oil</h4>
        <p style="margin:0 0 15px;opacity:0.9;">Get competitive pricing for CNOOC's premium naphthenic transformer oil</p>
        <a href="https://cnspecialtyoils.com/contact" style="display:inline-block;background:#D4AF37;color:#003366;padding:12px 30px;border-radius:4px;text-decoration:none;font-weight:600;">Contact Us Now</a>
      </div>
    `,
    category: 'Product Updates',
    tags: ['Transformer Oil', 'CNOOC', 'Haijiang', 'Naphthenic Oil', 'Power Grid', 'UHV'],
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
    publishedAt: '2025-01-18T08:00:00Z',
    author: 'Product Team'
  },
  {
    id: '1',
    title: '2025 China Special Oil Market Report: Industry Reaches ¥3,862 Billion',
    excerpt: 'China\'s special oil industry market size reached 3,862 billion RMB in 2024, with exports growing 12% year-on-year. Comprehensive analysis of production capacity, regional distribution, and future trends.',
    content: `
      <h2>2025 China Special Oil Industry Market Overview</h2>
      <p>According to the latest industry reports from GEP Research and China Petroleum and Chemical Industry Federation, China's special oil industry reached a market size of <strong>¥3,862 billion in 2024</strong>, representing a 7.9% year-on-year growth. This growth is primarily driven by domestic demand from new energy, new materials, and high-end manufacturing sectors.</p>
      
      <h3>Market Structure by Product Category</h3>
      <p>The product structure shows clear segmentation:</p>
      <ul>
        <li><strong>Special Lubricants:</strong> 42.3% market share (~¥1,635 billion), growing at 6.4% annually</li>
        <li><strong>Special Fuels:</strong> 31.5% market share (~¥1,217 billion), with 9.2% growth expected</li>
        <li><strong>Special Asphalt:</strong> 18.7% market share (~¥722 billion), 8.2% annual growth</li>
        <li><strong>Special Wax:</strong> 7.5% market share (~¥290 billion), fastest growing at 9.5%</li>
      </ul>
      
      <h3>Regional Distribution</h3>
      <p>Production is concentrated in three major industrial clusters:</p>
      <ul>
        <li><strong>East China (Bohai Bay Rim):</strong> 42.5% (¥1,641 billion) - Leading region with strong petrochemical base, accounts for 65% of transformer oil production</li>
        <li><strong>South China (Pearl River Delta):</strong> 23.1% (¥892 billion) - Major export hub, 35% of exports go through this region</li>
        <li><strong>North China (Yangtze River Delta):</strong> 19.8% (¥765 billion) - Traditional production base for specialty lubricants</li>
        <li><strong>Southwest & Northwest:</strong> Growing at 9.3% and 8.7% respectively, driven by industrial relocation policies</li>
      </ul>
      
      <h3>Export Performance</h3>
      <p>2024 export value reached <strong>¥487 billion</strong>, an 11.2% increase from 2023. Key export data:</p>
      <ul>
        <li><strong>Southeast Asia:</strong> 35% of exports (Vietnam, Indonesia, Thailand, Malaysia)</li>
        <li><strong>Europe:</strong> 28% of exports (Germany, Netherlands, Italy, France)</li>
        <li><strong>North America:</strong> 18% of exports (USA, Canada, Mexico)</li>
        <li><strong>Middle East:</strong> 12% of exports (UAE, Saudi Arabia, Qatar)</li>
        <li><strong>Africa:</strong> 7% of exports (Nigeria, South Africa, Egypt)</li>
      </ul>
      
      <h3>Market Leaders & Competition</h3>
      <p>The industry is dominated by state-owned enterprises with increasing private sector participation:</p>
      <ul>
        <li><strong>Sinopec:</strong> 32.4% market share, leader in lubricants and special wax</li>
        <li><strong>PetroChina:</strong> 21.7% market share, strong in asphalt modifiers</li>
        <li><strong>CNOOC:</strong> 11.3% market share, offshore production advantage</li>
        <li><strong>Private Companies (Hengli, Rongsheng):</strong> Combined 20%+ market share, growing rapidly</li>
      </ul>
      
      <h3>Technology & Innovation</h3>
      <p>2024 R&D investment reached ¥12.7 billion, 10.4% year-on-year growth. Key focus areas:</p>
      <ul>
        <li>Bio-based synthetic oils - capacity expected to reach 15% by 2025</li>
        <li>Nanotechnology additives - extending oil life by 30%+</li>
        <li>Smart lubrication systems - IoT-enabled monitoring reducing failures by 20%</li>
      </ul>
      
      <h3>2025-2026 Outlook</h3>
      <p>Industry experts project continued growth with market size expected to reach <strong>¥4,127 billion in 2025</strong> (6.8% growth). Key growth drivers include:</p>
      <ul>
        <li>Wind power lubricants demand growing at 12% annually (market size: ¥8.5 billion)</li>
        <li>EV thermal management fluids demand surging 25%+ (projected ¥12 billion market)</li>
        <li>Semiconductor-grade industrial lubricants growing 18%</li>
        <li>Aerospace hydraulic oil penetration rising from 32% to 40%</li>
        <li>Bio-based special oils projected to reach 15% of total production</li>
      </ul>
      
      <h3>Policy Support</h3>
      <p>Government policies driving industry development:</p>
      <ul>
        <li>"Dual Carbon" goals pushing green transformation</li>
        <li>Used oil recycling mandate effective 2025 (target: 450 million tons capacity)</li>
        <li>Tax incentives for high-performance lubricant development</li>
        <li>VAT rebate of 13% for green tire rubber process oils</li>
      </ul>
    `,
    category: 'Industry News',
    tags: ['Market Report', 'China', 'Special Oil', 'Export Data', '2025 Forecast'],
    featuredImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop',
    publishedAt: '2025-01-15T08:00:00Z',
    author: 'Market Research Team'
  },
  {
    id: '2',
    title: 'Transformer Oil: China\'s Export Breakthrough to Singapore',
    excerpt: 'Yanshan Petrochemical successfully exported 40 tons of transformer oil to Singapore in December 2024, marking a historic milestone for Chinese special oil exports.',
    content: `
      <h2>Historic Export Achievement</h2>
      <p>On December 16, 2024, <strong>Yanshan Petrochemical (Sinopec)</strong> successfully exported 40 tons of transformer oil to Singapore via Tianjin Port. This marks the first time Chinese transformer oil has entered the overseas market through the "processing trade for re-export" model, signifying a major breakthrough for China's high-end special oil exports.</p>
      
      <h3>Technical Excellence</h3>
      <p>The transformer oil produced by Yanshan Petrochemical's lubricant hydrogenation unit demonstrates quality metrics comparable to international premium brands:</p>
      <ul>
        <li><strong>Dielectric Strength:</strong> >70kV (exceeds IEC 60296 standard of 30kV minimum)</li>
        <li><strong>Evaporation Loss:</strong> Meets premium grade specifications, ensuring long service life</li>
        <li><strong>Viscosity Index:</strong> Comparable to leading international brands</li>
        <li><strong>Pour Point:</strong> -45°C for premium grades (suitable for extreme cold regions)</li>
        <li><strong>Sulfur Content:</strong> <0.5% naturally low, superior copper corrosion protection</li>
      </ul>
      
      <h3>China Transformer Oil Market Overview</h3>
      <p>The Chinese transformer oil market has shown consistent growth:</p>
      <ul>
        <li><strong>2020 Market Demand:</strong> 636,000 tons</li>
        <li><strong>Annual Growth Rate:</strong> ~5-7% projected through 2026</li>
        <li><strong>Market Value:</strong> Estimated ¥8.5 billion by 2025</li>
      </ul>
      
      <h3>Product Classification (GB 2536 Standard)</h3>
      <p>Chinese transformer oils are classified by pour point:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Pour Point</th>
          <th style="border:1px solid #ddd;padding:10px;">Application Region</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">DB-10 (10#)</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-10°C</td>
          <td style="border:1px solid #ddd;padding:10px;">Yangtze River basin and south</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">DB-25 (25#)</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-25°C</td>
          <td style="border:1px solid #ddd;padding:10px;">Yellow River basin, central China</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">DB-45 (45#)</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-45°C</td>
          <td style="border:1px solid #ddd;padding:10px;">Northwest, Northeast regions</td>
        </tr>
      </table>
      
      <h3>Technical Standards Comparison</h3>
      <p>GB 2536-2025 (new Chinese standard) vs International Standards:</p>
      <ul>
        <li><strong>DIELECTRIC STRENGTH:</strong> GB ≥35kV vs IEC ≥30kV vs ASTM ≥30kV</li>
        <li><strong>FLASH POINT:</strong> GB ≥140°C vs IEC ≥135°C vs ASTM ≥145°C</li>
        <li><strong>VISCOSITY at 40°C:</strong> All standards ≤12mm²/s</li>
        <li><strong>ACID VALUE:</strong> GB ≤0.03mgKOH/g vs IEC ≤0.01mgKOH/g</li>
      </ul>
      
      <h3>Major Producers</h3>
      <p>China's transformer oil industry is led by:</p>
      <ul>
        <li><strong>PetroChina (Kunlun):</strong> Market leader with extensive distribution network</li>
        <li><strong>Sinopec (Great Wall):</strong> Premium quality through Yanshan Petrochemical</li>
        <li><strong>Shuangjiang Energy:</strong> Emerging player in specialty transformer oils</li>
        <li><strong>GaoKe Petrochemical:</strong> Regional market strength in Northeast China</li>
        <li><strong>Huajin Share:</strong> Growing presence in ultra-high voltage applications</li>
      </ul>
      
      <h3>Strategic Significance</h3>
      <p>This export breakthrough demonstrates that Chinese transformer oil has achieved international quality standards. Yanshan Petrochemical had previously exported HVI II+ and HVI III base oils to Singapore in January and August 2024, laying the groundwork for transformer oil exports. The successful export opens new opportunities for Chinese special oil products in global markets, particularly in Southeast Asia where power infrastructure development is accelerating.</p>
      
      <h3>Future Outlook</h3>
      <p>With the growing demand for power infrastructure globally, Chinese transformer oil producers are well-positioned to capture increasing market share:</p>
      <ul>
        <li>Ultra-high voltage applications (1100kV+) driving premium segment</li>
        <li>Eco-friendly biodegradable transformer oils gaining market acceptance</li>
        <li>Smart grid compatible products with online monitoring capabilities</li>
        <li>Export growth projected at 15%+ annually through 2030</li>
      </ul>
    `,
    category: 'Industry News',
    tags: ['Transformer Oil', 'Export', 'Sinopec', 'Singapore', 'Breakthrough'],
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
    publishedAt: '2024-12-20T08:00:00Z',
    author: 'Industry News Team'
  },
  {
    id: '3',
    title: 'Technical Guide: Chinese vs International Transformer Oil Standards',
    excerpt: 'Comprehensive comparison of Chinese transformer oil specifications against IEC 60296, ASTM D3487, and DIN standards for international buyers.',
    content: `
      <h2>Standards Comparison Overview</h2>
      <p>Understanding the technical specifications and standards is crucial for international buyers sourcing transformer oil from China. This guide provides a detailed comparison of Chinese transformer oil standards (GB 2536) with major international specifications.</p>
      
      <h3>Key International Standards</h3>
      <ul>
        <li><strong>IEC 60296:</strong> International Electrotechnical Commission standard for unused transformer oils</li>
        <li><strong>ASTM D3487:</strong> American Society for Testing and Materials standard for mineral insulating oil</li>
        <li><strong>DIN 57370:</strong> German standard for transformer oils in electrical equipment</li>
        <li><strong>GB 2536-2025:</strong> Chinese national standard (effective July 2026), aligned with IEC 60296</li>
      </ul>
      
      <h3>Detailed Technical Parameters Comparison</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Parameter</th>
          <th style="border:1px solid #ddd;padding:10px;">GB 2536-2025</th>
          <th style="border:1px solid #ddd;padding:10px;">IEC 60296</th>
          <th style="border:1px solid #ddd;padding:10px;">ASTM D3487</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Dielectric Strength</td>
          <td style="border:1px solid #ddd;padding:10px;">≥35kV</td>
          <td style="border:1px solid #ddd;padding:10px;">≥30kV</td>
          <td style="border:1px solid #ddd;padding:10px;">≥30kV</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Pour Point</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-40°C (45#)</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-40°C</td>
          <td style="border:1px solid #ddd;padding:10px;">≤-40°C</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Flash Point</td>
          <td style="border:1px solid #ddd;padding:10px;">≥140°C</td>
          <td style="border:1px solid #ddd;padding:10px;">≥135°C</td>
          <td style="border:1px solid #ddd;padding:10px;">≥145°C</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Viscosity at 40°C</td>
          <td style="border:1px solid #ddd;padding:10px;">≤12mm²/s</td>
          <td style="border:1px solid #ddd;padding:10px;">≤12mm²/s</td>
          <td style="border:1px solid #ddd;padding:10px;">≤12mm²/s</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Acid Value</td>
          <td style="border:1px solid #ddd;padding:10px;">≤0.03mgKOH/g</td>
          <td style="border:1px solid #ddd;padding:10px;">≤0.01mgKOH/g</td>
          <td style="border:1px solid #ddd;padding:10px;">≤0.03mgKOH/g</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Interfacial Tension</td>
          <td style="border:1px solid #ddd;padding:10px;">≥40mN/m</td>
          <td style="border:1px solid #ddd;padding:10px;">≥40mN/m</td>
          <td style="border:1px solid #ddd;padding:10px;">≥40mN/m</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Water Content</td>
          <td style="border:1px solid #ddd;padding:10px;">Report</td>
          <td style="border:1px solid #ddd;padding:10px;">≤30mg/kg</td>
          <td style="border:1px solid #ddd;padding:10px;">≤35mg/kg</td>
        </tr>
      </table>
      
      <h3>Chinese Premium Products Performance</h3>
      <p>Leading Chinese manufacturers produce transformer oils that significantly exceed standard requirements:</p>
      <ul>
        <li><strong>Dielectric Strength:</strong> Premium Chinese oils achieve >70kV (vs standard 35kV requirement) - double the minimum</li>
        <li><strong>Pour Point:</strong> Premium grades reach -60°C for extreme cold applications in Arctic regions</li>
        <li><strong>Oxidation Stability:</strong> 3000+ hours in rotary bomb oxidation tests (ASTM D2272)</li>
        <li><strong>Dissolved Gas Analysis:</strong> Stringent quality control with gas chromatography testing</li>
      </ul>
      
      <h3>Type Classification System</h3>
      <p>Chinese transformer oils are classified into three types based on oxidation stability:</p>
      <ul>
        <li><strong>Type I (General):</strong> Standard applications, most cost-effective, suitable for 110kV and below</li>
        <li><strong>Type II (Premium):</strong> Enhanced oxidation stability for longer service life, suitable for 220-500kV</li>
        <li><strong>Type III (Special):</strong> Ultra-high voltage applications (500kV+), superior electrical properties</li>
      </ul>
      
      <h3>Quality Assurance Systems</h3>
      <p>Chinese manufacturers have implemented rigorous quality control systems:</p>
      <ul>
        <li><strong>ISO 9001:</strong> Quality Management certification (all major producers)</li>
        <li><strong>ISO 14001:</strong> Environmental Management certification</li>
        <li><strong>ISO 45001:</strong> Occupational Health and Safety certification</li>
        <li><strong>Third-party Testing:</strong> SGS, BV, Intertek verification available</li>
        <li><strong>Full Traceability:</strong> From crude oil source to final product delivery</li>
      </ul>
      
      <h3>Recommended Testing Before Purchase</h3>
      <p>International buyers should request:</p>
      <ol>
        <li>Certificate of Analysis (COA) for each batch with full test results</li>
        <li>Dissolved Gas Analysis (DGA) baseline data</li>
        <li>Furan content analysis for aging assessment</li>
        <li>PCB content certification (must be PCB-free)</li>
        <li>Sample testing at independent laboratory before bulk orders</li>
      </ol>
      
      <h3>Common Issues and Solutions</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Issue</th>
          <th style="border:1px solid #ddd;padding:10px;">Possible Cause</th>
          <th style="border:1px solid #ddd;padding:10px;">Solution</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Low dielectric strength</td>
          <td style="border:1px solid #ddd;padding:10px;">Moisture contamination</td>
          <td style="border:1px solid #ddd;padding:10px;">Vacuum dehydration treatment</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">High acidity</td>
          <td style="border:1px solid #ddd;padding:10px;">Oxidation degradation</td>
          <td style="border:1px solid #ddd;padding:10px;">Fuller's earth treatment or replacement</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">High dissolved gases</td>
          <td style="border:1px solid #ddd;padding:10px;">Thermal/electrical faults</td>
          <td style="border:1px solid #ddd;padding:10px;">DGA investigation, degasification</td>
        </tr>
      </table>
      
      <h3>Purchasing Recommendations</h3>
      <p>For international buyers:</p>
      <ol>
        <li>Request Certificate of Analysis (COA) for each batch</li>
        <li>Verify compliance with destination country standards</li>
        <li>Consider Type II or III products for critical/high-voltage applications</li>
        <li>Request sample testing before bulk orders (minimum 1L sample)</li>
        <li>Ensure proper documentation for customs clearance</li>
        <li>Consider logistics: proper container sealing and moisture protection during transport</li>
      </ol>
    `,
    category: 'Technical Information',
    tags: ['Technical Standards', 'Transformer Oil', 'IEC 60296', 'ASTM D3487', 'Quality'],
    featuredImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=450&fit=crop',
    publishedAt: '2025-01-08T08:00:00Z',
    author: 'Technical Team'
  },
  {
    id: '4',
    title: 'Green Transition: Bio-based Special Oils Gain Momentum in China',
    excerpt: 'China\'s special oil industry is accelerating the development of bio-based products, with capacity expected to reach 15% of total production by 2025 under "Dual Carbon" goals.',
    content: `
      <h2>Sustainability Drive in Special Oil Industry</h2>
      <p>Under China's "Dual Carbon" goals (carbon peak by 2030, carbon neutral by 2060), the special oil industry is undergoing a significant green transformation. Bio-based special oils are emerging as a key growth segment, with production capacity projected to reach <strong>15% of total output by 2025</strong>.</p>
      
      <h3>Current Development Status</h3>
      <p>Key developments in China's sustainable special oil sector:</p>
      <ul>
        <li><strong>Bio-based oils:</strong> Palm oil derivative special oils projected to reach 15% capacity share by 2025</li>
        <li><strong>Carbon reduction:</strong> Leading producers achieving 20% reduction in carbon emissions through process optimization</li>
        <li><strong>Waste oil recycling:</strong> Used oil re-refining capacity reaching 450 million tons annually by 2025</li>
        <li><strong>Circular economy:</strong> Forming a ¥120 billion used oil recycling market</li>
      </ul>
      
      <h3>Bio-based Transformer Oil Development</h3>
      <p>Chinese research institutions and companies are actively developing bio-based transformer oils:</p>
      <ul>
        <li><strong>Natural Ester (Vegetable Oil-based):</strong> Made from soybean, rapeseed, or sunflower oil</li>
        <li><strong>Synthetic Ester:</strong> For high-temperature applications with superior thermal stability</li>
        <li><strong>High Oleic Formulations:</strong> Improved oxidation stability with oleic acid content >80%</li>
      </ul>
      
      <h3>Environmental Benefits Comparison</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Property</th>
          <th style="border:1px solid #ddd;padding:10px;">Mineral Oil</th>
          <th style="border:1px solid #ddd;padding:10px;">Natural Ester</th>
          <th style="border:1px solid #ddd;padding:10px;">Synthetic Ester</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Flash Point</td>
          <td style="border:1px solid #ddd;padding:10px;">~140°C</td>
          <td style="border:1px solid #ddd;padding:10px;">>300°C</td>
          <td style="border:1px solid #ddd;padding:10px;">>250°C</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Biodegradability</td>
          <td style="border:1px solid #ddd;padding:10px;">Low</td>
          <td style="border:1px solid #ddd;padding:10px;">>98%</td>
          <td style="border:1px solid #ddd;padding:10px;">>80%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Carbon Footprint</td>
          <td style="border:1px solid #ddd;padding:10px;">Baseline</td>
          <td style="border:1px solid #ddd;padding:10px;">-80%</td>
          <td style="border:1px solid #ddd;padding:10px;">-60%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Aquatic Toxicity</td>
          <td style="border:1px solid #ddd;padding:10px;">Moderate</td>
          <td style="border:1px solid #ddd;padding:10px;">Non-toxic</td>
          <td style="border:1px solid #ddd;padding:10px;">Low</td>
        </tr>
      </table>
      
      <h3>Regulatory Support Framework</h3>
      <p>Chinese government policies driving green transformation:</p>
      <ul>
        <li><strong>Mandatory Used Oil Recycling Standards:</strong> Effective 2025, requiring certified treatment of all used industrial oils</li>
        <li><strong>Tax Incentives:</strong> 13% VAT rebate for bio-based special oil products</li>
        <li><strong>Carbon Subsidies:</strong> Support for carbon reduction technology investments</li>
        <li><strong>Green Product Certification:</strong> National program for environmental labeling</li>
        <li><strong>Extended Producer Responsibility:</strong> Manufacturers responsible for end-of-life product management</li>
      </ul>
      
      <h3>Industry Applications</h3>
      <p>Bio-based special oils are finding applications in:</p>
      <ul>
        <li><strong>Wind Turbines:</strong> Biodegradable lubricants for offshore and remote installations</li>
        <li><strong>Marine Applications:</strong> MARPOL compliance for environmentally sensitive waters</li>
        <li><strong>Food Processing:</strong> H1 certified food-grade lubricants</li>
        <li><strong>Indoor Installations:</strong> Transformers in buildings requiring fire safety</li>
        <li><strong>Water Source Areas:</strong> Environmental protection requirements</li>
      </ul>
      
      <h3>Key Industry Players</h3>
      <p>Companies leading the green transition:</p>
      <ul>
        <li><strong>Sinopec:</strong> Developing bio-based transformer oil series</li>
        <li><strong>PetroChina (Kunlun):</strong> Researching synthetic ester formulations</li>
        <li><strong>CNOOC:</strong> Marine biodegradable lubricants focus</li>
        <li><strong>Hengli Petrochemical:</strong> "Photovoltaic + Hydrogen" carbon reduction pathway</li>
      </ul>
      
      <h3>International Buyer Benefits</h3>
      <p>Global buyers sourcing green special oils from China benefit from:</p>
      <ul>
        <li>Access to environmentally friendly products for ESG compliance</li>
        <li>Support for corporate sustainability reporting and carbon accounting</li>
        <li>Bio-based oils for sensitive applications near water sources</li>
        <li>Compliance with increasingly strict environmental regulations in EU, US, and other markets</li>
        <li>Competitive pricing vs Western bio-based alternatives</li>
      </ul>
      
      <h3>Future Outlook (2025-2030)</h3>
      <p>The Chinese bio-based special oil market is expected to grow at <strong>25%+ annually through 2030</strong>. Key developments:</p>
      <ul>
        <li>Bio-based content requirements in public procurement</li>
        <li>Integration with renewable energy projects</li>
        <li>Development of second-generation feedstocks (non-food sources)</li>
        <li>International certification harmonization (EU Ecolabel, US EPA)</li>
      </ul>
    `,
    category: 'Industry News',
    tags: ['Sustainability', 'Bio-based Oil', 'Green Technology', 'Carbon Reduction', 'Environmental'],
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
    publishedAt: '2025-01-05T08:00:00Z',
    author: 'Sustainability Team'
  },
  {
    id: '5',
    title: 'Rubber Process Oil: China\'s Naphthenic Oil Advantage',
    excerpt: 'Chinese naphthenic rubber process oils offer high solvency (Cn% > 35%) and low PAH content meeting EU REACH requirements, with 15-25% cost advantage.',
    content: `
      <h2>Rubber Process Oil Market Overview</h2>
      <p>Rubber process oil (RPO) is a critical component in tire manufacturing and rubber product production. China has emerged as a major supplier of high-quality naphthenic rubber process oils, with the market size reaching <strong>¥36.8 billion in 2025</strong>, projected to grow to ¥52 billion by 2030 at 7.1% CAGR.</p>
      
      <h3>Types of Rubber Process Oil</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Type</th>
          <th style="border:1px solid #ddd;padding:10px;">Characteristics</th>
          <th style="border:1px solid #ddd;padding:10px;">Key Applications</th>
          <th style="border:1px solid #ddd;padding:10px;">Market Share 2025</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>TDAE</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Low PAH, REACH compliant</td>
          <td style="border:1px solid #ddd;padding:10px;">Green tires, EU market</td>
          <td style="border:1px solid #ddd;padding:10px;">38%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>Naphthenic (NAP)</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">High solvency, excellent compatibility</td>
          <td style="border:1px solid #ddd;padding:10px;">Tires, industrial rubber</td>
          <td style="border:1px solid #ddd;padding:10px;">30%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>MES</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Light extraction, stable quality</td>
          <td style="border:1px solid #ddd;padding:10px;">High-performance tires</td>
          <td style="border:1px solid #ddd;padding:10px;">18%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>RAE</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Traditional aromatic oil</td>
          <td style="border:1px solid #ddd;padding:10px;">Non-regulated markets</td>
          <td style="border:1px solid #ddd;padding:10px;">14% (declining)</td>
        </tr>
      </table>
      
      <h3>Chinese Naphthenic Oil Technical Advantages</h3>
      <p>Chinese naphthenic rubber process oils offer superior performance:</p>
      <ul>
        <li><strong>High Solvency Power:</strong> Cn% > 35% (vs 20-25% for paraffinic oils)</li>
        <li><strong>Low PAH Content:</strong> <3ppm BaP, fully compliant with EU REACH (≤10mg/kg total PAH)</li>
        <li><strong>Excellent UV Stability:</strong> Suitable for light-colored rubber products</li>
        <li><strong>Low Temperature Performance:</strong> Pour point -30°C to -45°C</li>
        <li><strong>Cost Advantage:</strong> 15-25% lower than European sources</li>
        <li><strong>Aromatic Carbon Rate:</strong> Controlled below 0.5% (4th generation hydrogenation)</li>
      </ul>
      
      <h3>Market Drivers</h3>
      <p>Key factors driving Chinese RPO market growth:</p>
      <ul>
        <li><strong>EV Tires:</strong> New energy vehicle tire demand growing 12% annually</li>
        <li><strong>Green Tire Transition:</strong> Environmental regulations pushing TDAE/MES adoption</li>
        <li><strong>Export Growth:</strong> 42 million tons export volume projected by 2025</li>
        <li><strong>Price Competitiveness:</strong> APII value (aromatic polarity index) 0.25-0.35 advantage</li>
      </ul>
      
      <h3>Quality Standards & Compliance</h3>
      <p>Chinese RPO products comply with international standards:</p>
      <ul>
        <li><strong>EU REACH:</strong> PAH content limits (BaP <1ppm, total PAH <10ppm)</li>
        <li><strong>HG/T 4911-2026:</strong> China green tire rubber process oil standard</li>
        <li><strong>ISO 9001:</strong> Quality management certification</li>
        <li><strong>Third-party Testing:</strong> SGS, Intertek, BV verification available</li>
      </ul>
      
      <h3>Major Producers</h3>
      <p>China's rubber process oil industry leaders:</p>
      <ul>
        <li><strong>Sinopec:</strong> Leading TDAE and naphthenic oil producer</li>
        <li><strong>CNOOC Taizhou:</strong> Focus on aviation tire rubber oils</li>
        <li><strong>Zhejiang Xinhu:</strong> 4th generation hydrogenation technology</li>
        <li><strong>Shandong Jinbo:</strong> Acquired Yunnan plant, integrated production</li>
        <li><strong>CNPC Lanzhou:</strong> Narrow fraction naphthenic oil (KV100°C 6.8mm²/s±5%)</li>
      </ul>
      
      <h3>Application-Specific Grades</h3>
      <ul>
        <li><strong>SSBR (Solution Styrene Butadiene Rubber):</strong> 12-15% RPO content for low rolling resistance</li>
        <li><strong>Medical Rubber:</strong> Low extraction grade (<0.6% migration at 72°C/24h)</li>
        <li><strong>Food-grade:</strong> USP Class VI compliant for food contact</li>
        <li><strong>High-performance Tires:</strong> Custom formulations for Michelin certification</li>
      </ul>
      
      <h3>Environmental Trends</h3>
      <p>The industry is transitioning toward sustainable products:</p>
      <ul>
        <li><strong>Traditional RAE Phase-out:</strong> 30% of small capacity (<50,000 tons/year) shut down</li>
        <li><strong>Bio-based RPO:</strong> Palm oil derived products in trial (cost +35-40%)</li>
        <li><strong>CBAM Impact:</strong> EU carbon border tax €8-12/ton from 2027</li>
        <li><strong>Recycling Integration:</strong> Used tire oil recovery programs</li>
      </ul>
      
      <h3>Sourcing Recommendations</h3>
      <p>For international buyers:</p>
      <ol>
        <li>Request full Technical Data Sheet (TDS) and Certificate of Analysis (COA)</li>
        <li>Verify PAH content with independent test results</li>
        <li>Consider TDAE for EU market applications (REACH compliance)</li>
        <li>Request sample for application testing (minimum 5kg)</li>
        <li>Specify packaging requirements (bulk, drums, IBC containers)</li>
        <li>Establish quality specifications in purchase contracts</li>
      </ol>
    `,
    category: 'Technical Information',
    tags: ['Rubber Process Oil', 'Naphthenic Oil', 'TDAE', 'REACH Compliance', 'Tire Manufacturing'],
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    publishedAt: '2024-12-28T08:00:00Z',
    author: 'Technical Team'
  },
  {
    id: '6',
    title: 'White Oil: China\'s Food-Grade and Pharmaceutical Production',
    excerpt: 'China\'s white oil production meets USP and FDA standards for food-grade and pharmaceutical applications, with complete quality certification and competitive pricing.',
    content: `
      <h2>White Oil Industry Overview</h2>
      <p>White oil (also known as mineral oil or liquid paraffin) is a highly refined petroleum product used in pharmaceutical, food, cosmetic, and industrial applications. China has developed significant production capacity for high-purity white oils meeting international standards.</p>
      
      <h3>Product Classification</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Standards</th>
          <th style="border:1px solid #ddd;padding:10px;">Key Applications</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>Pharmaceutical Grade</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">USP, BP, EP, JP, ChP</td>
          <td style="border:1px solid #ddd;padding:10px;">Laxatives, ointment bases, capsule lubricants</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>Food Grade</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">FDA 21 CFR 172.878, 178.3620</td>
          <td style="border:1px solid #ddd;padding:10px;">Food processing, release agents, polishing</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>Cosmetic Grade</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">CTFA, EC 1223/2009</td>
          <td style="border:1px solid #ddd;padding:10px;">Baby oil, skincare, hair care products</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>Industrial Grade</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">ASTM D721</td>
          <td style="border:1px solid #ddd;padding:10px;">Textile, plastics, polymer processing</td>
        </tr>
      </table>
      
      <h3>Technical Specifications Comparison</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Parameter</th>
          <th style="border:1px solid #ddd;padding:10px;">Pharmaceutical Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Food Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Industrial Grade</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Appearance</td>
          <td style="border:1px solid #ddd;padding:10px;">Colorless, transparent</td>
          <td style="border:1px solid #ddd;padding:10px;">Colorless, transparent</td>
          <td style="border:1px solid #ddd;padding:10px;">Water white</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Viscosity at 40°C</td>
          <td style="border:1px solid #ddd;padding:10px;">3-100 mm²/s</td>
          <td style="border:1px solid #ddd;padding:10px;">3-100 mm²/s</td>
          <td style="border:1px solid #ddd;padding:10px;">3-350 mm²/s</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Purity</td>
          <td style="border:1px solid #ddd;padding:10px;">≥99.5%</td>
          <td style="border:1px solid #ddd;padding:10px;">≥99.0%</td>
          <td style="border:1px solid #ddd;padding:10px;">≥98.0%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Aromatic Content</td>
          <td style="border:1px solid #ddd;padding:10px;"><0.1%</td>
          <td style="border:1px solid #ddd;padding:10px;"><0.5%</td>
          <td style="border:1px solid #ddd;padding:10px;"><1.0%</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Sulfur Content</td>
          <td style="border:1px solid #ddd;padding:10px;"><1ppm</td>
          <td style="border:1px solid #ddd;padding:10px;"><5ppm</td>
          <td style="border:1px solid #ddd;padding:10px;"><10ppm</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Heavy Metals</td>
          <td style="border:1px solid #ddd;padding:10px;"><10ppm</td>
          <td style="border:1px solid #ddd;padding:10px;"><10ppm</td>
          <td style="border:1px solid #ddd;padding:10px;">-</td>
        </tr>
      </table>
      
      <h3>Certification Requirements</h3>
      <p>Chinese white oil products comply with:</p>
      <ul>
        <li><strong>USP (United States Pharmacopeia):</strong> Required for pharmaceutical applications in US market</li>
        <li><strong>BP (British Pharmacopoeia):</strong> European pharmaceutical standards acceptance</li>
        <li><strong>FDA 21 CFR 172.878:</strong> Direct food contact applications</li>
        <li><strong>FDA 21 CFR 178.3620(a):</strong> Technical white oil specifications</li>
        <li><strong>NSF H1:</strong> Food-grade lubricant certification</li>
        <li><strong>Kosher & Halal:</strong> Religious dietary certification available</li>
      </ul>
      
      <h3>Production Technology</h3>
      <p>Chinese manufacturers employ advanced processing technologies:</p>
      <ul>
        <li><strong>Deep Hydrogenation:</strong> Removes aromatics, sulfur, and nitrogen compounds</li>
        <li><strong>Molecular Distillation:</strong> Achieves ultra-high purity levels</li>
        <li><strong>Clay Treatment:</strong> Final polishing for color stability</li>
        <li><strong>GMP Facilities:</strong> Pharmaceutical-grade production environments</li>
      </ul>
      
      <h3>Key Applications</h3>
      <ul>
        <li><strong>Pharmaceutical Industry:</strong>
          <ul>
            <li>Laxatives and intestinal lubricants</li>
            <li>Ointment and cream bases</li>
            <li>Capsule and tablet lubricants</li>
            <li>Medical device coatings</li>
          </ul>
        </li>
        <li><strong>Food Processing:</strong>
          <ul>
            <li>Food-grade machinery lubricants</li>
            <li>Baking pan release agents</li>
            <li>Fruit and vegetable coatings</li>
            <li>Egg shell preservatives</li>
          </ul>
        </li>
        <li><strong>Cosmetics:</strong>
          <ul>
            <li>Baby oil formulations</li>
            <li>Skincare and moisturizing products</li>
            <li>Hair care and styling products</li>
            <li>Makeup removers</li>
          </ul>
        </li>
        <li><strong>Industrial:</strong>
          <ul>
            <li>Polystyrene manufacturing</li>
            <li>PVC and plastic processing aids</li>
            <li>Textile fiber lubrication</li>
            <li>Electronics cleaning</li>
          </ul>
        </li>
      </ul>
      
      <h3>Packaging Options</h3>
      <p>Available packaging formats:</p>
      <ul>
        <li><strong>Bulk:</strong> ISO tanks, flexi-bags for large volumes</li>
        <li><strong>IBCs:</strong> 1000L intermediate bulk containers</li>
        <li><strong>Drums:</strong> 200L steel or HDPE drums</li>
        <li><strong>Small Pack:</strong> 5L, 20L containers for specialty grades</li>
      </ul>
      
      <h3>Quality Assurance</h3>
      <p>Standard export documentation:</p>
      <ul>
        <li>Certificate of Analysis (COA) with full specifications</li>
        <li>Certificate of Origin</li>
        <li>USP/BP certification for pharmaceutical grades</li>
        <li>FDA compliance documentation</li>
        <li>Material Safety Data Sheet (MSDS)</li>
        <li>Batch records and traceability documentation</li>
      </ul>
      
      <h3>Market Advantage</h3>
      <p>Chinese white oil offers:</p>
      <ul>
        <li><strong>Cost Efficiency:</strong> 20-30% lower than Western alternatives</li>
        <li><strong>Complete Supply Chain:</strong> From crude oil refining to finished product</li>
        <li><strong>Flexible Volumes:</strong> From small batch specialty to bulk orders</li>
        <li><strong>Custom Formulations:</strong> Viscosity and grade customization available</li>
      </ul>
    `,
    category: 'Technical Information',
    tags: ['White Oil', 'Mineral Oil', 'Food Grade', 'Pharmaceutical', 'USP'],
    featuredImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=450&fit=crop',
    publishedAt: '2024-12-22T08:00:00Z',
    author: 'Technical Team'
  },
  {
    id: '7',
    title: 'Hydraulic Oil: Chinese Premium Products Match International Standards',
    excerpt: 'Premium Chinese hydraulic oils achieve wear scar diameters <0.5mm in ASTM D4172 tests, meeting DIN 51524 specifications with 20-35% cost advantage.',
    content: `
      <h2>Hydraulic Oil Performance Standards</h2>
      <p>Hydraulic oils are critical for reliable operation of hydraulic systems in construction equipment, manufacturing machinery, and industrial applications. Chinese hydraulic oil products have achieved performance levels comparable to leading international brands at competitive prices.</p>
      
      <h3>Performance Benchmarks</h3>
      <p>Premium Chinese hydraulic oils demonstrate excellent test results:</p>
      <ul>
        <li><strong>ASTM D4172 (Four-Ball Wear Test):</strong> Wear scar diameter <0.5mm (exceeds DIN 51524 standard)</li>
        <li><strong>ASTM D2272 (Oxidation Stability):</strong> >3000 hours for premium grades (vs 2000h standard)</li>
        <li><strong>FZG Gear Test:</strong> Failure load stage >12 (excellent anti-wear protection)</li>
        <li><strong>Filterability:</strong> Excellent filterability for modern high-pressure systems</li>
        <li><strong>Thermal Stability:</strong> Stable performance up to 120°C continuous operation</li>
      </ul>
      
      <h3>Product Classification</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Type</th>
          <th style="border:1px solid #ddd;padding:10px;">Standard</th>
          <th style="border:1px solid #ddd;padding:10px;">Characteristics</th>
          <th style="border:1px solid #ddd;padding:10px;">Applications</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>HM</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">GB 11118.1, DIN 51524-2</td>
          <td style="border:1px solid #ddd;padding:10px;">Anti-wear hydraulic oil</td>
          <td style="border:1px solid #ddd;padding:10px;">General industrial, mobile equipment</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>HV</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">GB 11118.1, DIN 51524-3</td>
          <td style="border:1px solid #ddd;padding:10px;">High VI anti-wear oil</td>
          <td style="border:1px solid #ddd;padding:10px;">Wide temperature range, outdoor</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>HS</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">ISO 6743-4</td>
          <td style="border:1px solid #ddd;padding:10px;">Synthetic hydraulic oil</td>
          <td style="border:1px solid #ddd;padding:10px;">Extreme conditions, high performance</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>HETG</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">ISO 15380</td>
          <td style="border:1px solid #ddd;padding:10px;">Biodegradable (HEES/HEPG)</td>
          <td style="border:1px solid #ddd;padding:10px;">Environmentally sensitive areas</td>
        </tr>
      </table>
      
      <h3>Technical Specifications</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Parameter</th>
          <th style="border:1px solid #ddd;padding:10px;">Standard Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Premium Grade</th>
          <th style="border:1px solid #ddd;padding:10px;">Test Method</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Viscosity Grades (ISO VG)</td>
          <td style="border:1px solid #ddd;padding:10px;">15, 22, 32, 46, 68, 100</td>
          <td style="border:1px solid #ddd;padding:10px;">15, 22, 32, 46, 68, 100</td>
          <td style="border:1px solid #ddd;padding:10px;">GB/T 265</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Viscosity Index</td>
          <td style="border:1px solid #ddd;padding:10px;">≥95</td>
          <td style="border:1px solid #ddd;padding:10px;">≥140</td>
          <td style="border:1px solid #ddd;padding:10px;">GB/T 1995</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Flash Point</td>
          <td style="border:1px solid #ddd;padding:10px;">≥180°C</td>
          <td style="border:1px solid #ddd;padding:10px;">≥200°C</td>
          <td style="border:1px solid #ddd;padding:10px;">GB/T 3536</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Pour Point</td>
          <td style="border:1px solid #ddd;padding:10px;">-30°C</td>
          <td style="border:1px solid #ddd;padding:10px;">-45°C</td>
          <td style="border:1px solid #ddd;padding:10px;">GB/T 3535</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Water Separability</td>
          <td style="border:1px solid #ddd;padding:10px;">≤30 min</td>
          <td style="border:1px solid #ddd;padding:10px;">≤15 min</td>
          <td style="border:1px solid #ddd;padding:10px;">GB/T 7305</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Air Release</td>
          <td style="border:1px solid #ddd;padding:10px;">≤10 min</td>
          <td style="border:1px solid #ddd;padding:10px;">≤5 min</td>
          <td style="border:1px solid #ddd;padding:10px;">SH/T 0308</td>
        </tr>
      </table>
      
      <h3>OEM Approvals</h3>
      <p>Major Chinese hydraulic oil brands have obtained approvals from:</p>
      <ul>
        <li><strong>Construction Equipment:</strong> Caterpillar, Komatsu, Hitachi</li>
        <li><strong>Industrial Systems:</strong> Bosch Rexroth, Parker, Eaton</li>
        <li><strong>Machine Tools:</strong> DMG Mori, Mazak, Okuma</li>
        <li><strong>Chinese OEMs:</strong> Sany, XCMG, Zoomlion</li>
      </ul>
      
      <h3>Quality Assurance Systems</h3>
      <p>Chinese hydraulic oil manufacturers implement:</p>
      <ul>
        <li><strong>ISO 9001:</strong> Quality Management System</li>
        <li><strong>ISO 14001:</strong> Environmental Management</li>
        <li><strong>IATF 16949:</strong> Automotive quality standard</li>
        <li><strong>Batch-level Testing:</strong> Full quality documentation per batch</li>
      </ul>
      
      <h3>Cost Advantages</h3>
      <p>Chinese hydraulic oils offer significant value:</p>
      <ul>
        <li><strong>Price Advantage:</strong> 20-35% lower than multinational brands</li>
        <li><strong>Equivalent Performance:</strong> Meeting or exceeding international specifications</li>
        <li><strong>Reliable Supply:</strong> Domestic base oil production ensures availability</li>
        <li><strong>Flexible Logistics:</strong> Multiple packaging and delivery options</li>
      </ul>
      
      <h3>Application Selection Guide</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Operating Condition</th>
          <th style="border:1px solid #ddd;padding:10px;">Recommended Type</th>
          <th style="border:1px solid #ddd;padding:10px;">Viscosity Grade</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Indoor, moderate temperature</td>
          <td style="border:1px solid #ddd;padding:10px;">HM (Standard)</td>
          <td style="border:1px solid #ddd;padding:10px;">VG 32, 46</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Outdoor, temperature variations</td>
          <td style="border:1px solid #ddd;padding:10px;">HV (High VI)</td>
          <td style="border:1px solid #ddd;padding:10px;">VG 32, 46, 68</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">High pressure (>35MPa)</td>
          <td style="border:1px solid #ddd;padding:10px;">HM Premium</td>
          <td style="border:1px solid #ddd;padding:10px;">VG 46, 68</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Extreme temperatures (-40°C to +50°C)</td>
          <td style="border:1px solid #ddd;padding:10px;">HV Premium or HS</td>
          <td style="border:1px solid #ddd;padding:10px;">VG 22, 32</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;">Environmental sensitive areas</td>
          <td style="border:1px solid #ddd;padding:10px;">HETG (Biodegradable)</td>
          <td style="border:1px solid #ddd;padding:10px;">VG 32, 46</td>
        </tr>
      </table>
      
      <h3>Purchasing Recommendations</h3>
      <p>For optimal performance and value:</p>
      <ol>
        <li>Match viscosity grade to operating temperature range</li>
        <li>Consider HV for outdoor or variable temperature applications</li>
        <li>Request OEM approval certificates for equipment warranty compliance</li>
        <li>Obtain sample for equipment compatibility testing</li>
        <li>Establish proper storage and handling procedures</li>
        <li>Implement oil analysis program for condition monitoring</li>
      </ol>
    `,
    category: 'Technical Information',
    tags: ['Hydraulic Oil', 'Anti-wear', 'DIN 51524', 'Industrial Lubricants', 'Performance'],
    featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=450&fit=crop',
    publishedAt: '2024-12-15T08:00:00Z',
    author: 'Technical Team'
  },
  {
    id: '8',
    title: 'New Chinese Regulations: Impact on Special Oil Exports',
    excerpt: 'Updates to GB standards and REACH compliance requirements affect Chinese special oil exports. Updated environmental regulations include mandatory safety data sheets.',
    content: `
      <h2>Regulatory Landscape Updates</h2>
      <p>The Chinese special oil industry operates under an evolving regulatory framework that affects both domestic production and international trade. Recent regulatory changes have significant implications for exporters and international buyers.</p>
      
      <h3>Updated GB Standards (2024-2025)</h3>
      <p>China has updated several key national standards affecting special oils:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Standard</th>
          <th style="border:1px solid #ddd;padding:10px;">Title</th>
          <th style="border:1px solid #ddd;padding:10px;">Status</th>
          <th style="border:1px solid #ddd;padding:10px;">Impact</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>GB 11118.1-2024</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Hydraulic Fluids Specification</td>
          <td style="border:1px solid #ddd;padding:10px;">Effective Jan 2025</td>
          <td style="border:1px solid #ddd;padding:10px;">Updated test methods, stricter limits</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>GB/T 17411-2024</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Transformer Oil Technical Requirements</td>
          <td style="border:1px solid #ddd;padding:10px;">Revised</td>
          <td style="border:1px solid #ddd;padding:10px;">Aligned with IEC 60296:2020</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>HG/T 4911-2026</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Green Tire Rubber Process Oil</td>
          <td style="border:1px solid #ddd;padding:10px;">Draft</td>
          <td style="border:1px solid #ddd;padding:10px;">Mandatory PAH limits (≤10mg/kg)</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>SH/T 0726-2024</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">White Oil Food Grade Specifications</td>
          <td style="border:1px solid #ddd;padding:10px;">Effective</td>
          <td style="border:1px solid #ddd;padding:10px;">Harmonized with FDA 21 CFR</td>
        </tr>
      </table>
      
      <h3>Export Control Changes</h3>
      <p>Recent changes to Chinese export regulations:</p>
      <ul>
        <li><strong>Export License Requirements:</strong> Certain specialty chemicals now require export licenses</li>
        <li><strong>Customs Documentation:</strong> Enhanced product classification and origin verification</li>
        <li><strong>Quality Inspection:</strong> Pre-shipment inspection requirements for certain product categories</li>
        <li><strong>HS Code Updates:</strong> New tariff classifications for specialty oils</li>
      </ul>
      
      <h3>EU REACH Compliance Requirements</h3>
      <p>Chinese products exported to EU must meet REACH requirements:</p>
      <ul>
        <li><strong>Registration:</strong> Substances >1 ton/year require EU registration</li>
        <li><strong>SVHC Compliance:</strong> Substances of Very High Concern limits</li>
        <li><strong>PAH Content:</strong> Maximum 10mg/kg for rubber process oils</li>
        <li><strong>SDS Requirements:</strong> Safety Data Sheets in EU languages</li>
        <li><strong>Authorization:</strong> Certain substances require specific authorization</li>
      </ul>
      
      <h3>Environmental Protection Regulations</h3>
      <p>Chinese environmental regulations affecting the industry:</p>
      <ul>
        <li><strong>Volatile Organic Compounds (VOCs):</strong> Stricter emission limits for production facilities</li>
        <li><strong>Hazardous Waste Management:</strong> Enhanced tracking and disposal requirements</li>
        <li><strong>Green Factory Certification:</strong> Incentives for environmentally compliant facilities</li>
        <li><strong>Carbon Emission Reporting:</strong> Mandatory reporting for major producers</li>
      </ul>
      
      <h3>Safety Data Sheet (SDS) Requirements</h3>
      <p>Updated SDS requirements for exported products:</p>
      <ul>
        <li><strong>Format:</strong> Must comply with GHS (Globally Harmonized System)</li>
        <li><strong>Language:</strong> Required in destination country language</li>
        <li><strong>Content:</strong> 16 sections with complete hazard information</li>
        <li><strong>Updates:</strong> Must be updated within 6 months of new hazard information</li>
        <li><strong>Electronic Format:</strong> Acceptable with proper authentication</li>
      </ul>
      
      <h3>Product Quality Certification</h3>
      <p>Certification requirements for export products:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f5f5f5;">
          <th style="border:1px solid #ddd;padding:10px;">Certification</th>
          <th style="border:1px solid #ddd;padding:10px;">Scope</th>
          <th style="border:1px solid #ddd;padding:10px;">Validity</th>
          <th style="border:1px solid #ddd;padding:10px;">Issuing Authority</th>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>COC (Certificate of Conformity)</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Product quality verification</td>
          <td style="border:1px solid #ddd;padding:10px;">Per shipment</td>
          <td style="border:1px solid #ddd;padding:10px;">CIQ, third-party labs</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>COA (Certificate of Analysis)</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Test results for specifications</td>
          <td style="border:1px solid #ddd;padding:10px;">Per batch</td>
          <td style="border:1px solid #ddd;padding:10px;">Manufacturer, third-party</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>ISO 9001</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Quality management system</td>
          <td style="border:1px solid #ddd;padding:10px;">3 years</td>
          <td style="border:1px solid #ddd;padding:10px;">Accredited certification bodies</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;"><strong>ISO 14001</strong></td>
          <td style="border:1px solid #ddd;padding:10px;">Environmental management</td>
          <td style="border:1px solid #ddd;padding:10px;">3 years</td>
          <td style="border:1px solid #ddd;padding:10px;">Accredited certification bodies</td>
        </tr>
      </table>
      
      <h3>International Trade Implications</h3>
      <p>How regulatory changes affect international buyers:</p>
      <ul>
        <li><strong>Documentation:</strong> Request updated SDS and COA for each shipment</li>
        <li><strong>Compliance Verification:</strong> Verify products meet destination country requirements</li>
        <li><strong>Lead Time:</strong> Allow additional time for regulatory documentation</li>
        <li><strong>Supplier Selection:</strong> Choose suppliers with established compliance track records</li>
        <li><strong>Contract Terms:</strong> Include regulatory compliance requirements in purchase agreements</li>
      </ul>
      
      <h3>Best Practices for Importers</h3>
      <p>Recommended practices for regulatory compliance:</p>
      <ol>
        <li>Request current SDS and technical documentation before purchase</li>
        <li>Verify supplier certifications and test reports</li>
        <li>Confirm product classification under destination country regulations</li>
        <li>Establish clear quality specifications in contracts</li>
        <li>Maintain documentation for customs and regulatory inspection</li>
        <li>Stay informed of regulatory changes through industry associations</li>
        <li>Consider third-party pre-shipment inspection for critical applications</li>
      </ol>
      
      <h3>Resources</h3>
      <p>Key regulatory information sources:</p>
      <ul>
        <li><strong>China National Petroleum Corporation (CNPC):</strong> Industry standards updates</li>
        <li><strong>China Customs:</strong> Export procedures and requirements</li>
        <li><strong>ECHA (European Chemicals Agency):</strong> REACH regulations</li>
        <li><strong>EPA (Environmental Protection Agency):</strong> US regulations</li>
        <li><strong>Industry Associations:</strong> Sector-specific guidance and updates</li>
      </ul>
    `,
    category: 'Regulatory',
    tags: ['Regulations', 'GB Standards', 'REACH', 'Export Compliance', 'Environmental'],
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    publishedAt: '2024-12-10T08:00:00Z',
    author: 'Compliance Team'
  }
];

// 默认管理员用户
const defaultAdminUser: AdminUser = {
  username: 'admin',
  passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99', // MD5 hash of 'password'
  role: 'admin'
};

// 将 Sanity 数据转换为 BlogPost 格式
function transformSanityPost(sanityPost: any): BlogPost {
  return {
    id: sanityPost._id,
    title: sanityPost.title,
    excerpt: sanityPost.excerpt || '',
    content: sanityPost.content || '',
    category: sanityPost.category || 'Industry News',
    tags: sanityPost.tags || [],
    featuredImage: sanityPost.featuredImage 
      ? (typeof sanityPost.featuredImage === 'string' 
          ? sanityPost.featuredImage 
          : urlFor(sanityPost.featuredImage).url())
      : 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop',
    publishedAt: sanityPost.publishedAt || new Date().toISOString(),
    author: sanityPost.author || 'China Special Oil Team'
  };
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingSanity, setIsUsingSanity] = useState(false);

  // 加载博客文章
  useEffect(() => {
    const loadPosts = async () => {
      if (USE_SANITY) {
        // 从 Sanity CMS 获取数据
        try {
          setIsUsingSanity(true);
          const sanityPosts = await sanityClient.fetch(queries.allPosts);
          const transformedPosts = sanityPosts.map(transformSanityPost);
          setPosts(transformedPosts);
          console.log('Loaded posts from Sanity CMS');
        } catch (error) {
          console.error('Failed to fetch from Sanity, falling back to local data:', error);
          loadLocalPosts();
        } finally {
          setIsLoading(false);
        }
      } else {
        // 使用本地数据
        loadLocalPosts();
        setIsLoading(false);
      }
    };

    const loadLocalPosts = () => {
      try {
        // 检查数据版本，确保使用最新的博客数据
        const storedVersion = localStorage.getItem('blogPostsVersion');
        const currentVersion = '2.0'; // 更新版本号以强制刷新数据
        const storedPosts = localStorage.getItem('blogPosts');
        
        if (storedPosts && storedVersion === currentVersion) {
          setPosts(JSON.parse(storedPosts));
        } else {
          // 版本不匹配或首次加载，使用最新的默认数据
          console.log('Refreshing blog data to latest version:', currentVersion);
          localStorage.setItem('blogPosts', JSON.stringify(defaultBlogPosts));
          localStorage.setItem('blogPostsVersion', currentVersion);
          setPosts(defaultBlogPosts);
        }
      } catch (error) {
        console.error('Failed to load local blog posts:', error);
        setPosts(defaultBlogPosts);
      }
    };

    loadPosts();
  }, []);

  // 保存博客文章 (仅本地模式)
  const savePosts = (newPosts: BlogPost[]) => {
    if (isUsingSanity) {
      console.warn('Sanity CMS mode: Local save not available. Use Sanity Studio to manage posts.');
      return;
    }
    try {
      localStorage.setItem('blogPosts', JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Failed to save blog posts:', error);
    }
  };

  // 添加新文章 (仅本地模式)
  const addPost = (post: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost => {
    if (isUsingSanity) {
      throw new Error('Sanity CMS mode: Use Sanity Studio to add posts.');
    }
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString()
    };
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    return newPost;
  };

  // 更新文章 (仅本地模式)
  const updatePost = (id: string, updatedData: Partial<BlogPost>): boolean => {
    if (isUsingSanity) {
      throw new Error('Sanity CMS mode: Use Sanity Studio to update posts.');
    }
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

  // 删除文章 (仅本地模式)
  const deletePost = (id: string): boolean => {
    if (isUsingSanity) {
      throw new Error('Sanity CMS mode: Use Sanity Studio to delete posts.');
    }
    const updatedPosts = posts.filter(post => post.id !== id);
    if (updatedPosts.length === posts.length) return false;
    
    savePosts(updatedPosts);
    return true;
  };

  // 获取单篇文章
  const getPostById = useCallback((id: string): BlogPost | undefined => {
    return posts.find(post => post.id === id);
  }, [posts]);

  // 搜索文章
  const searchPosts = useCallback((query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.category.toLowerCase().includes(lowerQuery)
    );
  }, [posts]);

  // 管理员认证
  const authenticateAdmin = (username: string, password: string): boolean => {
    try {
      const storedAdmin = localStorage.getItem('adminUser');
      const adminUser: AdminUser = storedAdmin ? JSON.parse(storedAdmin) : defaultAdminUser;
      
      const passwordHash = '5f4dcc3b5aa765d61d8327deb882cf99';
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
    isUsingSanity,
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
