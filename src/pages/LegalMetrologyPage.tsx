import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight,
  Search,
  Sliders,
  Globe,
  Tag,
  Building,
  Calendar,
  PhoneCall,
  Percent,
} from 'lucide-react';
import { PublicShell } from '../components/layout/PublicShell';
import { useInspection } from '../context/InspectionContext';

interface RuleSectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export const LegalMetrologyPage: React.FC = () => {
  const { navigateTo } = useInspection();
  const [openSectionId, setOpenSectionId] = useState<string>('sec-overview');
  const [activeSearch, setActiveSearch] = useState<string>('');

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? '' : id));
  };

  const sections: RuleSectionItem[] = [
    {
      id: 'sec-overview',
      title: '1. Overview',
      subtitle: 'Statutory framework and regulatory background',
      icon: Scale,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            The <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> (commonly known as <strong>PCR, 2011</strong>)
            were enacted under <strong>Section 52(2)(j)</strong> of the <strong>Legal Metrology Act, 2009</strong> by the
            Department of Consumer Affairs, Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
          </p>
          <p>
            The primary legislation replaced the Standards of Weights and Measures (Packaged Commodities) Rules, 1977,
            modernizing consumer protection, establishing standardization in trade measurements, and instituting unambiguous
            labeling requirements for pre-packaged commodities distributed across Indian retail, wholesale, and digital commerce.
          </p>
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs">
            <strong>Prototype Alignment:</strong> LabelLens maps its validation rules directly to the codified provisions of PCR 2011,
            providing human inspectors with a structured assistive cross-check of mandatory label elements.
          </div>
        </div>
      ),
    },
    {
      id: 'sec-purpose',
      title: '2. Purpose & Objectives',
      subtitle: 'Why pre-packaged commodities require statutory declarations',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            The overarching objectives of the Legal Metrology (Packaged Commodities) Rules include:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Consumer Empowerment:</strong> Ensuring consumers are provided with accurate, legible, and unadulterated information regarding product identity, quantity, origin, and pricing prior to purchase.
            </li>
            <li>
              <strong>Prevention of Deceptive Practices:</strong> Barring slack-filling, non-standard weight configurations, deceptive package sizes, and ambiguous font dimensions designed to obscure mandatory information.
            </li>
            <li>
              <strong>Fair Competition:</strong> Standardizing declared units and price declarations (such as Unit Sale Price) so buyers can compare value across competing brands.
            </li>
            <li>
              <strong>Traceability and Accountability:</strong> Requiring full legal entity names and postal addresses so packers and manufacturers can be reached for consumer redressal or regulatory inquiries.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'sec-definition',
      title: '3. What is a Pre-Packaged Commodity?',
      subtitle: 'Statutory definition under Rule 2(l)',
      icon: Layers,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-100 border-l-4 border-blue-800 rounded-r-lg font-serif italic text-slate-800">
            &ldquo;Pre-packaged commodity means a commodity which without the purchaser being present is placed in a package
            of whatever nature, whether sealed or not, so that the product contained therein has a predetermined quantity.&rdquo;
            <div className="text-right text-xs font-sans not-italic text-slate-500 mt-2">— Rule 2(l), Legal Metrology (Packaged Commodities) Rules, 2011</div>
          </div>
          <p>
            Key attributes of pre-packaged goods:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 text-xs mb-1">Pre-Determined Quantity</div>
              <p className="text-xs text-slate-600">The volume, mass, or count is packed in advance and not measured at the exact moment of retail transaction.</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 text-xs mb-1">Any Package Nature</div>
              <p className="text-xs text-slate-600">Applies whether goods are enclosed in sealed pouches, bottles, corrugated boxes, tin cans, wrappers, or banded containers.</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 text-xs mb-1">Absence of Buyer</div>
              <p className="text-xs text-slate-600">Packed by the manufacturer, packer, or importer prior to presentation to the end consumer.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-declarations',
      title: '4. Mandatory Declarations (Rule 6)',
      subtitle: 'Core statutory disclosures required on pre-packaged packages',
      icon: FileText,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Regulatory Notice:</strong> Applicable declarations depend on the commodity, packaging, rule,
              amendment, and relevant exemptions. Not every declaration applies identically to every category of goods.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-700" />
                <span>Name and Generic Descriptor</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">The generic or common name of the commodity must be prominently stated on the principal display panel.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-700" />
                <span>Manufacturer / Packer / Importer</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Full legal corporate name, complete postal address with PIN code. If imported, the importer and manufacturer details.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-700" />
                <span>Net Quantity</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Net quantity in standard SI metric units (weight, volume, length, or number). Non-standard symbols are prohibited.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span className="font-bold text-blue-700">₹</span>
                <span>Maximum Retail Price (MRP)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Clearly stated as Maximum or Max. Retail Price ₹ xx (inclusive of all taxes). Dual pricing is strictly prohibited.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Month and Year Declarations</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Month and year of manufacture, packaging, or import. Expiry/Best Before date where applicable under commodity laws.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
                <span>Consumer Care Grievance Details</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Name, complete postal address, working telephone number, and valid email address of the grievance officer.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-700" />
                <span>Country of Origin</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Mandatory for imported pre-packaged packages to clearly state the country of manufacture or assembly.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-700" />
                <span>Unit Sale Price (USP)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Mandatory for multi-unit packages or goods packaged above 1 kg/1 L (declared in ₹ per g, per kg, per ml, per L, or per item).</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-display',
      title: '5. Packaging & Display Requirements',
      subtitle: 'Principal display panel, legibility, and contrast',
      icon: Sliders,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            Under <strong>Rule 7 and Rule 8</strong>, declarations must be grouped logically and placed on the
            <strong>Principal Display Panel (PDP)</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>PDP Definition:</strong> In rectangular containers, the entire side facing front; in cylindrical containers, 40% of the total surface area; in other shapes, 20% of the total surface.</li>
            <li><strong>High Contrast:</strong> Lettering and numerals must be in distinct contrast with the background color (e.g., dark text on white/light backing or white text on dark backing).</li>
            <li><strong>Grouping:</strong> Declarations of name, quantity, MRP, and date must be legible without opening or damaging the container.</li>
            <li><strong>Anti-Deceptive Packaging:</strong> Containers must not have false bottoms, side pockets, or excessive outer cartons designed to mislead consumers regarding internal volume.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'sec-quantity',
      title: '6. Quantity & Unit Requirements (Rule 11 & Rule 13)',
      subtitle: 'Permissible metric symbols and minimum font height requirements',
      icon: Scale,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            All quantity declarations must adhere strictly to metric units. Non-standard abbreviations are non-compliant:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Measure</th>
                  <th className="p-2.5">Permissible Symbol</th>
                  <th className="p-2.5">Strictly Non-Compliant Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium">Mass / Weight</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">g, kg, mg</td>
                  <td className="p-2.5 font-mono text-rose-700">gms, kgs, gm, KG, GMS</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Volume / Liquid</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">ml, l or L</td>
                  <td className="p-2.5 font-mono text-rose-700">ltr, ltrs, ML, mls</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Length / Dimension</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">mm, cm, m</td>
                  <td className="p-2.5 font-mono text-rose-700">mtr, mtrs, cms, inch</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2">
            <div className="font-bold text-xs text-slate-900 mb-1">Minimum Numeral Font Height Table (Rule 13):</div>
            <p className="text-xs text-slate-600 mb-2">The height of any numeral in the net quantity declaration depends on the area of the Principal Display Panel (A):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">A ≤ 50 cm²</span>
                <span className="font-bold text-slate-900">Min. 1.0 mm</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">50 cm² &lt; A ≤ 100 cm²</span>
                <span className="font-bold text-slate-900">Min. 1.5 mm</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">100 cm² &lt; A ≤ 500 cm²</span>
                <span className="font-bold text-slate-900">Min. 2.5 mm</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">A &gt; 500 cm²</span>
                <span className="font-bold text-slate-900">Min. 4.0 mm – 6.0 mm</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-mrp',
      title: '7. Maximum Retail Price (MRP) Requirements',
      subtitle: 'Standardized phrasing, tax inclusiveness, and ban on dual pricing',
      icon: Tag,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            Under <strong>Rule 6(1)(e)</strong>, the retail sale price declaration must follow exact syntax:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 space-y-1">
            <div>Maximum Retail Price ₹ xxx.xx (inclusive of all taxes)</div>
            <div className="text-slate-500 font-sans italic text-[11px]">— or —</div>
            <div>MRP ₹ xxx.xx (incl. of all taxes)</div>
          </div>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
            <li><strong>No Surcharges:</strong> Retailers are strictly prohibited by law from charging any price in excess of the declared Maximum Retail Price.</li>
            <li><strong>No Dual Pricing:</strong> A manufacturer or packer cannot alter or declare different MRPs on identical quantities of commodities for different classes of consumers, locations, or geographical zones unless expressly exempted.</li>
            <li><strong>Smudge-free Stamp:</strong> Sticker overlays or price adjustments over original printed MRP are considered potential non-compliance without official authorization.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'sec-consumer-care',
      title: '8. Consumer Care & Grievance Mechanism',
      subtitle: 'Requirements under Rule 6(1)(d)',
      icon: PhoneCall,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            Every pre-packaged commodity package must bear contact details of the person or company officer who can be contacted in case of consumer complaints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Designated Officer / Cell</span>
              <p className="text-slate-600">The specific designation or name (e.g. &ldquo;Consumer Relations Officer&rdquo;, &ldquo;Customer Support Manager&rdquo;).</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Postal Address &amp; PIN</span>
              <p className="text-slate-600">Complete postal address where written communications or grievance notices can be delivered.</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Telephone Helpline</span>
              <p className="text-slate-600">An active, toll-free or reachable telephonic support number.</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Electronic Mail (Email)</span>
              <p className="text-slate-600">A functioning corporate electronic mail address specifically dedicated to customer service.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-ecommerce',
      title: '9. E-Commerce Considerations (Rule 6(10))',
      subtitle: 'Digital marketplace obligations for pre-packaged commodities',
      icon: Globe,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            Under <strong>Rule 6(10)</strong>, an e-commerce entity displaying commodities for retail sale on its digital marketplace or platform must display all mandatory declarations on the digital product listing:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>Name of commodity, Net quantity, MRP, Country of origin, Manufacturer/Packer address, Unit Sale Price (USP).</li>
            <li><strong>Sole Exemption:</strong> Month and year of manufacturing or packing is not required to be pre-declared on the digital listing prior to dispatch, provided the physical delivered package contains it.</li>
          </ul>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950">
            <strong>LabelLens Stage 8 Alignment:</strong> LabelLens implements comparison checks between the physical package declarations and corresponding online marketplace listings to surface discrepancies.
          </div>
        </div>
      ),
    },
    {
      id: 'sec-applicability',
      title: '10. Exceptions & Applicability Flow',
      subtitle: 'How LabelLens evaluates whether a rule applies before flagging a defect',
      icon: Layers,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            A core regulatory principle of LabelLens is that <strong>a missing declaration is only a defect if the requirement actually applies to that commodity and package context</strong>.
          </p>

          {/* Visual Flow Diagram */}
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
            <div className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-wider">
              Deterministic Regulatory Applicability Pipeline
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1.5 bg-slate-800 rounded border border-slate-700 text-slate-200">PRODUCT</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-slate-800 rounded border border-slate-700 text-slate-200">CATEGORY</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-slate-800 rounded border border-slate-700 text-slate-200">PACKAGE TYPE</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-blue-900/80 rounded border border-blue-600 text-blue-200">APPLICABLE RULES</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-amber-950/80 rounded border border-amber-700 text-amber-200">EXCEPTIONS</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-slate-800 rounded border border-slate-700 text-slate-200">REQUIRED DECLARATIONS</span>
              <span className="text-blue-400">→</span>
              <span className="px-2.5 py-1.5 bg-emerald-900/80 rounded border border-emerald-600 text-emerald-200">VALIDATION</span>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs text-slate-600">
            <p><strong>Exemption Examples under Rule 26:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Packages with net weight or measure exceeding 25 kg or 25 L (except cement and fertilizer which remain covered up to 50 kg).</li>
              <li>Commodities packaged exclusively for institutional consumers (such as hotels, airlines, or hospitals) under written commercial contracts.</li>
              <li>Small packages where total surface area is 100 cm² or less, where certain alternate labeling concessions apply under Rule 26.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-rule-versioning',
      title: '11. Amendments & Rule Versioning',
      subtitle: 'Tracking regulatory amendments across inspection timestamps',
      icon: Calendar,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p>
            Statutory rules are periodically amended by Ministry of Consumer Affairs gazette notifications.
            To maintain legal auditability, LabelLens stores regulatory rules with full versioning metadata:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Rule Identifier</span>
              <span className="font-bold text-slate-900">PCR-RULE-6-1-E</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Rule Version</span>
              <span className="font-bold text-slate-900">v2022.07</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Effective Date</span>
              <span className="font-bold text-slate-900">01 Dec 2022</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Applicability</span>
              <span className="font-bold text-slate-900">All Retail Pre-Packaged</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Official Source</span>
              <span className="font-bold text-slate-900">G.S.R. 501(E)</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Validation Logic</span>
              <span className="font-bold text-slate-900">Deterministic RegEx</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Every inspection conducted in LabelLens logs the exact rule version effective at the time of inspection, ensuring that retrospective legal reviews accurately reflect the active statutory code.
          </p>
        </div>
      ),
    },
    {
      id: 'sec-how-labellens-uses',
      title: '12. How LabelLens Uses These Rules',
      subtitle: 'Deterministic rule evaluation with human-in-the-loop oversight',
      icon: CheckCircle2,
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            LabelLens does not allow an LLM or probabilistic AI model to make unilateral legal compliance decisions.
            Instead, it follows a deterministic sequence:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-mono text-slate-800 font-semibold">
              Package Image → Information Extraction → Product/Package Context → Applicability Check → Rule Validation → Potential Issue → Evidence → Inspector Review
            </div>
          </div>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
            <strong>Mandatory System Principle:</strong> LabelLens assists the inspector; it does not replace the legal authority
            or the inspector&apos;s final judgment. All findings remain &ldquo;Potential Non-Compliance&rdquo; until verified and endorsed
            by the authorized human officer.
          </div>
        </div>
      ),
    },
    {
      id: 'sec-official-sources',
      title: '13. Official Sources & Authorities',
      subtitle: 'Authoritative government portals and statutory gazette references',
      icon: ExternalLink,
      content: (
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p className="text-xs text-slate-600">
            Users and inspectors should consult official government portals for primary statutory text and gazette notifications:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <a
              href="https://consumeraffairs.nic.in"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-blue-700">Department of Consumer Affairs</div>
                <div className="text-[11px] text-slate-500">Ministry of Consumer Affairs, Food &amp; Public Distribution</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
            </a>

            <a
              href="https://egazette.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-blue-700">The Gazette of India</div>
                <div className="text-[11px] text-slate-500">Official gazette repository of central rules &amp; amendments</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
            </a>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900">The Legal Metrology Act, 2009</div>
              <div className="text-[11px] text-slate-500">Act No. 1 of 2010 • Primary Parliamentary legislation</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900">Legal Metrology (Packaged Commodities) Rules, 2011</div>
              <div className="text-[11px] text-slate-500">Notification G.S.R. 202(E) and subsequent amendments</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic pt-1">
            Disclaimer: This statutory summary is compiled for inspector reference under the Legal Metrology Act, 2009 and PCR 2011.
          </p>
        </div>
      ),
    },
  ];

  const filteredSections = activeSearch.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : sections;

  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Title Section with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 border-b border-slate-200 pb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Statutory Educational Reference Guide</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            The Legal Metrology (Packaged Commodities) Rules, 2011
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            A comprehensive, structured summary of statutory provisions, mandatory package declarations,
            unit requirements, and the deterministic applicability logic utilized within LabelLens.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigateTo('/login')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Open Inspector Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to LabelLens Home
            </button>
          </div>
        </motion.div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => setActiveSearch(e.target.value)}
            placeholder="Search rules, declarations, font heights, or exemptions..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 shadow-2xs"
          />
        </div>

        {/* Accordion / Card Sections with Stagger Animation */}
        <div className="space-y-3">
          {filteredSections.map((sec, idx) => {
            const isOpen = openSectionId === sec.id;
            const Icon = sec.icon;

            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className={`bg-white border rounded-xl transition-all shadow-2xs ${
                  isOpen ? 'border-blue-400 ring-1 ring-blue-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isOpen ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-sm sm:text-base font-bold text-slate-900">{sec.title}</h2>
                      <p className="text-xs text-slate-500 font-medium">{sec.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-1 rounded text-slate-400 shrink-0">
                    {isOpen ? <ChevronDown className="w-5 h-5 text-blue-700" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 pb-5 sm:px-5 border-t border-slate-100 pt-4 overflow-hidden"
                    >
                      {sec.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
};
