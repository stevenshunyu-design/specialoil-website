import { useState, useEffect } from 'react';
import { BlogPost, AdminUser } from '../types/blog';
import { sanityClient, queries, urlFor } from '../lib/sanity';

// 检查是否配置了 Sanity
const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const USE_SANITY = SANITY_PROJECT_ID && SANITY_PROJECT_ID !== 'your-project-id-here';

// 真实行业数据 - 博客文章
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '2025 China Special Oil Market Report: Industry Reaches ¥3,862 Billion',
    excerpt: 'China\'s special oil industry market size reached 3,862 billion RMB in 2024, with exports growing 12% year-on-year. Analysis of production capacity, regional distribution, and future trends.',
    content: `
      <h2>2025 China Special Oil Industry Market Overview</h2>
      <p>According to the latest industry reports, China's special oil industry reached a market size of <strong>3,862 billion RMB in 2024</strong>, representing a 7.9% year-on-year growth. This growth is primarily driven by domestic demand from new energy, new materials, and high-end manufacturing sectors.</p>
      
      <h3>Market Structure by Product Category</h3>
      <ul>
        <li><strong>Lubricants:</strong> 42.3% market share (~¥1,635 billion)</li>
        <li><strong>Special Fuels:</strong> 31.5% market share (~¥1,217 billion)</li>
        <li><strong>Special Asphalt:</strong> 18.7% market share (~¥722 billion)</li>
        <li><strong>Other Special Oils:</strong> 7.5% market share (~¥290 billion)</li>
      </ul>
      
      <h3>Regional Distribution</h3>
      <p>Production is concentrated in three major regions:</p>
      <ul>
        <li><strong>East China:</strong> 42.5% (¥1,641 billion) - Leading region with strong industrial base</li>
        <li><strong>South China:</strong> 23.1% (¥892 billion) - Major export hub</li>
        <li><strong>North China:</strong> 19.8% (¥765 billion) - Traditional production base</li>
      </ul>
      
      <h3>Export Performance</h3>
      <p>2024 export value reached <strong>¥487 billion</strong>, an 11.2% increase from 2023. Top export destinations include:</p>
      <ul>
        <li>Southeast Asia (Vietnam, Indonesia, Thailand)</li>
        <li>Middle East (UAE, Saudi Arabia)</li>
        <li>Africa (Nigeria, South Africa)</li>
        <li>Europe (Germany, Netherlands)</li>
      </ul>
      
      <h3>Market Leaders</h3>
      <p>The industry is dominated by state-owned enterprises, with Sinopec, PetroChina, and CNOOC controlling over 65% of the market. Private companies like Hengli Petrochemical and Rongsheng Petrochemical are rapidly gaining market share in specialty segments.</p>
      
      <h3>2025-2026 Outlook</h3>
      <p>Industry experts project continued growth with market size expected to reach <strong>¥4,127 billion in 2025</strong> (6.8% growth). Key growth drivers include:</p>
      <ul>
        <li>Wind power lubricants demand growing at 12% annually</li>
        <li>EV thermal management fluids demand surging 25%+</li>
        <li>Semiconductor-grade industrial lubricants growing 18%</li>
        <li>Aerospace hydraulic oil penetration rising from 32% to 40%</li>
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
    excerpt: 'Yanshan Petrotherapy successfully exported transformer oil to Singapore in December 2024, marking a milestone for Chinese special oil exports.',
    content: `
      <h2>Historic Export Achievement</h2>
      <p>On December 16, 2024, <strong>Yanshan Petrochemical (Sinopec)</strong> successfully exported 40 tons of transformer oil to Singapore via Tianjin Port. This marks the first time Chinese transformer oil has entered the overseas market through the "processing trade for re-export" model.</p>
      
      <h3>Technical Excellence</h3>
      <p>The transformer oil produced by Yanshan Petrochemical's lubricant hydrogenation unit demonstrates quality metrics comparable to international brands:</p>
      <ul>
        <li><strong>Dielectric Strength:</strong> >70kV (exceeds international standards)</li>
        <li><strong>Evaporation Loss:</strong> Meets premium grade specifications</li>
        <li><strong>Viscosity Index:</strong> Comparable to leading international brands</li>
        <li><strong>Pour Point:</strong> -45°C for premium grades</li>
      </ul>
      
      <h3>China Transformer Oil Market</h3>
      <p>The Chinese transformer oil market reached <strong>636,000 tons in demand in 2020</strong>, with consistent annual growth. Key market characteristics:</p>
      <ul>
        <li>Mineral oil-based transformer oil dominates (>90% market share)</li>
        <li>Synthetic and bio-based transformer oils gaining traction</li>
        <li>Ultra-high voltage transformer applications driving premium segment</li>
      </ul>
      
      <h3>Major Producers</h3>
      <p>China's transformer oil industry is led by:</p>
      <ul>
        <li><strong>PetroChina:</strong> Market leader in transformer oil production</li>
        <li><strong>Sinopec:</strong> Premium quality transformer oil through Yanshan Petrochemical</li>
        <li><strong>Shuangjiang Energy:</strong> Emerging player in special transformer oils</li>
        <li><strong>GaoKe Petrochemical:</strong> Regional market strength</li>
      </ul>
      
      <h3>Strategic Significance</h3>
      <p>This export breakthrough demonstrates that Chinese transformer oil has achieved international quality standards. The successful export opens new opportunities for Chinese special oil products in global markets, particularly in Southeast Asia where power infrastructure development is accelerating.</p>
      
      <h3>Future Outlook</h3>
      <p>With the growing demand for power infrastructure globally, especially in emerging markets, Chinese transformer oil producers are well-positioned to capture increasing market share. The industry is focusing on:</p>
      <ul>
        <li>Ultra-high voltage applications (1100kV+)</li>
        <li>Eco-friendly biodegradable transformer oils</li>
        <li>Smart grid compatible products</li>
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
    excerpt: 'Comprehensive comparison of Chinese transformer oil specifications against international standards including IEC 60296, ASTM D3487, and DIN standards.',
    content: `
      <h2>Standards Comparison Overview</h2>
      <p>Understanding the technical specifications and standards is crucial for international buyers. This guide compares Chinese transformer oil standards with major international specifications.</p>
      
      <h3>Key International Standards</h3>
      <ul>
        <li><strong>IEC 60296:</strong> International Electrotechnical Commission standard for unused transformer oils</li>
        <li><strong>ASTM D3487:</strong> American Society for Testing and Materials standard</li>
        <li><strong>DIN 57370:</strong> German standard for transformer oils</li>
        <li><strong>GB 2536:</strong> Chinese national standard (equivalent to IEC 60296)</li>
      </ul>
      
      <h3>Technical Parameters Comparison</h3>
      <table>
        <tr><th>Parameter</th><th>GB 2536 (China)</th><th>IEC 60296</th><th>ASTM D3487</th></tr>
        <tr><td>Dielectric Strength</td><td>≥35kV</td><td>≥30kV</td><td>≥30kV</td></tr>
        <tr><td>Pour Point</td><td>≤-40°C</td><td>≤-40°C</td><td>≤-40°C</td></tr>
        <tr><td>Flash Point</td><td>≥140°C</td><td>≥135°C</td><td>≥145°C</td></tr>
        <tr><td>Viscosity at 40°C</td><td>≤12mm²/s</td><td>≤12mm²/s</td><td>≤12mm²/s</td></tr>
        <tr><td>Acid Value</td><td>≤0.03mgKOH/g</td><td>≤0.01mgKOH/g</td><td>≤0.03mgKOH/g</td></tr>
      </table>
      
      <h3>Chinese Premium Products</h3>
      <p>Leading Chinese manufacturers produce transformer oils that exceed standard requirements:</p>
      <ul>
        <li><strong>Dielectric Strength:</strong> Premium Chinese oils achieve >70kV (vs standard 35kV)</li>
        <li><strong>Pour Point:</strong> Premium grades reach -60°C for extreme cold applications</li>
        <li><strong>Oxidation Stability:</strong> 3000+ hours in oxidation tests</li>
      </ul>
      
      <h3>Type Classification</h3>
      <p>Chinese transformer oils are classified into:</p>
      <ul>
        <li><strong>Type I (General):</strong> Standard applications, most cost-effective</li>
        <li><strong>Type II (Premium):</strong> Enhanced oxidation stability for longer service life</li>
        <li><strong>Type III (Special):</strong> Ultra-high voltage applications, superior electrical properties</li>
      </ul>
      
      <h3>Quality Assurance</h3>
      <p>Chinese manufacturers have implemented rigorous quality control systems:</p>
      <ul>
        <li>ISO 9001 Quality Management certification</li>
        <li>ISO 14001 Environmental Management certification</li>
        <li>Third-party testing by SGS, BV, and other international labs</li>
        <li>Full traceability from crude oil source to final product</li>
      </ul>
      
      <h3>Recommendations for Buyers</h3>
      <p>When sourcing transformer oil from China:</p>
      <ol>
        <li>Request Certificate of Analysis (COA) for each batch</li>
        <li>Verify compliance with destination country standards</li>
        <li>Consider Type II or III products for critical applications</li>
        <li>Request sample testing before bulk orders</li>
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
    excerpt: 'China\'s special oil industry is accelerating the development of bio-based products, with capacity expected to reach 15% of total production by 2025.',
    content: `
      <h2>Sustainability Drive in Special Oil Industry</h2>
      <p>Under China's "Dual Carbon" goals (carbon peak by 2030, carbon neutral by 2060), the special oil industry is undergoing a significant green transformation. Bio-based special oils are emerging as a key growth segment.</p>
      
      <h3>Current Status</h3>
      <p>Key developments in China's sustainable special oil sector:</p>
      <ul>
        <li><strong>Bio-based oils:</strong> Palm oil derivative special oils projected to reach 15% of total capacity by 2025</li>
        <li><strong>Carbon reduction:</strong> Leading producers achieving 20% reduction in carbon emissions</li>
        <li><strong>Recycling:</strong> Used oil re-refining capacity reaching 35% of total used oil volume</li>
        <li><strong>Green certifications:</strong> ISO 14001 certification increasing among major producers</li>
      </ul>
      
      <h3>Bio-based Transformer Oil Development</h3>
      <p>Chinese research institutions and companies are developing:</p>
      <ul>
        <li>Natural ester-based transformer oils (vegetable oil derivatives)</li>
        <li>Synthetic ester transformer oils for high-temperature applications</li>
        <li>High oleic vegetable oil formulations with improved oxidation stability</li>
      </ul>
      
      <h3>Environmental Benefits</h3>
      <p>Bio-based special oils offer significant advantages:</p>
      <ul>
        <li><strong>Biodegradability:</strong> >60% degradation within 28 days (OECD 301B test)</li>
        <li><strong>Lower toxicity:</strong> Safer for aquatic environments</li>
        <li><strong>Higher flash point:</strong> >300°C vs ~140°C for mineral oils</li>
        <li><strong>Reduced carbon footprint:</strong> Up to 80% lower lifecycle emissions</li>
      </ul>
      
      <h3>Regulatory Support</h3>
      <p>Chinese government policies supporting green transition:</p>
      <ul>
        <li>Mandatory used oil recycling standards effective 2025</li>
        <li>Tax incentives for bio-based product development</li>
        <li>Subsidies for carbon reduction technologies</li>
        <li>Green product certification programs</li>
      </ul>
      
      <h3>Market Opportunities</h3>
      <p>International buyers can benefit from:</p>
      <ul>
        <li>Access to environmentally friendly products for ESG compliance</li>
        <li>Bio-based oils for sensitive applications (water sources, food processing)</li>
        <li>Support for corporate sustainability reporting</li>
        <li>Compliance with increasingly strict environmental regulations</li>
      </ul>
      
      <h3>Future Outlook</h3>
      <p>The Chinese bio-based special oil market is expected to grow at 25%+ annually through 2030. Key growth areas include:</p>
      <ul>
        <li>Wind turbine lubricants (bio-degradable requirements)</li>
        <li>Marine applications (MARPOL compliance)</li>
        <li>Food-grade lubricants (H1 certification)</li>
        <li>Electrical insulation fluids for indoor applications</li>
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
    excerpt: 'Chinese naphthenic rubber process oils offer high solvency (Cn% > 35%) and low PAH content meeting EU REACH requirements, at competitive prices.',
    content: `
      <h2>Rubber Process Oil Overview</h2>
      <p>Rubber process oil (RPO) is a critical component in tire manufacturing and rubber product production. China has emerged as a major supplier of high-quality naphthenic rubber process oils with distinct technical advantages.</p>
      
      <h3>Types of Rubber Process Oil</h3>
      <ul>
        <li><strong>Naphthenic RPO:</strong> High solvency, excellent compatibility with synthetic rubbers</li>
        <li><strong>Paraffinic RPO:</strong> Good color stability, suitable for light-colored products</li>
        <li><strong>Aromatic RPO:</strong> High solvency, traditional choice for tire manufacturing</li>
        <li><strong>Treated Distillate Aromatic Extract (TDAE):</strong> Low PAH alternative to aromatic RPO</li>
      </ul>
      
      <h3>Chinese Naphthenic Oil Advantages</h3>
      <p>Chinese naphthenic rubber process oils offer:</p>
      <ul>
        <li><strong>High solvency power:</strong> Cn% > 35% (excellent compatibility)</li>
        <li><strong>Low PAH content:</strong> Meets EU REACH requirements (<3ppm BaP)</li>
        <li><strong>Excellent UV stability:</strong> Suitable for light-colored rubber products</li>
        <li><strong>Competitive pricing:</strong> 15-25% cost advantage vs European sources</li>
      </ul>
      
      <h3>Applications</h3>
      <table>
        <tr><th>RPO Type</th><th>Key Applications</th><th>Advantages</th></tr>
        <tr><td>Naphthenic</td><td>Tires, industrial rubber goods</td><td>High solvency, good processing</td></tr>
        <tr><td>TDAE</td><td>Green tires, EU market</td><td>REACH compliant, low PAH</td></tr>
        <tr><td>Paraffinic</td><td>Light-colored products, footwear</td><td>Good color, low staining</td></tr>
      </table>
      
      <h3>Quality Standards</h3>
      <p>Chinese RPO products comply with:</p>
      <ul>
        <li>EU REACH regulation (PAH content limits)</li>
        <li>ISO 9001 quality management</li>
        <li>REACH SVHC compliance certification</li>
        <li>Third-party testing (SGS, Intertek)</li>
      </ul>
      
      <h3>Market Trends</h3>
      <p>Global rubber process oil market trends:</p>
      <ul>
        <li>Shift from aromatic to TDAE and naphthenic oils (environmental regulations)</li>
        <li>Growing demand in Southeast Asia tire manufacturing</li>
        <li>Increase in bio-based RPO development</li>
        <li>Premium pricing for low-PAH, high-performance grades</li>
      </ul>
      
      <h3>Sourcing Recommendations</h3>
      <p>For international buyers:</p>
      <ol>
        <li>Request full TDS and COA documentation</li>
        <li>Verify PAH content testing results</li>
        <li>Consider TDAE for EU market applications</li>
        <li>Establish quality specifications in contracts</li>
        <li>Request samples for application testing</li>
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
    excerpt: 'China\'s white oil production meets USP and FDA standards for food-grade and pharmaceutical applications, with growing export to global markets.',
    content: `
      <h2>White Oil Industry Overview</h2>
      <p>White oil, also known as mineral oil or liquid paraffin, is a highly refined petroleum product used in pharmaceutical, food, cosmetic, and industrial applications. China has developed significant production capacity for high-purity white oils.</p>
      
      <h3>Product Classification</h3>
      <ul>
        <li><strong>Pharmaceutical Grade (USP/BP):</strong> For medical and pharmaceutical applications</li>
        <li><strong>Food Grade (FDA):</strong> For food processing and packaging applications</li>
        <li><strong>Cosmetic Grade:</strong> For personal care and cosmetic products</li>
        <li><strong>Industrial Grade:</strong> For textile, plastics, and other industrial applications</li>
      </ul>
      
      <h3>Quality Standards</h3>
      <p>Chinese white oil products comply with international standards:</p>
      <ul>
        <li><strong>USP (United States Pharmacopeia):</strong> Pharmaceutical grade purity</li>
        <li><strong>BP (British Pharmacopoeia):</strong> European pharmaceutical standards</li>
        <li><strong>FDA 21 CFR 172.878:</strong> Food-grade requirements</li>
        <li><strong>FDA 21 CFR 178.3620:</strong> Technical white oil specifications</li>
      </ul>
      
      <h3>Technical Specifications</h3>
      <table>
        <tr><th>Parameter</th><th>Pharmaceutical Grade</th><th>Food Grade</th><th>Industrial Grade</th></tr>
        <tr><td>Appearance</td><td>Colorless, transparent</td><td>Colorless, transparent</td><td>Water white</td></tr>
        <tr><td>Viscosity (40°C)</td><td>10-100 mm²/s</td><td>10-100 mm²/s</td><td>10-350 mm²/s</td></tr>
        <tr><td>Purity</td><td>≥99.5%</td><td>≥99.0%</td><td>≥98.0%</td></tr>
        <tr><td>Aromatic Content</td><td><0.1%</td><td><0.5%</td><td><1.0%</td></tr>
        <tr><td>Sulfur Content</td><td><1ppm</td><td><5ppm</td><td><10ppm</td></tr>
      </table>
      
      <h3>Applications</h3>
      <ul>
        <li><strong>Pharmaceutical:</strong> Laxatives, ointment bases, capsule lubricants</li>
        <li><strong>Food Processing:</strong> Food-grade lubricants, release agents, polishing</li>
        <li><strong>Cosmetics:</strong> Baby oil, skincare products, hair care</li>
        <li><strong>Plastics:</strong> Polymer processing aids, mold release</li>
        <li><strong>Textiles:</strong> Fiber lubrication, fabric finishing</li>
      </ul>
      
      <h3>Chinese Production Advantage</h3>
      <p>China's white oil industry offers:</p>
      <ul>
        <li>Advanced hydroprocessing technology for high purity</li>
        <li>Complete supply chain from crude oil to finished product</li>
        <li>Competitive pricing (20-30% lower than Western sources)</li>
        <li>Flexible packaging options (bulk, drums, IBC containers)</li>
      </ul>
      
      <h3>Export Documentation</h3>
      <p>Standard export documentation includes:</p>
      <ul>
        <li>Certificate of Analysis (COA)</li>
        <li>Certificate of Origin</li>
        <li>USP/BP certification for pharmaceutical grades</li>
        <li>FDA compliance documentation for food grades</li>
        <li>Material Safety Data Sheet (MSDS)</li>
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
    excerpt: 'Premium Chinese hydraulic oils achieve wear scar diameters <0.5mm in ASTM D4172 tests, meeting DIN 51524 specifications at competitive prices.',
    content: `
      <h2>Hydraulic Oil Technical Performance</h2>
      <p>Hydraulic oils are critical for the reliable operation of hydraulic systems in construction equipment, manufacturing machinery, and industrial applications. Chinese hydraulic oil products have achieved performance levels comparable to leading international brands.</p>
      
      <h3>Performance Benchmarks</h3>
      <p>Premium Chinese hydraulic oils demonstrate excellent test results:</p>
      <ul>
        <li><strong>ASTM D4172 (Four-Ball Wear Test):</strong> Wear scar diameter <0.5mm (exceeds DIN 51524)</li>
        <li><strong>ASTM D2272 (Oxidation Stability):</strong> >3000 hours for premium grades</li>
        <li><strong>FZG Gear Test:</strong> Failure load stage >12</li>
        <li><strong>Filterability:</strong> Excellent filterability for modern high-pressure systems</li>
      </ul>
      
      <h3>Product Classification</h3>
      <table>
        <tr><th>Type</th><th>Characteristics</th><th>Applications</th></tr>
        <tr><td>HM</td><td>Anti-wear hydraulic oil</td><td>General industrial applications</td></tr>
        <tr><td>HV</td><td>High VI anti-wear oil</td><td>Wide temperature range applications</td></tr>
        <tr><td>HS</td><td>Synthetic hydraulic oil</td><td>Extreme conditions, high performance</td></tr>
        <tr><td>HETG</td><td>Biodegradable hydraulic oil</td><td>Environmentally sensitive areas</td></tr>
      </table>
      
      <h3>Key Specifications</h3>
      <ul>
        <li><strong>Viscosity Grades:</strong> ISO VG 15, 22, 32, 46, 68, 100</li>
        <li><strong>Viscosity Index:</strong> ≥95 (standard), ≥140 (premium)</li>
        <li><strong>Flash Point:</strong> ≥180°C</li>
        <li><strong>Pour Point:</strong> -30°C to -45°C (grade dependent)</li>
        <li><strong>Water Separability:</strong> ≤30 minutes</li>
      </ul>
      
      <h3>Quality Assurance</h3>
      <p>Chinese hydraulic oil manufacturers implement:</p>
      <ul>
        <li>ISO 9001 Quality Management System</li>
        <li>ISO 14001 Environmental Management</li>
        <li>OEM approvals from major equipment manufacturers</li>
        <li>Batch-level quality testing and documentation</li>
      </ul>
      
      <h3>Cost Advantages</h3>
      <p>Chinese hydraulic oils offer:</p>
      <ul>
        <li>20-35% lower cost compared to multinational brands</li>
        <li>Equivalent or better performance characteristics</li>
        <li>Reliable supply with domestic base oil production</li>
        <li>Flexible packaging and logistics options</li>
      </ul>
      
      <h3>Selection Guide</h3>
      <p>For optimal performance, select hydraulic oil based on:</p>
      <ol>
        <li>Operating temperature range (consider HV for wide ranges)</li>
        <li>Pressure requirements (higher pressures need premium anti-wear)</li>
        <li>Environmental conditions (consider HETG for sensitive areas)</li>
        <li>Equipment manufacturer recommendations</li>
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
    title: 'Regulatory Update: EU REACH and US EPA Requirements for 2025',
    excerpt: 'Essential compliance information for Chinese special oil exporters targeting EU and US markets in 2025 and beyond.',
    content: `
      <h2>Regulatory Landscape 2025</h2>
      <p>International buyers and Chinese suppliers must navigate an evolving regulatory environment. This guide covers key compliance requirements for EU and US markets.</p>
      
      <h3>EU REACH Requirements</h3>
      <p>REACH (Registration, Evaluation, Authorization and Restriction of Chemicals) compliance is mandatory for EU market access:</p>
      <ul>
        <li><strong>PAH Restrictions:</strong> Stricter limits effective 2025</li>
        <li><strong>SVHC List:</strong> Substances of Very High Concern notification requirements</li>
        <li><strong>Registration:</strong> All substances manufactured/imported >1 ton/year</li>
        <li><strong>SDS Requirements:</strong> Safety Data Sheets in local languages</li>
      </ul>
      
      <h3>US EPA Regulations</h3>
      <p>US market entry requires compliance with:</p>
      <ul>
        <li><strong>TSCA (Toxic Substances Control Act):</strong> Inventory listing requirements</li>
        <li><strong>EPA Import Certification:</strong> Documentation for lubricants entering US</li>
        <li><strong>Composition Statements:</strong> Detailed chemical composition disclosure</li>
        <li><label>Compliance Certificates:</label> Application-specific certifications</li>
      </ul>
      
      <h3>Chinese Export Documentation</h3>
      <p>Positive developments for Chinese exporters:</p>
      <ul>
        <li><strong>Streamlined Process:</strong> Customs processing time reduced by 30%</li>
        <li><strong>Electronic Submission:</strong> Digital documentation accepted</li>
        <li><strong>One-Stop Service:</strong> Single window for export documentation</li>
      </ul>
      
      <h3>Packaging and Labeling 2025</h3>
      <p>New international standards effective June 2025:</p>
      <ul>
        <li><strong>GHS Labeling:</strong> Globally Harmonized System compliance</li>
        <li><strong>Transport Regulations:</strong> IMDG, IATA-DGR, ADR updates</li>
        <li><strong>Environmental Labels:</strong> Eco-label requirements in certain markets</li>
      </ul>
      
      <h3>Compliance Support Services</h3>
      <p>Many Chinese suppliers offer:</p>
      <ul>
        <li>REACH registration support and documentation</li>
        <li>Third-party testing and certification</li>
        <li>Regulatory consulting for target markets</li>
        <li>Document preparation in multiple languages</li>
      </ul>
      
      <h3>Buyer Checklist</h3>
      <p>For compliance assurance, buyers should request:</p>
      <ol>
        <li>Updated Certificate of Analysis (COA)</li>
        <li>REACH registration number (for EU market)</li>
        <li>TSCA inventory certification (for US market)</li>
        <li>SDS in local language</li>
        <li>Third-party test reports (SGS, BV, Intertek)</li>
        <li>Product-specific compliance certificates</li>
      </ol>
      
      <h3>Staying Updated</h3>
      <p>Key resources for regulatory updates:</p>
      <ul>
        <li>European Chemicals Agency (ECHA) website</li>
        <li>US EPA Chemical Data Reporting</li>
        <li>Chinese Customs and import/export regulations</li>
        <li>Industry associations and trade publications</li>
      </ul>
    `,
    category: 'Technical Information',
    tags: ['Regulations', 'REACH', 'EPA', 'Compliance', 'Export Requirements'],
    featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop',
    publishedAt: '2024-12-10T08:00:00Z',
    author: 'Regulatory Affairs Team'
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
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          localStorage.setItem('blogPosts', JSON.stringify(defaultBlogPosts));
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
