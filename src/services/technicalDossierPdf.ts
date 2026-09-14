import { jsPDF } from 'jspdf';

/**
 * LabelLens Technical Research & System Architecture Dossier Generator
 * Generates an exhaustive, multi-page, formatted PDF detailing:
 * - Complete Tech Stack & Exact Library Versions with Technical Justifications
 * - Computer Vision & Image Processing Algorithms (with formulas)
 * - Statutory PCR 2011 Engine Rules & Mathematical Models
 * - Multimodal AI (Gemini 3.8 Flash) Pipeline
 * - Full-Stack Architecture, Sync Protocols, and Security Safeguards
 * - 6-Step Field Standard Operating Procedure (SOP)
 */
export function generateTechnicalDossierPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const pageNum = doc.getNumberOfPages();
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('LABELLENS - LEGAL METROLOGY PCR 2011 SURVEILLANCE SUITE', margin, 10);
    doc.text('TECHNICAL RESEARCH & ARCHITECTURAL DOSSIER', pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Government of India • Directorate of Legal Metrology • Official Technical Specification', margin, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // Initial header and footer
  drawHeaderFooter();

  // ==========================================
  // COVER / TITLE BLOCK
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('LABELLENS: LEGAL METROLOGY SURVEILLANCE SUITE', margin + 6, y + 9);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Statutory Architecture, Software Inventory, Computer Vision & Multimodal AI Research', margin + 6, y + 16);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Enforcing the Legal Metrology Act, 2009 & Packaged Commodities Rules (PCR), 2011 (Amended 2024)', margin + 6, y + 23);

  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248);
  doc.text('Document Ref: LABELLENS-TR-2026-V2.4 • Model: Gemini 3.8 Flash • Node: Express ESM • UI: React 19', margin + 6, y + 31);

  y += 44;

  // Render Section Header
  const renderSectionHeader = (title: string, subtitle?: string) => {
    checkPageOverflow(20);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 3, y + 5.5);
    y += 11;
    if (subtitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, margin + 1, y);
      y += 5;
    }
  };

  // Render Paragraph
  const renderParagraph = (text: string, fontSize = 8.2, color = [51, 65, 85]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageOverflow(lines.length * 3.8 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 3.8 + 2;
  };

  // Render Tech Table Row
  const renderTableRow = (col1: string, col2: string, col3: string, col4: string) => {
    checkPageOverflow(9);
    doc.setFontSize(7.8);
    
    // Background highlight
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y - 1, contentWidth, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y - 1, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(col1, margin + 2, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 64, 175);
    doc.text(col2, margin + 38, y + 3.8);

    doc.setTextColor(71, 85, 105);
    doc.text(col3, margin + 74, y + 3.8);

    const descLines = doc.splitTextToSize(col4, contentWidth - 118);
    doc.text(descLines[0] || '', margin + 118, y + 3.8);

    y += 7.2;
  };

  // Render Bullet Item
  const renderBullet = (title: string, desc: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    const bulletPrefix = '•  ' + title + ': ';

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const fullText = bulletPrefix + desc;
    const lines = doc.splitTextToSize(fullText, contentWidth - 4);

    checkPageOverflow(lines.length * 3.8 + 2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('•', margin + 1, y);
    doc.text(title + ':', margin + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const titleOnlyWidth = doc.getTextWidth(title + ': ');
    const firstLineDesc = doc.splitTextToSize(desc, contentWidth - 4 - titleOnlyWidth);
    doc.text(firstLineDesc[0], margin + 4 + titleOnlyWidth, y);

    if (firstLineDesc.length > 1) {
      for (let i = 1; i < firstLineDesc.length; i++) {
        y += 3.8;
        checkPageOverflow(4);
        doc.text(firstLineDesc[i], margin + 4, y);
      }
    }
    y += 4.2;
  };

  // ==========================================
  // SECTION 1: EXECUTIVE SUMMARY & OBJECTIVES
  // ==========================================
  renderSectionHeader('1. EXECUTIVE SUMMARY & PROBLEM FORMULATION', 'Bridging the regulatory enforcement gap between manual field inspections and digital compliance');

  renderParagraph(
    'The Legal Metrology (Packaged Commodities) Rules, 2011 (amended through 2024) under the Legal Metrology Act, 2009 mandatorily enforce that every pre-packaged commercial commodity sold in India displays clear, non-deceptive statutory declarations on its Principal Display Panel (PDP) and back declaration panel. These declarations comprise Rule 6(1)(e) Maximum Retail Price (MRP) with explicit tax-inclusive syntax, Rule 6(1)(da) Unit Sale Price (USP), Rule 11 standard SI metric units, Rule 13 minimum font heights, packing dates, net weight, customer care contact details, and manufacturer/packer identities.'
  );

  renderParagraph(
    'Conventionally, Legal Metrology Officers (LMOs) execute shelf audits using manual physical calipers, subjective visual estimation, and hand-written Form 1 notices. This traditional approach suffers from high inspection latency, human measurement variance, vulnerability to deceptive non-standard font sizes, and lack of real-time central synchronization with Directorate Headquarters. LabelLens was engineered as an all-in-one, client-first, cloud-synchronized field inspection suite that automates label scanning, trigonometric cylindrical unwarping, multi-script OCR, dynamic statutory calculation, and digital Form 1 notice generation.'
  );

  // ==========================================
  // SECTION 2: TECH STACK & EXACT VERSIONS
  // ==========================================
  renderSectionHeader('2. COMPLETE TECHNOLOGY STACK & EXACT VERSION INVENTORY', 'Precise software libraries, frameworks, tools, and technical justifications');

  renderTableRow('Library / Tool', 'Exact Version', 'Role', 'Technical Justification');
  renderTableRow('React', '19.0.1', 'UI Library', 'Concurrent rendering & batching for 60 FPS Canvas 2D image manipulations.');
  renderTableRow('TypeScript', '5.8.2', 'Type System', 'Compile-time type safety across legal schemas & OCR coordinate matrices.');
  renderTableRow('Vite', '6.2.3', 'Build Tool', 'Native ESM architecture for instant dev startup & optimized static bundling.');
  renderTableRow('@vitejs/plugin-react', '5.0.4', 'Vite Plugin', 'React Fast Refresh and JSX compilation pipeline.');
  renderTableRow('Tailwind CSS', '4.1.14', 'CSS Engine', 'Utility styling, WCAG contrast compliance & pixel-precise @media print.');
  renderTableRow('@tailwindcss/vite', '4.1.14', 'Vite Plugin', 'Direct compilation of Tailwind v4 CSS within Vite.');
  renderTableRow('Express', '4.21.2', 'HTTP Server', 'API proxying, disk JSON persistence, cross-device sync & secret isolation.');
  renderTableRow('@google/genai', '2.4.0', 'DeepMind SDK', 'Official SDK for Gemini 3.8 Flash multimodal vision reasoning.');
  renderTableRow('Lucide React', '0.546.0', 'Vector Icons', 'Lightweight SVG icons for statutory statuses, tools, and steppers.');
  renderTableRow('Motion', '12.23.24', 'Animations', 'Hardware-accelerated layout transitions & caliper tool micro-interactions.');
  renderTableRow('jsPDF', '4.0.0', 'PDF Generator', 'Client-side vector PDF synthesis for Form 1 notices and this dossier.');
  renderTableRow('tsx', '4.21.0', 'TypeScript Runner', 'Zero-config Node.js execution engine for development server.');
  renderTableRow('esbuild', '0.25.0', 'Server Bundler', 'Compiles server.ts into self-contained CommonJS artifact dist/server.cjs.');

  y += 3;

  // ==========================================
  // SECTION 3: COMPUTER VISION ALGORITHMS
  // ==========================================
  renderSectionHeader('3. COMPUTER VISION & OPTICAL PREPROCESSING PIPELINE', 'Client-side Canvas 2D image enhancement algorithms running at 60 FPS without heavy external binaries');

  renderParagraph(
    'Packaged commodities in retail shelves present serious optical hurdles: low-lighting conditions in grocery aisles, reflective plastic specular glares, cylindrical bottle curvature, and low-contrast dot-matrix batch printing. LabelLens addresses these through a 4-tier pure-browser Canvas 2D pipeline:'
  );

  renderBullet('Dynamic Histogram Auto-Gain & Exposure Normalization', 'Computes min/max luminance across the YUV spectrum and applies linear contrast stretching: Y_norm = ((Y - Y_min) / (Y_max - Y_min)) * 255. This recovers faint dot-matrix batch numbers and dark label declarations without introducing color clipping.');
  renderBullet('3x3 Laplacian Unsharp Mask Convolution', 'Applies a high-pass spatial convolution kernel [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] to sharpen numeral edges, barcodes, and micro-print statutory declarations, dramatically increasing OCR confidence scores.');
  renderBullet('Trigonometric Cylindrical Surface Unwarping', 'Solves the optical barrel distortion of curved packaging (bottles, soda cans, jars). For a cylinder of radius R and center cx, the algorithm maps curved coordinate x back to planar space using x_flat = cx + R * arcsin((x - cx) / R). This restores straight text lines for accurate bounding box extraction.');
  renderBullet('Adaptive Text Isolation & Binary Edge Extraction', 'Evaluates local neighborhood pixel intensities using an Otsu-inspired dual-threshold binarization, isolating black/white declaration text from chaotic multicolored branding artwork.');

  // ==========================================
  // SECTION 4: STATUTORY REGULATORY ENGINE
  // ==========================================
  renderSectionHeader('4. STATUTORY PCR 2011 RULE ENGINE & MATHEMATICAL MODELS', 'Deterministic validation models matching Gazette of India Legal Metrology rules');

  renderParagraph(
    'LabelLens executes strict mathematical and rule-based compliance audits based directly on the Legal Metrology Act, 2009 and Packaged Commodities Rules (PCR), 2011:'
  );

  renderBullet('Rule 6(1)(e) - MRP Syntax & Tax Inclusion Audit', 'Validates that retail pricing contains the exact statutory syntax "inclusive of all taxes" or "incl. of all taxes". Enforces mandatory Rupee symbol (INR) or standard prefix "MRP Rs." and flags unauthorized over-printing or double-pricing stickers.');
  renderBullet('Rule 6(1)(da) - Unit Sale Price (USP) Mathematical Model', 'Mandatory for all pre-packaged commodities sold in retail. Computes USP = Total MRP / Declared Net Metric Quantity. Automatically enforces the statutory unit hierarchy: For commodities > 1 kg or 1 L, USP must be declared per kg or per L. For commodities < 1 kg or 1 L, USP must be declared per g or per ml. For counted commodities, declared per piece (N). Validates within 0.1% rounding tolerance.');
  renderBullet('Rule 11 & Schedule II - Metric Standard Units Enforcement', 'Enforces strict adherence to the International System of Units (SI). Validates legal units: g, kg, ml, l, cm, m, N. Automatically flags illegal imperial units (e.g. lbs, oz, fluid oz) and non-compliant abbreviations (e.g. "KGS", "GMS", "ML.").');
  renderBullet('Rule 13 & Schedule II - Digital Caliper Font Height Verification', 'Correlates the package Principal Display Panel (PDP) area with minimum legal numeral height: Net Qty <= 200g requires >= 2.0 mm; 200g-500g requires >= 3.0 mm; 500g-1kg requires >= 4.0 mm; > 1kg requires >= 4.0 mm (or 6.0 mm for embossed/blown containers). The digital caliper tool utilizes known reference dimensions (credit card 85.6mm, coin 25mm, or manual ruler) to calibrate pixel-to-millimeter ratios.');
  renderBullet('Rule 26 - Statutory Exemption Engine', 'Accurately handles legal exemptions: Rule 26(a) for packages <= 10g or 10ml (exempt from manufacturing date/consumer care); Rule 26(b) for agricultural bags > 50kg; Rule 26(c) for immediate restaurant food packaging; and Rule 3 for non-retail institutional/industrial bulk supplies.');
  renderBullet('Indian Packaging Date Chronology Normalizer', 'Custom regular expression parser that recognizes non-standard packaging formats (e.g. "PKD 08/26", "MFG: AUG 2026", "Mfd. Date: 12-2025") and flags future manufacturing dates or expired shelf-life declarations.');

  // ==========================================
  // SECTION 5: MULTIMODAL AI INTEGRATION
  // ==========================================
  renderSectionHeader('5. MULTIMODAL AI (GEMINI 3.8 FLASH) PIPELINE', 'High-throughput visual reasoning with local fallback resilience');

  renderParagraph(
    'The application utilizes Google DeepMind’s Gemini 3.8 Flash model hosted server-side via Express API endpoints to securely isolate API credentials from browser inspection. The vision model receives high-resolution Base64-encoded crops of the front and back packaging panels and is constrained via JSON schema prompting to extract normalized fields:'
  );

  renderBullet('Multilingual & Multi-Script OCR', 'Recognizes English, Hindi (Devanagari script), and Marathi packaging text simultaneously, fulfilling Rule 9 requirements allowing Hindi/English bilingual declarations.');
  renderBullet('Spatial Coordinate Bounding Box Synthesis', 'Returns normalized bounding box coordinates [ymin, xmin, ymax, xmax] for each statutory field (Brand, Net Qty, MRP, USP, Mfg Date, Customer Care, Manufacturer Address), allowing real-time interactive overlays on the review canvas.');
  renderBullet('Zero-Downtime Deterministic Fallback Pipeline', 'In case of network disconnection or offline field operation, the pipeline falls back to an internal deterministic pattern matcher and benchmark dictionary, ensuring field officers can continue inspections without interruption.');

  // ==========================================
  // SECTION 6: SYSTEM ARCHITECTURE & SYNC
  // ==========================================
  renderSectionHeader('6. FULL-STACK ARCHITECTURE & REAL-TIME SYNC PROTOCOL', 'Cross-browser BroadcastChannel, server-side persistence, and multi-officer synchronization');

  renderParagraph(
    'LabelLens is built with a resilient dual-tier storage and synchronization architecture designed for real-world government field use:'
  );

  renderBullet('Server-Side Express Store with JSON Persistence', 'Inspections and administrative activity logs are stored on disk (/data/inspections.json and /data/activities.json), surviving server restarts and container reboots while remaining lightweight and portable.');
  renderBullet('Bidirectional Cross-Device Synchronization (/api/sync)', 'Client instances poll /api/sync and broadcast state changes across browser tabs using the HTML5 BroadcastChannel API ("labellens_cross_tab_sync"). An inspection marked complete by an inspector in Mumbai or Pune instantly reflects on the Central Directorate Admin Portal in real time.');
  renderBullet('Role-Based Access Control (RBAC)', 'Supports Field Inspector mode (field data capture, optical caliper calibration, Form 1 compilation) and Directorate Admin mode (central surveillance statistics, circle-wide violation heatmaps, inspector activity ledgers, and one-click data purge).');
  renderBullet('Security & Privacy Safeguards', 'Zero employee Personally Identifiable Information (PII) is stored. Only commercial business establishment data (Store Name, Address, GSTIN) and packaging compliance records are archived.');

  // ==========================================
  // SECTION 7: FIELD OPERATIONAL WORKFLOW
  // ==========================================
  renderSectionHeader('7. 6-STEP STANDARD OPERATING PROCEDURE (SOP)', 'End-to-end statutory execution workflow for field officers');

  renderBullet('Step 1: Establishment & Commodity Intake', 'Officer logs the commercial establishment (Name, Address, GSTIN, Circle jurisdiction) and package format (rigid container, flexible pouch, bottle, carton).');
  renderBullet('Step 2: Multi-Angle Packaging Photography', 'Officer captures high-resolution photographs of the Principal Display Panel (PDP) and statutory back declaration panel, applying Auto-Gain, Unsharp, or Unwarp as necessary.');
  renderBullet('Step 3: Multimodal OCR & Field Extraction', 'The AI pipeline extracts statutory fields with spatial coordinates, parsing multi-script text and numerical declarations.');
  renderBullet('Step 4: Statutory Compliance & USP Verification', 'Rule engine validates MRP syntax, verifies USP calculation, audits metric units, and flags violations under PCR 2011.');
  renderBullet('Step 5: Digital Millimeter Caliper Evidence Review', 'Officer calibrates scale using on-screen reference cards/rulers and verifies numeral font heights against Schedule II minimum legal dimensions.');
  renderBullet('Step 6: Form 1 Notice Compilation & Directorate Sync', 'System generates official Form 1 Inspection Notice with digital officer seal and QR verification stamp, instantly transmitting the dossier to the Central Directorate Admin Portal.');

  // Final Page Count update for footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Save the PDF
  doc.save('LabelLens_Technical_Research_And_Architecture_Specification.pdf');
}
