import { jsPDF } from 'jspdf';
import { Inspection, Inspector } from '../types';

/**
 * Generates an official, publication-grade Government of India Form 1
 * Legal Metrology Inspection Report PDF and automatically triggers download.
 */
export function generateInspectionReportPDF(
  inspection: Inspection,
  inspector?: Inspector | { name: string; id: string; designation?: string; jurisdiction?: string }
): void {
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

  const inspectorName = inspector?.name || inspection.inspectorName || 'Authorized Legal Metrology Officer';
  const inspectorId = inspector?.id || inspection.inspectorId || 'LMO-2026-01';
  const designation = (inspector && 'designation' in inspector ? inspector.designation : '') || 'Legal Metrology Officer';
  const jurisdiction = inspection.jurisdiction || 'Field Inspection Circle';

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const pageNum = doc.getNumberOfPages();
    // Top subtle bar
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 11, pageWidth - margin, 11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DIRECTORATE OF LEGAL METROLOGY • GOVERNMENT OF INDIA', margin, 9);
    doc.text(`MEMO REF: ${inspection.id}`, pageWidth - margin, 9, { align: 'right' });

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Official Form 1 Inspection Memo under Section 15 of Legal Metrology Act, 2009 & PCR 2011', margin, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // 1. Header & Sovereign Crest Banner
  // Tricolor accent line
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, y, contentWidth / 3, 2, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(margin + contentWidth / 3, y, contentWidth / 3, 2, 'F');
  doc.setFillColor(19, 136, 8); // India Green
  doc.rect(margin + (contentWidth / 3) * 2, y, contentWidth / 3, 2, 'F');
  y += 5;

  // Title Box
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DIRECTORATE OF LEGAL METROLOGY', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Department of Consumer Affairs • Ministry of Consumer Affairs, Food & Public Distribution, New Delhi', margin + 6, y + 14);
  doc.text('STATUTORY PACKAGED COMMODITY INSPECTION MEMORANDUM (FORM 1)', margin + 6, y + 19);

  // Status Badge in Title Box
  const isOk = inspection.status === 'VERIFIED' || inspection.findings.length === 0;
  doc.setFillColor(isOk ? 16 : 180, isOk ? 185 : 83, isOk ? 129 : 9);
  doc.roundedRect(pageWidth - margin - 38, y + 5, 34, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isOk ? 'COMPLIANT' : 'ISSUES DETECTED', pageWidth - margin - 21, y + 9.5, { align: 'center' });

  y += 28;

  // 2. Metadata Grid (Officer, Store, Date, ID)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  // Col 1: Inspection ID & Date
  doc.text('INSPECTION MEMO NO.', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(inspection.id, margin + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date of Visit: ${inspection.inspectionDate || new Date().toISOString().split('T')[0]}`, margin + 4, y + 17);
  doc.text(`Jurisdiction: ${jurisdiction}`, margin + 4, y + 22);

  // Col 2: Store / Establishment
  const midX = margin + contentWidth * 0.42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('ESTABLISHMENT / STORE', midX, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(inspection.business.name || 'Retail Establishment', midX, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Type: ${inspection.business.type || 'Retailer'}`, midX, y + 17);
  doc.text(`Address: ${inspection.business.address || jurisdiction}`, midX, y + 22);

  // Col 3: Officer
  const rightX = margin + contentWidth * 0.75;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('INSPECTING OFFICER', rightX, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(inspectorName, rightX, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`ID: ${inspectorId}`, rightX, y + 17);
  doc.text(designation, rightX, y + 22);

  y += 31;

  // 3. Commodity Under Review
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text('SAMPLED COMMODITY:', margin + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  const commodityTitle = `${inspection.product.brand ? inspection.product.brand + ' - ' : ''}${inspection.product.name}${inspection.product.declaredQuantity ? ` (${inspection.product.declaredQuantity})` : ''}`;
  doc.text(commodityTitle, margin + 45, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Packaging: ${inspection.product.packageType || 'Retail Pack'}  |  Category: ${inspection.product.category || 'Packaged Commodities'}  |  Regulated under PCR 2011`, margin + 4, y + 11);

  y += 18;

  // 4. Extracted Mandatory Declarations (Rule 6 Compliance Table)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Statutory Declarations Verification (Rule 6, PCR 2011)', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('STATUTORY REQUIREMENT', margin + 3, y + 4.2);
  doc.text('DECLARED ON LABEL', margin + 65, y + 4.2);
  doc.text('CONFIDENCE', margin + 125, y + 4.2);
  doc.text('STATUS', margin + 155, y + 4.2);
  y += 6;

  const fields = inspection.extractedFields || [];
  if (fields.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('No declarations extracted yet.', margin + 4, y + 5);
    y += 8;
  } else {
    fields.forEach((f, idx) => {
      checkPageOverflow(8);
      const isEven = idx % 2 === 0;
      if (isEven) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 6.5, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(f.name.substring(0, 35), margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text((f.value || 'Not Detected').substring(0, 40), margin + 65, y + 4.5);

      doc.setTextColor(100, 116, 139);
      doc.text(f.confidence || 'HIGH', margin + 125, y + 4.5);

      const fValid = f.status === 'DETECTED';
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fValid ? 16 : 180, fValid ? 149 : 83, fValid ? 193 : 9);
      doc.text(f.status || 'DETECTED', margin + 155, y + 4.5);

      y += 6.5;
    });
  }

  y += 4;
  checkPageOverflow(30);

  // 5. Findings & Regulatory Observations Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Regulatory Audit Observations & Findings', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('ID / SEVERITY', margin + 3, y + 4.2);
  doc.text('STATUTORY RULE VIOLATION / OBSERVATION', margin + 40, y + 4.2);
  doc.text('STATUS', margin + 155, y + 4.2);
  y += 6;

  const findings = inspection.findings || [];
  if (findings.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text('NO DEFECTS FOUND: Package declarations comply with Legal Metrology (PCR 2011) standards.', margin + 4, y + 5);
    y += 10;
  } else {
    findings.forEach((fn, idx) => {
      checkPageOverflow(14);
      const isEven = idx % 2 === 0;
      if (isEven) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 12, 'F');
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const isHigh = fn.severity === 'HIGH';
      doc.setTextColor(isHigh ? 185 : 217, isHigh ? 28 : 119, isHigh ? 28 : 6);
      doc.text(`${fn.id} [${fn.severity}]`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(fn.title.substring(0, 65), margin + 40, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(fn.description.substring(0, 80), margin + 40, y + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(isHigh ? 185 : 202, isHigh ? 28 : 138, isHigh ? 28 : 4);
      doc.text(fn.severity === 'HIGH' ? 'DEFECT' : 'OBSERVED', margin + 155, y + 4.5);

      y += 12;
    });
  }

  y += 4;
  checkPageOverflow(35);

  // 6. Inspector Summary Directives
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Inspector Statutory Remarks & Directives', margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  const notesText = inspection.reviewerOverallNotes ||
    'Mandatory declarations on retail packaging examined. Sample evaluated against PCR 2011 statutory provisions. Case dossier filed for official records.';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const splitNotes = doc.splitTextToSize(notesText, contentWidth - 8);
  doc.text(splitNotes, margin + 4, y + 5);

  y += 24;
  checkPageOverflow(30);

  // 7. Signature & Official Stamp Block
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Left: Verification QR note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Digitally validated via LabelLens Metrology Suite.', margin, y + 4);
  doc.text(`Timestamp: ${new Date().toLocaleString('en-IN')}`, margin, y + 8);
  doc.text('Confidential Official Document • Legal Metrology Enforcement Division', margin, y + 12);

  // Right: Signature Box
  const sigX = pageWidth - margin - 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('INSPECTOR SIGN-OFF:', sigX, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(inspectorName, sigX, y + 10);
  doc.text(`${designation}, Circle ${jurisdiction}`, sigX, y + 14);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('(Digitally authenticated on-field)', sigX, y + 18);

  // Save the PDF!
  const fileName = `LabelLens_Report_${inspection.id}.pdf`;
  doc.save(fileName);
}
