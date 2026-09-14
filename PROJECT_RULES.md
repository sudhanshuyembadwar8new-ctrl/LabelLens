# METRIX — Project Rules & Architecture Guardrails

**Project Name**: METRIX  
**Problem Statement**: SIH26034 (Smart India Hackathon 2026)  
**Title**: AI-Powered Digital Legal Metrology Inspector  
**Status**: Assistive Software Prototype (Stage 1 Baseline)

---

## 1. Core Identity & Legal Disclaimer

METRIX is an **evidence-backed assistive inspection workspace** designed to support Legal Metrology inspectors.
- It is an **ASSISTIVE PROTOTYPE ONLY**.
- It does **NOT** claim government certification, official legal authority, autonomous enforcement, or legally binding determinations.
- The final compliance determination strictly rests with the authorized human inspector/reviewer.
- Every screen displaying simulated or AI analysis must feature the persistent disclosure:
  > **"SIMULATED DEMO ANALYSIS — NOT A LEGAL DETERMINATION"**

---

## 2. Mandatory Trust Language Vocabulary

| Approved Trust Vocabulary | Banned / Prohibited Phrasing |
|---|---|
| Potential non-compliance | Violation / Illegal / Crime |
| Review required | Automatically convicted / Guilty |
| Needs more evidence | Guaranteed compliant |
| AI-extracted / Mock analysis | Legally approved |
| Inspector verified | Government certified |
| Draft report / Demo environment | AI final decision |

---

## 3. Design System & Visual Tokens

The aesthetic strictly represents **institutional government technology + enterprise inspection software**.
- **Navy**: `#102A43`
- **Primary Blue**: `#1F5A94`
- **Slate Text**: `#334E68`
- **Muted Text**: `#627D98`
- **Border**: `#D9E2EC`
- **Surface**: `#F5F7FA`
- **Success**: `#2F855A`
- **Warning**: `#B7791F`
- **Error**: `#C53030`
- **Border Radius**: 4px–8px (No generic pill cards, no neon, no flashy AI sparkles, no glassmorphism gradients).

---

## 4. Staged Engineering Roadmap

1. **STAGE 1**: Professional Web App Foundation (Complete conceptual routes, deterministic mock data, stateful workflow, evidence viewer, paper report preview, persistent demo state).
2. **STAGE 2**: Real Image Input & Preprocessing (Multi-image capture, metadata extraction, validation, orientation).
3. **STAGE 3**: Modular OCR Pipeline (PaddleOCR / Tesseract abstraction, bounding boxes, multilingual support).
4. **STAGE 4**: AI Structured Declaration Extraction (Gemini schema-constrained JSON extraction, null fallback for unseen fields).
5. **STAGE 5**: Deterministic Regulatory Rule Engine (PCR 2011 statutory rules, applicability check first, rule versioning).
6. **STAGE 6**: Compliance & Evidence Engine (Finding-to-evidence bidirectional linking, three-pane review interface).
7. **STAGE 7**: Physical-Scale Visual Measurement (Reference dimension calibration, pixel-to-mm ratio, font height check).
8. **STAGE 8**: Physical vs Online Listing Comparison (E-commerce declaration discrepancy checks).
9. **STAGE 9**: Supabase Persistence & History (Audit logging, report archive, analytics).
10. **STAGE 10**: End-to-End QA & SIH 2026 Jury Presentation Flow.

---

## 5. Explicit Exclusions for Stage 1

Do NOT introduce fake or half-baked autonomous OCR or neural network calls in Stage 1. 
All data models (Inspector, Inspection, Business, Product, ImageRecord, ExtractedField, Finding, EvidenceItem, Report) must adhere to the modular specifications so subsequent stages plug in cleanly without rewriting the UI or component contracts.
