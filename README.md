# METRIX — AI-Powered Digital Legal Metrology Inspector
**Smart India Hackathon 2026 Prototype &bull; Problem Statement SIH26034**

METRIX is an evidence-backed field inspection and regulatory compliance assistant designed for authorized Legal Metrology inspectors under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)**.

---

## 🏛️ Architecture & Role Separation

METRIX enforces strict role separation between **Field Enforcement Officers** and the **Directorate Administration**:

1. **Field Inspector (`/login/inspector`):**
   - Conduct store visits, retail market surveillance, and wholesale depot audits.
   - Capture multi-angle packaging evidence (front PDP, back statutory declarations panel, barcode/batch closeup).
   - Review AI OCR extractions side-by-side with cropped photo evidence.
   - Accept, correct, or dismiss potential non-compliance observations.
   - Generate official Form 1 inspection sheets and PDF case dossiers.
   - **Privacy & Integrity**: Inspectors only see their own logged inspections and the initial benchmark demo sample.

2. **Directorate Administrator (`/login/admin`):**
   - Statewide supervisory oversight of all 5 team inspectors.
   - Real-time activity telemetry, inspection status breakdown, and violation metrics.
   - Inspector workload and performance tracking.
   - Central legal registry archive with exportable ledgers.

---

## 👥 Field-Testing Team Credentials

For field testing at nearby grocery, supermarket, or retail stores:

| Role | Officer Name | Login ID | Default Password | Environment Variable |
| :--- | :--- | :--- | :--- | :--- |
| **Directorate Admin** | Prasad Gajulwar | `PRASAD_ADMIN_01` | `Prasad@Admin2026` or `Metrix@2026` | `PRASAD_ADMIN_PASSWORD` |
| **Field Inspector** | Navinya | `NAVINYA_INS_02` | `Navinya@2026` or `Metrix@2026` | `NAVINYA_INSPECTOR_PASSWORD` |
| **Field Inspector** | Sudhanshu | `SUDHANSHU_INS_03` | `Sudhanshu@2026` or `Metrix@2026` | `SUDHANSHU_INSPECTOR_PASSWORD` |
| **Field Inspector** | Devansh | `DEVANSH_INS_04` | `Devansh@2026` or `Metrix@2026` | `DEVANSH_INSPECTOR_PASSWORD` |
| **Field Inspector** | Nirmiti | `NIRMITI_INS_05` | `Nirmiti@2026` or `Metrix@2026` | `NIRMITI_INSPECTOR_PASSWORD` |
| **Field Inspector** | Kshitija | `KSHITIJA_INS_06` | `Kshitija@2026` or `Metrix@2026` | `KSHITIJA_INSPECTOR_PASSWORD` |

*Note: On both login screens, quick 1-tap selectors are provided for rapid mobile field testing.*

---

## 📱 Mobile Field Testing Step-by-Step Guide

Follow these steps when testing in retail grocery stores:

### Step 1: Authentication & Workspace Entry
1. Open the METRIX homepage and tap **LOGIN**.
2. Select **INSPECTOR LOGIN**.
3. Choose your name from the quick field-test account chips (e.g., `Navinya`) or enter your Inspector ID.
4. Tap **Enter Inspector Workspace**.

### Step 2: Initialize a Store Inspection
1. From the Field Dashboard, tap **+ Start New Inspection**.
2. An official reference ID (e.g., `INS-2026-4821`), timestamp, and your officer identity are auto-generated.
3. Enter the retail store name (e.g., *"Shree Ganesh Supermarket"*), commodity category, brand, and declared net quantity.
4. Tap **Save & Proceed to Evidence Capture**.

### Step 3: Package Evidence Capture
1. Tap **Capture via Camera** on the **Front of Package** card.
2. Grant camera permission. On mobile phones, METRIX automatically defaults to the rear camera with an alignment overlay frame.
3. Tap **Capture Photo** and verify the preview.
4. Repeat for the **Back of Package** statutory panel.
5. Tap **Start Legal Metrology Analysis**.

### Step 4: Rule Engine Verification
1. The deterministic engine processes the package images against PCR 2011 statutory rules.
2. View the **Compliance Summary Matrix** (e.g., Net Quantity Unit SI compliance, MRP tax inclusive phrasing, Customer Care availability, Numeral Font Height).

### Step 5: Side-by-Side Evidence Cross-Check
1. Tap **Verify Evidence Crops**.
2. For each statutory rule, inspect the optical image crop side-by-side with the rule text.
3. As the inspecting officer, you can accept flags, modify text values, or dismiss false positives.

### Step 6: Form 1 Inspection Sheet & PDF Export
1. Tap **Generate Inspection Dossier**.
2. Review the standardized Legal Metrology Form 1 inspection sheet.
3. Tap **Print / Save Dossier PDF** or **Sign Off & Finalize**.

### Step 7: Supervisory Review (Admin)
1. Log out or navigate to `/login/admin`.
2. Sign in as `PRASAD_ADMIN_01`.
3. View the live inspection log showing the newly completed field test under the respective inspector's profile.

---

## ⚖️ Codified PCR 2011 Statutory Scope

METRIX evaluates consumer packages against specific rules under the Legal Metrology (Packaged Commodities) Rules, 2011:
- **Rule 6(1)(a)**: Name and complete address of the manufacturer, packer, or importer.
- **Rule 6(1)(aa)**: Country of origin for imported goods.
- **Rule 6(1)(b)**: Generic or common name of the commodity.
- **Rule 6(1)(c) & Rule 11**: Net quantity declared in standard SI metric units (e.g., `g`, `kg`, `ml`, `l`).
- **Rule 6(1)(d)**: Month and year of manufacture, packing, or import.
- **Rule 6(1)(e)**: Maximum Retail Price (MRP) explicitly stating *"inclusive of all taxes"*.
- **Rule 6(1)(n)**: Unit Sale Price (USP) for commodities packed after Dec 2022.
- **Rule 6(1)(f)**: Complete consumer redressal contact details (name, address, telephone, email).
- **Rule 13 & Schedule II**: Area-based minimum numeral font height standards.

---

## 🛡️ Security & Privacy Architecture

- **Session Authority**: Inspector credentials and jurisdiction are derived server-side from the authenticated token/session.
- **Role Guard**: Inspector sessions are blocked from accessing `/admin/*` routes with automatic redirects.
- **Data Isolation**: The benchmark demo sample (`INS-2026-0042`) is isolated and does not skew real field test metrics.
- **Environment Driven**: Secret credentials are bound through `.env` configurations rather than client-exposed strings.
