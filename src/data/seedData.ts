import { Admin, AppSettings, EvidenceItem, Inspection, Inspector, InspectorPerformance } from '../types';

export const TEAM_INSPECTORS: Inspector[] = [
  {
    id: 'NAVINYA_INS_02',
    name: 'Navinya',
    designation: 'Field Legal Metrology Inspector',
    email: 'navinya.ins02@labellens.gov.in',
    office: 'Legal Metrology Enforcement Wing',
    jurisdiction: 'Field Inspection Unit',
    district: 'Pune District',
    environment: 'FIELD_PRODUCTION',
    avatar: 'NV',
    statusBadge: 'Active Field Duty • Authorized Inspector',
    recentActivity: [],
  },
  {
    id: 'SUDHANSHU_INS_03',
    name: 'Sudhanshu',
    designation: 'Field Legal Metrology Inspector',
    email: 'sudhanshu.ins03@labellens.gov.in',
    office: 'Legal Metrology Enforcement Wing',
    jurisdiction: 'Field Inspection Unit',
    district: 'Mumbai Suburb',
    environment: 'FIELD_PRODUCTION',
    avatar: 'SD',
    statusBadge: 'Active Field Duty • Authorized Inspector',
    recentActivity: [],
  },
  {
    id: 'DEVANSH_INS_04',
    name: 'Devansh',
    designation: 'Field Legal Metrology Inspector',
    email: 'devansh.ins04@labellens.gov.in',
    office: 'Legal Metrology Enforcement Wing',
    jurisdiction: 'Field Inspection Unit',
    district: 'Nagpur Circle',
    environment: 'FIELD_PRODUCTION',
    avatar: 'DV',
    statusBadge: 'Active Field Duty • Authorized Inspector',
    recentActivity: [],
  },
  {
    id: 'NIRMITI_INS_05',
    name: 'Nirmiti',
    designation: 'Field Legal Metrology Inspector',
    email: 'nirmiti.ins05@labellens.gov.in',
    office: 'Legal Metrology Enforcement Wing',
    jurisdiction: 'Field Inspection Unit',
    district: 'Nashik Circle',
    environment: 'FIELD_PRODUCTION',
    avatar: 'NR',
    statusBadge: 'Active Field Duty • Authorized Inspector',
    recentActivity: [],
  },
  {
    id: 'KSHITIJA_INS_06',
    name: 'Kshitija',
    designation: 'Field Legal Metrology Inspector',
    email: 'kshitija.ins06@labellens.gov.in',
    office: 'Legal Metrology Enforcement Wing',
    jurisdiction: 'Field Inspection Unit',
    district: 'Aurangabad Circle',
    environment: 'FIELD_PRODUCTION',
    avatar: 'KS',
    statusBadge: 'Active Field Duty • Authorized Inspector',
    recentActivity: [],
  },
];

export const DEFAULT_INSPECTOR: Inspector = TEAM_INSPECTORS[0];

export const DEFAULT_ADMIN: Admin = {
  id: 'PRASAD_ADMIN_01',
  name: 'Prasad Gajulwar',
  designation: 'Directorate Administrator & Enforcement Head',
  email: 'prasadgajulwar120@gmail.com',
  department: 'Directorate of Legal Metrology',
  supervisoryJurisdiction: 'Team Supervision & Compliance Command',
  headquarters: 'Directorate Headquarters',
  role: 'ADMIN',
};

// SVG Generators for the single demo package
export function createMockFrontPackageSvg(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Bag Canvas -->
  <rect x="50" y="40" width="700" height="920" rx="16" fill="#fcfbf7" stroke="#cbd5e1" stroke-width="3" filter="url(#shadow)"/>

  <!-- Top Banner Ribbon -->
  <path d="M50 40 Q400 70 750 40 L750 120 Q400 150 50 120 Z" fill="#8c2518"/>
  <text x="400" y="95" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">AUTHENTIC GRAINS SELECTION</text>

  <!-- Brand Emblem -->
  <circle cx="400" cy="240" r="70" fill="#d97706" stroke="#b45309" stroke-width="4"/>
  <text x="400" y="235" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">ANNAPURNA</text>
  <text x="400" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fef3c7" text-anchor="middle" letter-spacing="1.5">SINCE 1984</text>

  <!-- Product Title -->
  <text x="400" y="370" font-family="sans-serif" font-size="46" font-weight="900" fill="#1e293b" text-anchor="middle">PREMIUM RICE</text>
  <text x="400" y="405" font-family="sans-serif" font-size="20" font-weight="600" fill="#64748b" text-anchor="middle">Long Grain Aged Basmati</text>

  <!-- Product Graphic Centerpiece -->
  <rect x="180" y="440" width="440" height="260" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <path d="M220 620 C280 500 520 500 580 620 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
  <circle cx="400" cy="520" r="28" fill="#eab308" opacity="0.4"/>
  <text x="400" y="650" font-family="sans-serif" font-size="16" font-weight="bold" fill="#713f12" text-anchor="middle">100% NATURALLY AGED</text>

  <!-- Mandatory Net Quantity (Principal Display Panel) -->
  <g id="net-qty-region">
    <rect x="120" y="740" width="560" height="110" rx="8" fill="#ffffff" stroke="#1f5a94" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="140" y="775" font-family="sans-serif" font-size="13" font-weight="bold" fill="#64748b">PRINCIPAL DISPLAY PANEL DECLARATION</text>
    <text x="140" y="815" font-family="sans-serif" font-size="32" font-weight="900" fill="#0f172a">NET QUANTITY : 5 kg</text>
    <rect x="530" y="760" width="130" height="70" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="595" y="785" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">FSSAI LIC NO.</text>
    <text x="595" y="805" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">10019022009871</text>
  </g>

  <!-- Bottom Brand Trust Seal -->
  <rect x="50" y="890" width="700" height="70" rx="0 0 16 16" fill="#1e293b"/>
  <text x="400" y="932" font-family="sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle">Packed by Annapurna Agro Foods Ltd. • Tested under ISO 22000 Standards</text>
</svg>
`.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createMockBackPackageSvg(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Bag Back Canvas -->
  <rect x="50" y="40" width="700" height="920" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" filter="url(#shadow)"/>

  <!-- Back Panel Title -->
  <rect x="50" y="40" width="700" height="60" rx="16 16 0 0" fill="#0f172a"/>
  <text x="400" y="78" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle" letter-spacing="1">MANDATORY STATUTORY DECLARATIONS (PCR 2011)</text>

  <!-- 1. Manufacturer & Packer Address Block -->
  <rect x="80" y="130" width="640" height="110" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="100" y="160" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">NAME AND ADDRESS OF THE MANUFACTURER &amp; PACKER:</text>
  <text x="100" y="185" font-family="sans-serif" font-size="13" fill="#334155">Annapurna Agro Foods Private Limited</text>
  <text x="100" y="205" font-family="sans-serif" font-size="12" fill="#64748b">Plot No. 44-48, Sector 18, Phase II, Industrial Area, Pune 411026, Maharashtra</text>
  <text x="100" y="225" font-family="sans-serif" font-size="12" fill="#64748b">Customer Care: 1800-220-445 | Email: consumer.care@annapurna.demo</text>

  <!-- 2. Consumer Care & Batch Declaration Block -->
  <rect x="80" y="260" width="640" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="100" y="290" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">BATCH &amp; COMMODITY PARTICULARS:</text>
  <text x="100" y="315" font-family="sans-serif" font-size="12" fill="#334155">Generic Name of Commodity: Basmati Rice (Aged) | Origin: Product of India</text>
  <text x="100" y="335" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a">Batch / Lot No: AP-R26-0814 | Month &amp; Year of Pkg: 08/2026</text>

  <!-- 3. Retail Price & Unit Sale Price Statutory Region -->
  <g id="price-declaration-region">
    <rect x="80" y="375" width="640" height="145" rx="8" fill="#fffbeb" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="100" y="405" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">STATUTORY PRICE MARKING (RULE 6(1)(e))</text>
    <text x="100" y="445" font-family="sans-serif" font-size="28" font-weight="900" fill="#1e293b">MRP ₹ 420.00</text>
    <text x="100" y="475" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">(Inclusive of all taxes)</text>
    <line x1="380" y1="390" x2="380" y2="505" stroke="#fde68a" stroke-width="2"/>
    <text x="410" y="430" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">UNIT SALE PRICE (USP):</text>
    <text x="410" y="465" font-family="sans-serif" font-size="24" font-weight="900" fill="#0f172a">₹ 84.00 / kg</text>
    <text x="410" y="490" font-family="sans-serif" font-size="12" fill="#64748b">(Calculated: ₹ 420 / 5 kg)</text>
  </g>

  <!-- 4. Nutritional & Food Safety Grid -->
  <rect x="80" y="540" width="640" height="160" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="100" y="565" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">NUTRITIONAL FACTS (Per 100g serving):</text>
  <text x="100" y="595" font-family="sans-serif" font-size="12" fill="#475569">Energy: 356 kcal • Carbohydrates: 78.2g • Protein: 8.4g • Total Fat: 0.5g • Dietary Fiber: 1.8g</text>
  <line x1="100" y1="610" x2="700" y2="610" stroke="#f1f5f9"/>
  <text x="100" y="635" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">VEGETARIAN GREEN DOT LOGO PRESENT</text>
  <text x="100" y="655" font-family="sans-serif" font-size="12" fill="#64748b">Store in a cool, hygienic &amp; dry place. Keep away from direct sunlight.</text>
  <text x="100" y="678" font-family="sans-serif" font-size="12" fill="#64748b">FSSAI Lic No: 10019022009871 | ISO 22000:2018 Certified Unit</text>

  <!-- 5. Barcode & Verification Footer -->
  <rect x="80" y="720" width="640" height="200" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g id="barcode-group">
    <rect x="110" y="745" width="220" height="120" fill="#ffffff" stroke="#94a3b8"/>
    <rect x="128" y="755" width="8" height="85" fill="#0f172a"/>
    <rect x="142" y="755" width="4" height="85" fill="#0f172a"/>
    <rect x="152" y="755" width="10" height="85" fill="#0f172a"/>
    <rect x="168" y="755" width="5" height="85" fill="#0f172a"/>
    <rect x="180" y="755" width="3" height="85" fill="#0f172a"/>
    <rect x="190" y="755" width="12" height="85" fill="#0f172a"/>
    <rect x="210" y="755" width="4" height="85" fill="#0f172a"/>
    <rect x="220" y="755" width="8" height="85" fill="#0f172a"/>
    <rect x="235" y="755" width="3" height="85" fill="#0f172a"/>
    <rect x="245" y="755" width="7" height="85" fill="#0f172a"/>
    <rect x="260" y="755" width="11" height="85" fill="#0f172a"/>
    <text x="185" y="855" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">8 901030 847291</text>
  </g>

  <!-- Legal Metrology Verification Seal Box -->
  <rect x="360" y="745" width="340" height="155" rx="6" fill="#f0fdf4" stroke="#86efac"/>
  <text x="375" y="775" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">LEGAL METROLOGY PCR 2011 CHECK REGION</text>
  <text x="375" y="800" font-family="sans-serif" font-size="12" fill="#15803d">Target statutory coordinates:</text>
  <text x="375" y="822" font-family="monospace" font-size="11" fill="#166534">• Net Qty: Ref Front Panel (5 kg)</text>
  <text x="375" y="842" font-family="monospace" font-size="11" fill="#166534">• Unit Sale Price: ₹ 84.00 / kg</text>
  <text x="375" y="862" font-family="monospace" font-size="11" fill="#166534">• MRP Syntax: Requires Review</text>
</svg>
`.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Single reference benchmark inspection for calibration and testing
export const DEMO_INSPECTION: Inspection = {
  id: 'DEMO-INS-2026-0001',
  isDemo: true,
  status: 'REVIEW_REQUIRED',
  inspectionDate: '2026-08-31',
  inspectorId: 'SYSTEM_BENCHMARK',
  inspectorName: 'Reference Benchmark Package',
  jurisdiction: 'Maharashtra Enforcement Circle',
  inspectionType: 'Routine market surveillance',
  business: {
    name: 'Shakti General Store',
    type: 'Retailer',
    address: '12 Market Road, Pune, Maharashtra',
    contact: '+91 98230 45678',
  },
  product: {
    category: 'Packaged food',
    brand: 'Annapurna',
    name: 'Premium Basmati Rice (Aged)',
    packageType: 'Printed retail pack',
    declaredQuantity: '5 kg',
  },
  context: {
    inspectionType: 'Routine market surveillance',
    source: 'Retail Shelf Sample',
    inspectorNotes: 'Standard reference benchmark inspection. Sample retail rice package for testing optical compliance and font height ratio under PCR 2011.',
    location: 'Shakti General Store, Pune',
  },
  images: [
    {
      id: 'IMG-DEMO-FRONT',
      filename: 'annapurna-rice-front-sample.jpg',
      role: 'FRONT',
      width: 1600,
      height: 1200,
      captureSource: 'upload',
      dataUrl: createMockFrontPackageSvg(),
      uploadedAt: '2026-08-31 10:15 AM',
      mimeType: 'image/jpeg',
    },
    {
      id: 'IMG-DEMO-BACK',
      filename: 'annapurna-rice-back-sample.jpg',
      role: 'BACK',
      width: 1600,
      height: 1200,
      captureSource: 'upload',
      dataUrl: createMockBackPackageSvg(),
      uploadedAt: '2026-08-31 10:16 AM',
      mimeType: 'image/jpeg',
    },
  ],
  fieldsReviewed: 8,
  findings: [
    {
      id: 'F-001',
      severity: 'MEDIUM',
      title: 'Declared quantity typography verification',
      description:
        'The package quantity is extracted as 5 kg on the principal display panel. Statutory font height and unit abbreviation compliance must be confirmed by inspector.',
      relatedField: 'declaredQuantity',
      confidence: 'HIGH',
      evidenceIds: ['EV-001'],
      reviewStatus: 'PENDING',
      ruleReference: 'Rule 13, Legal Metrology (Packaged Commodities) Rules 2011 — Font height ratio for net quantity declaration.',
    },
    {
      id: 'F-002',
      severity: 'HIGH',
      title: 'Retail price marking review',
      description:
        'A price-marking region is present showing ₹ 420. Mandatory qualifier "inclusive of all taxes" and Unit Sale Price formatting require regulatory verification.',
      relatedField: 'retailPrice',
      confidence: 'MEDIUM',
      evidenceIds: ['EV-002'],
      reviewStatus: 'PENDING',
      ruleReference: 'Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules 2011 — Maximum Retail Price declaration requirements.',
    },
  ],
  extractedFields: [
    { id: 'EF-001', name: 'Brand Name', value: 'Annapurna', source: 'Front Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-FRONT' },
    { id: 'EF-002', name: 'Product Descriptor', value: 'Premium Rice (Long Grain Aged Basmati)', source: 'Front Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-FRONT' },
    { id: 'EF-003', name: 'Declared Net Quantity', value: '5 kg', source: 'Front Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-FRONT' },
    { id: 'EF-004', name: 'Maximum Retail Price (MRP)', value: '₹ 420.00', source: 'Rear Panel', status: 'REVIEW_REQUIRED', confidence: 'MEDIUM', sourceImageId: 'IMG-DEMO-BACK' },
    { id: 'EF-005', name: 'Unit Sale Price (USP)', value: '₹ 84.00 / kg', source: 'Rear Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-BACK' },
    { id: 'EF-006', name: 'Month & Year of Manufacture', value: '08/2026', source: 'Rear Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-BACK' },
    { id: 'EF-007', name: 'Consumer Care Contact', value: 'care@annapurna.in / 1800-220-445', source: 'Rear Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-BACK' },
    { id: 'EF-008', name: 'FSSAI License', value: '10019022009871', source: 'Front Panel', status: 'DETECTED', confidence: 'HIGH', sourceImageId: 'IMG-DEMO-FRONT' },
  ],
  evidence: [
    {
      id: 'EV-001',
      inspectionId: 'DEMO-INS-2026-0001',
      type: 'IMAGE_REGION',
      sourceImageId: 'IMG-DEMO-FRONT',
      label: 'Principal Display Panel Net Qty',
      description: 'Bounding box for "NET QUANTITY : 5 kg" measuring ~6.2mm optical height.',
      region: { x: 15, y: 74, width: 70, height: 11, label: 'Declared Net Quantity (5 kg)' },
      linkedFindingIds: ['F-001'],
      confidence: 'HIGH',
      reviewStatus: 'PENDING',
      reviewerNote: 'Reference evidence bounding box for net quantity.',
    },
    {
      id: 'EV-002',
      inspectionId: 'DEMO-INS-2026-0001',
      type: 'IMAGE_REGION',
      sourceImageId: 'IMG-DEMO-BACK',
      label: 'MRP Declaration & Tax Phrasing',
      description: 'Back panel price stamping region: "MRP ₹ 420.00 (Incl. of all taxes)".',
      region: { x: 10, y: 37, width: 80, height: 15, label: 'MRP Marking Box' },
      linkedFindingIds: ['F-002'],
      confidence: 'MEDIUM',
      reviewStatus: 'PENDING',
      reviewerNote: 'Reference evidence bounding box for retail sale price declaration.',
    },
  ],
  reviewerOverallNotes: 'Standard reference benchmark inspection. Sample retail rice package for testing optical compliance and font height ratio under PCR 2011.',
  lastUpdated: '2026-08-31 10:20 AM',
  createdAt: '2026-08-31 10:15 AM',
  updatedAt: '2026-08-31 10:20 AM',
  analysisMode: 'AI_ASSISTED',
};

// Seed inspections with the reference benchmark
export const SEED_INSPECTIONS: Inspection[] = [DEMO_INSPECTION];

export const DEFAULT_SETTINGS: AppSettings = {
  inspector: DEFAULT_INSPECTOR,
  jurisdiction: {
    state: 'Maharashtra',
    division: 'Pune Division',
    district: 'Pune District',
    defaultLocation: 'Pune Market Circle',
  },
  preferences: {
    dateFormat: 'DD/MM/YYYY',
    reportTheme: 'institutional_light',
    notifications: true,
    showWorkflowHints: true,
  },
  about: {
    appName: 'LabelLens',
    version: '2.4.0 (Enterprise Field Deployment)',
    problemStatement: 'Legal Metrology Enforcement System',
    prototypeDisclaimer:
      'Assistive tool for authorized Legal Metrology Officers under the Legal Metrology (Packaged Commodities) Rules, 2011. Final compliance determination remains strictly with the designated officer.',
  },
};

export const RULE_REFERENCES = [
  {
    code: 'PCR Rule 13',
    title: 'Ratio of Font Height to Principal Display Panel Area',
    requirement: 'For net weight > 1 kg to 5 kg, minimum numeral font height must be 4.0 mm (6.0 mm if blown/embossed).',
  },
  {
    code: 'PCR Rule 6(1)(e)',
    title: 'Retail Sale Price (MRP) Declaration Syntax',
    requirement: 'Maximum Retail Price must state "Inclusive of all taxes" or "Incl. of all taxes".',
  },
  {
    code: 'PCR Rule 6(1)(da)',
    title: 'Unit Sale Price (USP) Display',
    requirement: 'Mandatory declaration of Unit Sale Price per g/kg/ml/l on packages containing more than 1 unit/quantity.',
  },
  {
    code: 'PCR Rule 6(1)(a)',
    title: 'Name and Address of Manufacturer / Packer / Importer',
    requirement: 'Complete postal address, pin code, and legal corporate entity name must be legible.',
  },
];
