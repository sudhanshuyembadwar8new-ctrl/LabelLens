/**
 * LabelLens — Domain Models & Type Definitions
 * Legal Metrology (Packaged Commodities) Rules, 2011 Compliance Architecture
 */

export type InspectionStatus = 
  | 'DRAFT'
  | 'PROCESSING'
  | 'REVIEW_REQUIRED'
  | 'REPORT_READY'
  | 'VERIFIED'
  | 'CLOSED';

export type ReviewStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'NOT_APPLICABLE'
  | 'NEEDS_MORE_EVIDENCE';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ImageRole = 'FRONT' | 'BACK' | 'SIDE' | 'PRICE_CLOSEUP';

export type UserRole = 'INSPECTOR' | 'ADMIN';

export type CaptureSource = 'camera' | 'upload' | string;

export interface OCRBlock {
  id: string;
  originalText: string;
  normalizedText: string;
  language: 'en' | 'hi' | 'mr' | 'multi';
  confidence: ConfidenceLevel;
  boundingBox?: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
  };
  sourceImageId?: string;
}

export interface Inspector {
  id: string;
  name: string;
  designation: string;
  email: string;
  office: string;
  jurisdiction: string;
  district?: string;
  environment: string;
  avatar?: string;
  statusBadge?: string;
  recentActivity?: Array<{
    id: string;
    timestamp: string;
    description: string;
    inspectionId?: string;
    type: 'verified' | 'flagged' | 'draft' | 'login';
  }>;
}

export interface Admin {
  id: string;
  name: string;
  designation: string;
  email: string;
  department: string;
  supervisoryJurisdiction: string;
  headquarters?: string;
  role: 'ADMIN';
}

export interface InspectorPerformance {
  inspectorId: string;
  inspectorName: string;
  designation: string;
  jurisdiction: string;
  district: string;
  inspectionsCompleted: number;
  previousPeriodInspections: number;
  growthPercentage: number;
  pendingReviews: number;
  potentialIssuesFound: number;
  reportsGenerated: number;
  lastActiveDate: string;
  currentWorkload: 'Normal' | 'High' | 'Overdue Pending';
  status: 'Active' | 'On Leave' | 'High Workload';
  monthlyTrends: number[];
}

export interface BusinessDetails {
  name: string;
  type: string;
  address: string;
  contact?: string;
}

export interface ProductDetails {
  category: string;
  brand: string;
  name: string;
  packageType: string;
  declaredQuantity: string;
}

export interface InspectionContext {
  inspectionType: string;
  source: string;
  inspectorNotes: string;
  location?: string;
}

export interface ProductImage {
  id: string;
  filename: string;
  role: ImageRole;
  width: number;
  height: number;
  captureSource: CaptureSource;
  dataUrl: string;
  createdAt?: string;
  mimeType?: string;
  uploadedAt?: string;
}

export type ImageAsset = ProductImage;

export interface ExtractedField {
  id: string;
  name: string;
  value: string;
  source: string;
  status: 'DETECTED' | 'MISSING' | 'LOW_CONFIDENCE' | 'REVIEW_REQUIRED' | 'NOT_APPLICABLE';
  confidence: ConfidenceLevel;
  sourceImageId?: string;
  rawText?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Finding {
  id: string; // e.g. "F-001"
  severity: SeverityLevel;
  title: string;
  description: string;
  relatedField: string;
  confidence: ConfidenceLevel;
  evidenceIds: string[];
  reviewStatus: ReviewStatus;
  ruleReference?: string;
  ruleId?: string;
  ruleVersion?: string;
  findingStatus?: 'PASS' | 'FAIL' | 'REVIEW' | 'NOT_APPLICABLE';
  reviewerId?: string;
  reviewTime?: string;
  reviewNote?: string;
}

export interface EvidenceItem {
  id: string; // e.g. "EV-001"
  inspectionId: string;
  type: 'IMAGE_REGION' | 'OCR_TEXT' | 'DECLARATION_FIELD';
  sourceImageId: string;
  label: string;
  description: string;
  region?: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
    label: string;
  };
  linkedFindingIds: string[];
  confidence: ConfidenceLevel;
  reviewStatus: ReviewStatus;
  reviewerNote: string;
  reviewerId?: string;
  reviewedAt?: string;
}

export interface Inspection {
  id: string; // e.g. "INS-2026-0043" or "INS-REF-2026-0001"
  isDemo?: boolean; // internal flag for the single baseline reference benchmark
  isBenchmark?: boolean;
  status: InspectionStatus;
  inspectionDate: string;
  inspectorId: string;
  inspectorName?: string;
  jurisdiction: string;
  inspectionType: string;
  business: BusinessDetails;
  product: ProductDetails;
  context: InspectionContext;
  images: ImageAsset[];
  fieldsReviewed?: number;
  findings: Finding[];
  extractedFields: ExtractedField[];
  evidence: EvidenceItem[];
  ocrBlocks?: OCRBlock[];
  ruleVersionUsed?: string;
  ruleApplicabilityNotes?: string[];
  preprocessingNotes?: string[];
  reviewerOverallNotes?: string;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
  analysisMode?: 'AI_ASSISTED' | 'FALLBACK_VERIFICATION' | 'SIMULATED_DEMO' | 'REAL_PROTOTYPE';
}

export interface AppSettings {
  inspector: Inspector;
  jurisdiction: {
    state: string;
    division: string;
    district: string;
    defaultLocation: string;
  };
  preferences: {
    dateFormat: string;
    reportTheme: 'institutional_light' | 'high_contrast';
    notifications: boolean;
    showWorkflowHints: boolean;
  };
  about: {
    appName: string;
    version: string;
    problemStatement: string;
    prototypeDisclaimer: string;
  };
}

export interface ActivityEvent {
  activityId: string;
  userId: string;
  userName: string;
  inspectionId?: string;
  type:
    | 'login'
    | 'inspection_created'
    | 'details_completed'
    | 'image_captured'
    | 'image_uploaded'
    | 'analysis_completed'
    | 'result_reviewed'
    | 'evidence_reviewed'
    | 'report_generated'
    | 'inspection_completed';
  description: string;
  timestamp: string;
}

export interface PhysicalMeasurement {
  measuredHeightMm: number;
  expectedMinHeightMm: number;
  confidence: ConfidenceLevel;
  referenceObject: 'CREDIT_CARD' | 'COIN_25MM' | 'RULER_10MM' | 'MANUAL_CALIBRATION';
  pixelToMmRatio: number;
  result: 'COMPLIANT' | 'REVIEW_REQUIRED';
  ruleReference: string;
  notes: string;
}

export interface OnlineComparisonItem {
  field: string;
  physicalValue: string;
  onlineValue: string;
  status: 'MATCH' | 'MISMATCH' | 'REVIEW';
  discrepancyNote?: string;
}

export interface OnlineComparisonData {
  platform: 'Blinkit' | 'Zepto' | 'Amazon' | 'Flipkart' | 'BigBasket' | 'Other';
  listingUrl?: string;
  screenshotUrl?: string;
  comparisonItems: OnlineComparisonItem[];
  overallStatus: 'MATCH' | 'MISMATCH' | 'REVIEW';
  reviewedAt: string;
}
