import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

// SEO meta tags for each page in each language
const seoConfig: Record<string, Record<string, { title: string; description: string; keywords: string }>> = {
  home: {
    en: {
      title: 'CN-SpecLube Chain | Specialty Lubricant Supply Chain Platform from China',
      description: 'CN-SpecLube Chain is a leading specialty lubricant supply chain platform from China, providing transformer oil, rubber process oil, finished lubricants and other high-quality industrial lubricant raw materials. Global sourcing, quality assured.',
      keywords: 'specialty lubricants, transformer oil, rubber process oil, industrial lubricants, lubricant raw materials, China lubricant supplier, naphthenic oil, TDAE, RAE'
    },
    'zh-CN': {
      title: 'CN-SpecLube Chain | 中国特种润滑油供应链平台 - 工业润滑油原料供应商',
      description: 'CN-SpecLube Chain 是中国领先的特种润滑油供应链平台，提供变压器油、橡胶操作油、成品润滑油等高品质工业润滑油原料。专业服务于电力、橡胶、石化等行业，全球采购，品质保障。',
      keywords: '特种润滑油,变压器油,橡胶操作油,工业润滑油,润滑油原料,中国润滑油供应商,环烷油,TDAE,DAE,芳烃油'
    },
    'zh-TW': {
      title: 'CN-SpecLube Chain | 中國特種潤滑油供應鏈平台 - 工業潤滑油原料供應商',
      description: 'CN-SpecLube Chain 是中國領先的特種潤滑油供應鏈平台，提供變壓器油、橡膠操作油、成品潤滑油等高品質工業潤滑油原料。專業服務於電力、橡膠、石化等行業，全球採購，品質保障。',
      keywords: '特種潤滑油,變壓器油,橡膠操作油,工業潤滑油,潤滑油原料,中國潤滑油供應商,環烷油,TDAE'
    },
    es: {
      title: 'CN-SpecLube Chain | Plataforma de Cadena de Suministro de Lubricantes Especiales de China',
      description: 'CN-SpecLube Chain es una plataforma líder de cadena de suministro de lubricantes especiales de China, que proporciona aceite para transformadores, aceite de proceso de caucho, lubricantes terminados y otras materias primas de alta calidad.',
      keywords: 'lubricantes especiales, aceite para transformadores, aceite de proceso de caucho, lubricantes industriales, proveedor de lubricantes de China'
    },
    fr: {
      title: 'CN-SpecLube Chain | Plateforme de Chaîne d\'Approvisionnement en Lubrifiants Spéciaux de Chine',
      description: 'CN-SpecLube Chain est une plateforme leader de chaîne d\'approvisionnement en lubrifiants spéciaux de Chine, fournissant de l\'huile pour transformateurs, de l\'huile de processus de caoutchouc, des lubrifiants finis.',
      keywords: 'lubrifiants spéciaux, huile pour transformateurs, huile de processus de caoutchouc, lubrifiants industriels'
    },
    pt: {
      title: 'CN-SpecLube Chain | Plataforma de Cadeia de Fornecimento de Lubrificantes Especiais da China',
      description: 'CN-SpecLube Chain é uma plataforma líder de cadeia de fornecimento de lubrificantes especiais da China, fornecendo óleo para transformadores, óleo de processo de borracha, lubrificantes acabados e outras matérias-primas.',
      keywords: 'lubrificantes especiais, óleo para transformadores, óleo de processo de borracha, lubrificantes industriais'
    },
    ja: {
      title: 'CN-SpecLube Chain | 中国特殊潤滑油サプライチェーンプラットフォーム',
      description: 'CN-SpecLube Chainは中国を代表する特殊潤滑油サプライチェーンプラットフォームです。変圧器油、ゴム加工油、完成潤滑油など高品質な工業用潤滑油原料を提供しています。',
      keywords: '特殊潤滑油,変圧器油,ゴム加工油,工業用潤滑油,潤滑油原料,中国潤滑油サプライヤー'
    },
    ru: {
      title: 'CN-SpecLube Chain | Платформа цепочки поставок специальных смазочных материалов из Китая',
      description: 'CN-SpecLube Chain — ведущая платформа цепочки поставок специальных смазочных материалов из Китая, предоставляющая трансформаторное масло, масло для резины, готовые смазочные материалы и другое сырье.',
      keywords: 'специальные смазочные материалы, трансформаторное масло, масло для резины, промышленные смазки'
    }
  },
  about: {
    en: {
      title: 'About Us | CN-SpecLube Chain - Specialty Lubricant Supply Chain Platform',
      description: 'Learn about CN-SpecLube Chain, your trusted partner for specialty lubricants from China. We connect global buyers with quality Chinese lubricant manufacturers.',
      keywords: 'about CN-SpecLube, China lubricant supplier, specialty oils, supply chain partner'
    },
    'zh-CN': {
      title: '关于我们 | CN-SpecLube Chain - 特种润滑油供应链平台',
      description: '了解 CN-SpecLube Chain，您值得信赖的中国特种润滑油合作伙伴。我们连接全球买家与中国优质润滑油生产商。',
      keywords: '关于CN-SpecLube, 中国润滑油供应商, 特种油品, 供应链合作伙伴'
    },
    'zh-TW': {
      title: '關於我們 | CN-SpecLube Chain - 特種潤滑油供應鏈平台',
      description: '了解 CN-SpecLube Chain，您值得信賴的中國特種潤滑油合作夥伴。我們連接全球買家與中國優質潤滑油生產商。',
      keywords: '關於CN-SpecLube, 中國潤滑油供應商, 特種油品, 供應鏈合作夥伴'
    },
    es: {
      title: 'Sobre Nosotros | CN-SpecLube Chain - Plataforma de Cadena de Suministro',
      description: 'Conozca CN-SpecLube Chain, su socio de confianza para lubricantes especiales de China.',
      keywords: 'sobre CN-SpecLube, proveedor de lubricantes de China'
    },
    fr: {
      title: 'À Propos | CN-SpecLube Chain - Plateforme de Chaîne d\'Approvisionnement',
      description: 'Découvrez CN-SpecLube Chain, votre partenaire de confiance pour les lubrifiants spéciaux de Chine.',
      keywords: 'à propos CN-SpecLube, fournisseur de lubrifiants Chine'
    },
    pt: {
      title: 'Sobre Nós | CN-SpecLube Chain - Plataforma de Cadeia de Fornecimento',
      description: 'Conheça a CN-SpecLube Chain, sua parceira de confiança para lubrificantes especiais da China.',
      keywords: 'sobre CN-SpecLube, fornecedor de lubrificantes China'
    },
    ja: {
      title: '会社概要 | CN-SpecLube Chain - 特殊潤滑油サプライチェーンプラットフォーム',
      description: 'CN-SpecLube Chainについて - 中国の特殊潤滑油の信頼できるパートナー。',
      keywords: 'CN-SpecLube概要, 中国潤滑油サプライヤー'
    },
    ru: {
      title: 'О Нас | CN-SpecLube Chain - Платформа цепочки поставок',
      description: 'Узнайте о CN-SpecLube Chain — вашем надежном партнере по специальным смазочным материалам из Китая.',
      keywords: 'о CN-SpecLube, поставщик смазочных материалов Китая'
    }
  },
  transformerOil: {
    en: {
      title: 'Transformer Oil | SpecVolt™ Series - CN-SpecLube Chain',
      description: 'Premium naphthenic transformer oils for high-voltage applications. SpecVolt™ series offers excellent dielectric strength, thermal stability, and low temperature performance. IEC 60296, ASTM D3487 compliant.',
      keywords: 'transformer oil, insulating oil, naphthenic oil, SpecVolt, high voltage, IEC 60296, ASTM D3487, dielectric fluid'
    },
    'zh-CN': {
      title: '变压器油 | SpecVolt™ 系列 - CN-SpecLube Chain',
      description: '高品质环烷基变压器油，适用于高压应用。SpecVolt™ 系列具有优异的介电强度、热稳定性和低温性能。符合 IEC 60296、ASTM D3487 标准。',
      keywords: '变压器油, 绝缘油, 环烷油, SpecVolt, 高压, IEC 60296, ASTM D3487, 介电液体'
    },
    'zh-TW': {
      title: '變壓器油 | SpecVolt™ 系列 - CN-SpecLube Chain',
      description: '高品質環烷基變壓器油，適用於高壓應用。SpecVolt™ 系列具有優異的介電強度、熱穩定性和低溫性能。符合 IEC 60296、ASTM D3487 標準。',
      keywords: '變壓器油, 絕緣油, 環烷油, SpecVolt, 高壓, IEC 60296, ASTM D3487'
    },
    es: {
      title: 'Aceite para Transformadores | Serie SpecVolt™ - CN-SpecLube Chain',
      description: 'Aceites nafténicos premium para transformadores para aplicaciones de alta tensión. La serie SpecVolt™ ofrece excelente resistencia dieléctrica y estabilidad térmica.',
      keywords: 'aceite para transformadores, aceite aislante, aceite nafténico, SpecVolt'
    },
    fr: {
      title: 'Huile pour Transformateurs | Série SpecVolt™ - CN-SpecLube Chain',
      description: 'Huiles naphténiques premium pour transformateurs pour applications haute tension. La série SpecVolt™ offre une excellente rigidité diélectrique et stabilité thermique.',
      keywords: 'huile pour transformateurs, huile isolante, huile naphténique, SpecVolt'
    },
    pt: {
      title: 'Óleo para Transformadores | Série SpecVolt™ - CN-SpecLube Chain',
      description: 'Óleos naftênicos premium para transformadores para aplicações de alta tensão. A série SpecVolt™ oferece excelente rigidez dielétrica e estabilidade térmica.',
      keywords: 'óleo para transformadores, óleo isolante, óleo naftênico, SpecVolt'
    },
    ja: {
      title: '変圧器油 | SpecVolt™ シリーズ - CN-SpecLube Chain',
      description: '高電圧用途のプレミアムナフテン系変圧器油。SpecVolt™ シリーズは優れた絶縁破壊強さ、熱安定性、低温性能を提供します。',
      keywords: '変圧器油, 絶縁油, ナフテン油, SpecVolt, 高電圧, IEC 60296'
    },
    ru: {
      title: 'Трансформаторное Масло | Серия SpecVolt™ - CN-SpecLube Chain',
      description: 'Премиальные нафтеновые трансформаторные масла для высоковольтных применений. Серия SpecVolt™ обеспечивает превосходную диэлектрическую прочность и термическую стабильность.',
      keywords: 'трансформаторное масло, изоляционное масло, нафтеновое масло, SpecVolt'
    }
  },
  rubberProcessOil: {
    en: {
      title: 'Rubber Process Oil | SpecFlex™ Series - CN-SpecLube Chain',
      description: 'High-solvency naphthenic oils for rubber compounding and tire manufacturing. SpecFlex™ series provides excellent processing characteristics and meets EU REACH low PAH requirements.',
      keywords: 'rubber process oil, naphthenic oil, TDAE, RAE, tire manufacturing, rubber compounding, SpecFlex, low PAH'
    },
    'zh-CN': {
      title: '橡胶操作油 | SpecFlex™ 系列 - CN-SpecLube Chain',
      description: '高溶解力环烷基油，适用于橡胶混炼和轮胎制造。SpecFlex™ 系列具有优异的加工性能，符合欧盟 REACH 低 PAH 要求。',
      keywords: '橡胶操作油, 环烷油, TDAE, RAE, 轮胎制造, 橡胶混炼, SpecFlex, 低芳烃'
    },
    'zh-TW': {
      title: '橡膠操作油 | SpecFlex™ 系列 - CN-SpecLube Chain',
      description: '高溶解力環烷基油，適用於橡膠混煉和輪胎製造。SpecFlex™ 系列具有優異的加工性能，符合歐盟 REACH 低 PAH 要求。',
      keywords: '橡膠操作油, 環烷油, TDAE, RAE, 輪胎製造, 橡膠混煉, SpecFlex'
    },
    es: {
      title: 'Aceite de Proceso de Caucho | Serie SpecFlex™ - CN-SpecLube Chain',
      description: 'Aceites nafténicos de alta solvencia para compuestos de caucho y fabricación de neumáticos. La serie SpecFlex™ cumple con los requisitos de PAH bajo de REACH de la UE.',
      keywords: 'aceite de proceso de caucho, aceite nafténico, TDAE, fabricación de neumáticos'
    },
    fr: {
      title: 'Huile de Procédé pour Caoutchouc | Série SpecFlex™ - CN-SpecLube Chain',
      description: 'Huiles naphténiques à haute solvabilité pour le compoundage du caoutchouc et la fabrication de pneus. La série SpecFlex™ répond aux exigences faibles PAH de REACH UE.',
      keywords: 'huile de procédé caoutchouc, huile naphténique, TDAE, fabrication pneus'
    },
    pt: {
      title: 'Óleo de Processo de Borracha | Série SpecFlex™ - CN-SpecLube Chain',
      description: 'Óleos naftênicos de alta solvência para composição de borracha e fabricação de pneus. A série SpecFlex™ atende aos requisitos de baixo PAH do REACH da UE.',
      keywords: 'óleo de processo de borracha, óleo naftênico, TDAE, fabricação de pneus'
    },
    ja: {
      title: 'ゴム加工油 | SpecFlex™ シリーズ - CN-SpecLube Chain',
      description: 'ゴム配合とタイヤ製造用の高溶解性ナフテン系油。SpecFlex™ シリーズは優れた加工特性を持ち、EU REACH低PAH要件を満たしています。',
      keywords: 'ゴム加工油, ナフテン油, TDAE, タイヤ製造, SpecFlex'
    },
    ru: {
      title: 'Масло для Резины | Серия SpecFlex™ - CN-SpecLube Chain',
      description: 'Высокорастворяющие нафтеновые масла для резиновых смесей и производства шин. Серия SpecFlex™ соответствует требованиям низкого содержания ПАУ по REACH ЕС.',
      keywords: 'масло для резины, нафтеновое масло, TDAE, производство шин, SpecFlex'
    }
  },
  finishedLubricants: {
    en: {
      title: 'Finished Lubricants | SpecLube™ Series - CN-SpecLube Chain',
      description: 'High-performance industrial lubricants including hydraulic oils, gear oils, and specialty lubricants. SpecLube™ series offers excellent wear protection and extended equipment life.',
      keywords: 'finished lubricants, hydraulic oil, gear oil, industrial lubricants, SpecLube, wear protection'
    },
    'zh-CN': {
      title: '成品润滑油 | SpecLube™ 系列 - CN-SpecLube Chain',
      description: '高性能工业润滑油，包括液压油、齿轮油和特种润滑剂。SpecLube™ 系列提供优异的磨损保护和延长设备寿命。',
      keywords: '成品润滑油, 液压油, 齿轮油, 工业润滑油, SpecLube, 磨损保护'
    },
    'zh-TW': {
      title: '成品潤滑油 | SpecLube™ 系列 - CN-SpecLube Chain',
      description: '高性能工業潤滑油，包括液壓油、齒輪油和特種潤滑劑。SpecLube™ 系列提供優異的磨損保護和延長設備壽命。',
      keywords: '成品潤滑油, 液壓油, 齒輪油, 工業潤滑油, SpecLube'
    },
    es: {
      title: 'Lubricantes Terminados | Serie SpecLube™ - CN-SpecLube Chain',
      description: 'Lubricantes industriales de alto rendimiento incluyendo aceites hidráulicos y de engranajes. La serie SpecLube™ ofrece excelente protección contra el desgaste.',
      keywords: 'lubricantes terminados, aceite hidráulico, aceite de engranajes, SpecLube'
    },
    fr: {
      title: 'Lubrifiants Finis | Série SpecLube™ - CN-SpecLube Chain',
      description: 'Lubrifiants industriels haute performance incluant huiles hydrauliques et d\'engrenages. La série SpecLube™ offre une excellente protection contre l\'usure.',
      keywords: 'lubrifiants finis, huile hydraulique, huile d\'engrenages, SpecLube'
    },
    pt: {
      title: 'Lubrificantes Acabados | Série SpecLube™ - CN-SpecLube Chain',
      description: 'Lubrificantes industriais de alto desempenho incluindo óleos hidráulicos e de engrenagens. A série SpecLube™ oferece excelente proteção contra desgaste.',
      keywords: 'lubrificantes acabados, óleo hidráulico, óleo de engrenagens, SpecLube'
    },
    ja: {
      title: '完成潤滑油 | SpecLube™ シリーズ - CN-SpecLube Chain',
      description: '高機能工業用潤滑油、作動油、ギアオイル、特殊潤滑油を含む。SpecLube™ シリーズは優れた耐摩耗保護を提供します。',
      keywords: '完成潤滑油, 作動油, ギアオイル, 工業用潤滑油, SpecLube'
    },
    ru: {
      title: 'Готовые Смазочные Материалы | Серия SpecLube™ - CN-SpecLube Chain',
      description: 'Высокопроизводительные промышленные смазочные материалы, включая гидравлические и трансмиссионные масла. Серия SpecLube™ обеспечивает отличную защиту от износа.',
      keywords: 'готовые смазочные материалы, гидравлическое масло, масло для шестерен, SpecLube'
    }
  },
  products: {
    en: {
      title: 'Products | Specialty Lubricants - CN-SpecLube Chain',
      description: 'Explore our comprehensive range of specialty lubricants including transformer oil, rubber process oil, and finished lubricants. Quality products from China\'s leading manufacturers.',
      keywords: 'specialty lubricants products, transformer oil, rubber process oil, finished lubricants, China lubricants'
    },
    'zh-CN': {
      title: '产品中心 | 特种润滑油 - CN-SpecLube Chain',
      description: '探索我们全面的特种润滑油产品系列，包括变压器油、橡胶操作油和成品润滑油。来自中国领先制造商的优质产品。',
      keywords: '特种润滑油产品, 变压器油, 橡胶操作油, 成品润滑油, 中国润滑油'
    },
    'zh-TW': {
      title: '產品中心 | 特種潤滑油 - CN-SpecLube Chain',
      description: '探索我們全面的特種潤滑油產品系列，包括變壓器油、橡膠操作油和成品潤滑油。來自中國領先製造商的優質產品。',
      keywords: '特種潤滑油產品, 變壓器油, 橡膠操作油, 成品潤滑油'
    },
    es: {
      title: 'Productos | Lubricantes Especiales - CN-SpecLube Chain',
      description: 'Explore nuestra gama completa de lubricantes especiales incluyendo aceite para transformadores y aceite de proceso de caucho.',
      keywords: 'productos lubricantes especiales, aceite transformadores, aceite caucho'
    },
    fr: {
      title: 'Produits | Lubrifiants Spéciaux - CN-SpecLube Chain',
      description: 'Explorez notre gamme complète de lubrifiants spéciaux incluant huile pour transformateurs et huile de procédé caoutchouc.',
      keywords: 'produits lubrifiants spéciaux, huile transformateurs, huile caoutchouc'
    },
    pt: {
      title: 'Produtos | Lubrificantes Especiais - CN-SpecLube Chain',
      description: 'Explore nossa gama completa de lubrificantes especiais incluindo óleo para transformadores e óleo de processo de borracha.',
      keywords: 'produtos lubrificantes especiais, óleo transformadores, óleo borracha'
    },
    ja: {
      title: '製品 | 特殊潤滑油 - CN-SpecLube Chain',
      description: '変圧器油、ゴム加工油、完成潤滑油を含む特殊潤滑油の包括的な製品ラインナップをご覧ください。',
      keywords: '特殊潤滑油製品, 変圧器油, ゴム加工油, 完成潤滑油'
    },
    ru: {
      title: 'Продукция | Специальные Смазочные Материалы - CN-SpecLube Chain',
      description: 'Изучите наш широкий ассортимент специальных смазочных материалов, включая трансформаторное масло, масло для резины и готовые смазочные материалы.',
      keywords: 'продукция специальные смазки, трансформаторное масло, масло для резины'
    }
  },
  logistics: {
    en: {
      title: 'Logistics Solutions | CN-SpecLube Chain',
      description: 'Comprehensive logistics solutions for specialty lubricant shipping. Bulk transport, packaged goods, global shipping routes, and customs compliance.',
      keywords: 'logistics solutions, bulk transport, ISO tank, flexibag, lubricant shipping, customs compliance'
    },
    'zh-CN': {
      title: '物流解决方案 | CN-SpecLube Chain',
      description: '全面的特种润滑油物流解决方案。散装运输、包装货物运输、全球航运路线和海关合规。',
      keywords: '物流解决方案, 散装运输, ISO罐, 液体袋, 润滑油运输, 海关合规'
    },
    'zh-TW': {
      title: '物流解決方案 | CN-SpecLube Chain',
      description: '全面的特種潤滑油物流解決方案。散裝運輸、包裝貨物運輸、全球航運路線和海關合規。',
      keywords: '物流解決方案, 散裝運輸, ISO罐, 液體袋, 潤滑油運輸'
    },
    es: {
      title: 'Soluciones Logísticas | CN-SpecLube Chain',
      description: 'Soluciones logísticas integrales para el envío de lubricantes especiales. Transporte a granel, ISO tank, cumplimiento aduanero.',
      keywords: 'soluciones logísticas, transporte a granel, ISO tank, envío lubricantes'
    },
    fr: {
      title: 'Solutions Logistiques | CN-SpecLube Chain',
      description: 'Solutions logistiques complètes pour l\'expédition de lubrifiants spéciaux. Transport vrac, ISO tank, conformité douanière.',
      keywords: 'solutions logistiques, transport vrac, ISO tank, expédition lubrifiants'
    },
    pt: {
      title: 'Soluções Logísticas | CN-SpecLube Chain',
      description: 'Soluções logísticas abrangentes para envio de lubrificantes especiais. Transporte a granel, ISO tank, conformidade aduaneira.',
      keywords: 'soluções logísticas, transporte a granel, ISO tank, envio lubrificantes'
    },
    ja: {
      title: '物流ソリューション | CN-SpecLube Chain',
      description: '特殊潤滑油輸送の包括的な物流ソリューション。バルク輸送、ISOタンク、フレキシバッグ、通関コンプライアンス。',
      keywords: '物流ソリューション, バルク輸送, ISOタンク, 潤滑油輸送'
    },
    ru: {
      title: 'Логистические Решения | CN-SpecLube Chain',
      description: 'Комплексные логистические решения для перевозки специальных смазочных материалов. Перевозка наливом, ISO-контейнеры, таможенное соответствие.',
      keywords: 'логистические решения, перевозка наливом, ISO танк, перевозка смазок'
    }
  },
  quality: {
    en: {
      title: 'Quality Assurance | CN-SpecLube Chain',
      description: 'Our quality management system ensures consistent product quality. ISO 9001 certified, CNAS laboratory testing, international standards compliance.',
      keywords: 'quality assurance, ISO 9001, CNAS laboratory, quality control, international standards'
    },
    'zh-CN': {
      title: '质量保证 | CN-SpecLube Chain',
      description: '我们的质量管理体系确保稳定的产品质量。ISO 9001 认证，CNAS 实验室检测，国际标准合规。',
      keywords: '质量保证, ISO 9001, CNAS 实验室, 质量控制, 国际标准'
    },
    'zh-TW': {
      title: '品質保證 | CN-SpecLube Chain',
      description: '我們的品質管理體系確保穩定的產品品質。ISO 9001 認證，CNAS 實驗室檢測，國際標準合規。',
      keywords: '品質保證, ISO 9001, CNAS 實驗室, 品質控制, 國際標準'
    },
    es: {
      title: 'Garantía de Calidad | CN-SpecLube Chain',
      description: 'Nuestro sistema de gestión de calidad garantiza una calidad de producto consistente. Certificado ISO 9001, pruebas de laboratorio CNAS.',
      keywords: 'garantía de calidad, ISO 9001, laboratorio CNAS, control de calidad'
    },
    fr: {
      title: 'Assurance Qualité | CN-SpecLube Chain',
      description: 'Notre système de management de la qualité assure une qualité de produit constante. Certification ISO 9001, tests laboratoire CNAS.',
      keywords: 'assurance qualité, ISO 9001, laboratoire CNAS, contrôle qualité'
    },
    pt: {
      title: 'Garantia de Qualidade | CN-SpecLube Chain',
      description: 'Nosso sistema de gestão de qualidade garante qualidade de produto consistente. Certificação ISO 9001, testes laboratório CNAS.',
      keywords: 'garantia de qualidade, ISO 9001, laboratório CNAS, controle qualidade'
    },
    ja: {
      title: '品質保証 | CN-SpecLube Chain',
      description: '品質管理システムが一貫した製品品質を保証します。ISO 9001認証、CNAS試験所検査、国際基準準拠。',
      keywords: '品質保証, ISO 9001, CNAS試験所, 品質管理, 国際基準'
    },
    ru: {
      title: 'Обеспечение Качества | CN-SpecLube Chain',
      description: 'Наша система менеджмента качества обеспечивает стабильное качество продукции. Сертификация ISO 9001, испытания в лаборатории CNAS.',
      keywords: 'обеспечение качества, ISO 9001, лаборатория CNAS, контроль качества'
    }
  },
  contact: {
    en: {
      title: 'Contact Us | CN-SpecLube Chain',
      description: 'Get in touch with CN-SpecLube Chain for specialty lubricant inquiries. Our team is ready to assist with your sourcing needs from China.',
      keywords: 'contact CN-SpecLube, lubricant inquiry, China lubricant supplier contact'
    },
    'zh-CN': {
      title: '联系我们 | CN-SpecLube Chain',
      description: '联系 CN-SpecLube Chain 询问特种润滑油事宜。我们的团队随时准备协助您从中国采购的需求。',
      keywords: '联系CN-SpecLube, 润滑油咨询, 中国润滑油供应商联系方式'
    },
    'zh-TW': {
      title: '聯繫我們 | CN-SpecLube Chain',
      description: '聯繫 CN-SpecLube Chain 詢問特種潤滑油事宜。我們的團隊隨時準備協助您從中國採購的需求。',
      keywords: '聯繫CN-SpecLube, 潤滑油諮詢, 中國潤滑油供應商聯繫方式'
    },
    es: {
      title: 'Contáctenos | CN-SpecLube Chain',
      description: 'Póngase en contacto con CN-SpecLube Chain para consultas sobre lubricantes especiales.',
      keywords: 'contactar CN-SpecLube, consulta lubricantes, contacto proveedor China'
    },
    fr: {
      title: 'Contactez-Nous | CN-SpecLube Chain',
      description: 'Contactez CN-SpecLube Chain pour vos demandes concernant les lubrifiants spéciaux.',
      keywords: 'contacter CN-SpecLube, demande lubrifiants, contact fournisseur Chine'
    },
    pt: {
      title: 'Entre em Contato | CN-SpecLube Chain',
      description: 'Entre em contato com CN-SpecLube Chain para consultas sobre lubrificantes especiais.',
      keywords: 'contato CN-SpecLube, consulta lubrificantes, contato fornecedor China'
    },
    ja: {
      title: 'お問い合わせ | CN-SpecLube Chain',
      description: '特殊潤滑油に関するお問い合わせはCN-SpecLube Chainまで。中国からの調達ニーズにお手伝いします。',
      keywords: 'CN-SpecLube連絡先, 潤滑油お問い合わせ, 中国潤滑油サプライヤー連絡先'
    },
    ru: {
      title: 'Свяжитесь с Нами | CN-SpecLube Chain',
      description: 'Свяжитесь с CN-SpecLube Chain по вопросам о специальных смазочных материалах. Наша команда готова помочь с закупками из Китая.',
      keywords: 'контакты CN-SpecLube, запрос смазочных материалов, контакт поставщика Китая'
    }
  },
  partners: {
    en: {
      title: 'Strategic Partners | CN-SpecLube Chain',
      description: 'Our strategic partnerships with China\'s leading lubricant manufacturers including PetroChina, Sinopec, CNOOC ensure consistent quality and reliable supply.',
      keywords: 'strategic partners, PetroChina, Sinopec, CNOOC, China lubricant manufacturers'
    },
    'zh-CN': {
      title: '战略合作伙伴 | CN-SpecLube Chain',
      description: '我们与中国石油、中国石化、中国海油等领先润滑油制造商的战略合作伙伴关系确保稳定的质量和可靠的供应。',
      keywords: '战略合作伙伴, 中国石油, 中国石化, 中国海油, 中国润滑油制造商'
    },
    'zh-TW': {
      title: '戰略合作夥伴 | CN-SpecLube Chain',
      description: '我們與中國石油、中國石化、中國海油等領先潤滑油製造商的戰略合作夥伴關係確保穩定的品質和可靠的供應。',
      keywords: '戰略合作夥伴, 中國石油, 中國石化, 中國海油, 中國潤滑油製造商'
    },
    es: {
      title: 'Socios Estratégicos | CN-SpecLube Chain',
      description: 'Nuestras alianzas estratégicas con los principales fabricantes de lubricantes de China incluyendo PetroChina, Sinopec, CNOOC.',
      keywords: 'socios estratégicos, PetroChina, Sinopec, CNOOC, fabricantes lubricantes China'
    },
    fr: {
      title: 'Partenaires Stratégiques | CN-SpecLube Chain',
      description: 'Nos partenariats stratégiques avec les principaux fabricants de lubrifiants chinois dont PetroChina, Sinopec, CNOOC.',
      keywords: 'partenaires stratégiques, PetroChina, Sinopec, CNOOC, fabricants lubrifiants Chine'
    },
    pt: {
      title: 'Parceiros Estratégicos | CN-SpecLube Chain',
      description: 'Nossas parcerias estratégicas com os principais fabricantes de lubrificantes da China incluindo PetroChina, Sinopec, CNOOC.',
      keywords: 'parceiros estratégicos, PetroChina, Sinopec, CNOOC, fabricantes lubrificantes China'
    },
    ja: {
      title: '戦略的パートナー | CN-SpecLube Chain',
      description: 'PetroChina、Sinopec、CNOOCなど中国の主要潤滑油メーカーとの戦略的パートナーシップが安定した品質と信頼できる供給を確保します。',
      keywords: '戦略的パートナー, PetroChina, Sinopec, CNOOC, 中国潤滑油メーカー'
    },
    ru: {
      title: 'Стратегические Партнеры | CN-SpecLube Chain',
      description: 'Наши стратегические партнерские отношения с ведущими китайскими производителями смазочных материалов, включая PetroChina, Sinopec, CNOOC.',
      keywords: 'стратегические партнеры, PetroChina, Sinopec, CNOOC, производители смазок Китай'
    }
  },
  blog: {
    en: {
      title: 'Blog | Industry Insights - CN-SpecLube Chain',
      description: 'Latest news and insights about specialty lubricants industry. Technical articles, market trends, and product updates from CN-SpecLube Chain.',
      keywords: 'lubricant blog, industry insights, technical articles, market trends, CN-SpecLube news'
    },
    'zh-CN': {
      title: '博客 | 行业洞察 - CN-SpecLube Chain',
      description: '特种润滑油行业的最新新闻和见解。来自 CN-SpecLube Chain 的技术文章、市场趋势和产品更新。',
      keywords: '润滑油博客, 行业洞察, 技术文章, 市场趋势, CN-SpecLube新闻'
    },
    'zh-TW': {
      title: '博客 | 行業洞察 - CN-SpecLube Chain',
      description: '特種潤滑油行業的最新新聞和見解。來自 CN-SpecLube Chain 的技術文章、市場趨勢和產品更新。',
      keywords: '潤滑油博客, 行業洞察, 技術文章, 市場趨勢'
    },
    es: {
      title: 'Blog | Perspectivas de la Industria - CN-SpecLube Chain',
      description: 'Últimas noticias e información sobre la industria de lubricantes especiales.',
      keywords: 'blog lubricantes, perspectivas industria, artículos técnicos'
    },
    fr: {
      title: 'Blog | Aperçus de l\'Industrie - CN-SpecLube Chain',
      description: 'Dernières nouvelles et informations sur l\'industrie des lubrifiants spéciaux.',
      keywords: 'blog lubrifiants, aperçus industrie, articles techniques'
    },
    pt: {
      title: 'Blog | Percepções da Indústria - CN-SpecLube Chain',
      description: 'Últimas notícias e percepções sobre a indústria de lubrificantes especiais.',
      keywords: 'blog lubrificantes, percepções indústria, artigos técnicos'
    },
    ja: {
      title: 'ブログ | 業界インサイト - CN-SpecLube Chain',
      description: '特殊潤滑油業界の最新ニュースとインサイト。技術記事、市場動向、製品アップデート。',
      keywords: '潤滑油ブログ, 業界インサイト, 技術記事, 市場動向'
    },
    ru: {
      title: 'Блог | Отраслевые Инсайты - CN-SpecLube Chain',
      description: 'Последние новости и инсайты индустрии специальных смазочных материалов.',
      keywords: 'блог смазки, отраслевые инсайты, технические статьи'
    }
  }
};

// Language to locale mapping for hreflang
const languageLocaleMap: Record<string, string> = {
  'en': 'en',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'es': 'es',
  'fr': 'fr',
  'pt': 'pt',
  'ja': 'ja',
  'ru': 'ru'
};

// Open Graph locale mapping
const ogLocaleMap: Record<string, string> = {
  'en': 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  'es': 'es_ES',
  'fr': 'fr_FR',
  'pt': 'pt_BR',
  'ja': 'ja_JP',
  'ru': 'ru_RU'
};

export function useSEO(pageKey: string) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;
  const baseUrl = 'https://cnspecialtyoils.com';
  const currentPath = location.pathname;

  useEffect(() => {
    // Get SEO data for current page and language
    const pageSeo = seoConfig[pageKey] || seoConfig.home;
    const seo = pageSeo[currentLang] || pageSeo.en;

    // Update document title
    document.title = seo.title;

    // Update or create meta description
    updateMetaTag('description', seo.description);
    
    // Update or create meta keywords
    updateMetaTag('keywords', seo.keywords);

    // Update html lang attribute
    document.documentElement.lang = languageLocaleMap[currentLang] || 'en';

    // Update content-language meta
    updateMetaTag('content-language', currentLang, 'http-equiv');

    // Update canonical URL
    updateLinkTag('canonical', `${baseUrl}${currentPath}`);

    // Update hreflang tags
    updateHreflangTags(currentPath);

    // Update Open Graph tags
    updateOpenGraphTags(seo, currentPath, currentLang);

    // Update Twitter Card tags
    updateTwitterCardTags(seo, currentPath);

    // Update structured data
    updateStructuredData(currentLang);

  }, [currentLang, pageKey, currentPath]);
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' | 'http-equiv' = 'name') {
  let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (meta) {
    meta.content = content;
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    meta.content = content;
    document.head.appendChild(meta);
  }
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (link) {
    link.href = href;
  } else {
    link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}

function updateHreflangTags(currentPath: string) {
  const baseUrl = 'https://cnspecialtyoils.com';
  
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

  // Add hreflang tags for all supported languages
  Object.entries(languageLocaleMap).forEach(([langCode, locale]) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = locale;
    link.href = `${baseUrl}${currentPath}?lang=${langCode}`;
    document.head.appendChild(link);
  });

  // Add x-default hreflang (defaults to English)
  const xDefaultLink = document.createElement('link');
  xDefaultLink.rel = 'alternate';
  xDefaultLink.hreflang = 'x-default';
  xDefaultLink.href = `${baseUrl}${currentPath}`;
  document.head.appendChild(xDefaultLink);
}

function updateOpenGraphTags(seo: { title: string; description: string }, currentPath: string, currentLang: string) {
  const baseUrl = 'https://cnspecialtyoils.com';
  
  updateMetaTag('og:title', seo.title, 'property');
  updateMetaTag('og:description', seo.description, 'property');
  updateMetaTag('og:url', `${baseUrl}${currentPath}`, 'property');
  updateMetaTag('og:locale', ogLocaleMap[currentLang] || 'en_US', 'property');
  
  // Add alternate locales
  const existingAlters = document.querySelectorAll('meta[property="og:locale:alternate"]');
  existingAlters.forEach(el => el.remove());
  
  Object.entries(ogLocaleMap).forEach(([lang, locale]) => {
    if (lang !== currentLang) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:locale:alternate');
      meta.content = locale;
      document.head.appendChild(meta);
    }
  });
}

function updateTwitterCardTags(seo: { title: string; description: string }, currentPath: string) {
  const baseUrl = 'https://cnspecialtyoils.com';
  
  updateMetaTag('twitter:title', seo.title, 'name');
  updateMetaTag('twitter:description', seo.description, 'name');
  updateMetaTag('twitter:url', `${baseUrl}${currentPath}`, 'name');
}

function updateStructuredData(currentLang: string) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CN-SpecLube Chain",
    "alternateName": "China Specialty Lubricant Supply Chain",
    "url": "https://cnspecialtyoils.com",
    "logo": "https://cnspecialtyoils.com/favicon.png",
    "description": currentLang === 'zh-CN' 
      ? "中国领先的特种润滑油供应链平台，提供变压器油、橡胶操作油、成品润滑油等高品质工业润滑油原料。"
      : "Leading specialty lubricant supply chain platform from China, providing transformer oil, rubber process oil, finished lubricants and other high-quality industrial lubricant raw materials.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressRegion": "China"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Chinese", "English", "Spanish", "French", "Portuguese", "Japanese", "Russian"]
    },
    "sameAs": []
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

export default useSEO;
