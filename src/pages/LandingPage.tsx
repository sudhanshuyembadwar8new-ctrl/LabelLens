import React from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Camera,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { PublicShell } from '../components/layout/PublicShell';
import { OfficialEmblem } from '../components/ui/OfficialEmblem';
import { ScrollReveal } from '../components/ui/ScrollEffects';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useInspection();

  return (
    <PublicShell>
      <div className="bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
        {/* =========================================================================
            HERO SECTION: Lightweight CSS-based scroll reveal with Tailwind classes
            ========================================================================= */}
        <section className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50/90 via-blue-50/20 to-white py-16 sm:py-24 overflow-hidden">
          {/* Subtle Ambient Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Subtle Top Blue Accent Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4 sm:pt-6">
            {/* LabelLens Logo / Name & Headline */}
            <ScrollReveal delay={100} direction="up" distance="md" className="space-y-3">
              <div className="inline-flex items-center justify-center gap-3.5">
                <div className="p-2.5 bg-slate-950 text-white rounded-xl shadow-md border border-slate-800 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
                  Label<span className="text-blue-600">Lens</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                AI-Powered Digital Legal Metrology Inspector
              </h1>
            </ScrollReveal>

            {/* Short Explanation */}
            <ScrollReveal delay={220} direction="up" distance="md">
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                An evidence-backed digital inspection workspace that helps inspectors examine packaged commodities, identify potential compliance issues, review evidence and prepare structured inspection reports.
              </p>
            </ScrollReveal>

            {/* One Prominent LOGIN button + CTA button */}
            <ScrollReveal delay={300} direction="up" distance="md">
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/legal-metrology')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>LEARN ABOUT LEGAL METROLOGY</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Subtle Assistive Non-Autonomous Notice */}
            <ScrollReveal delay={380} direction="none">
              <p className="text-[11px] text-slate-400 pt-2">
                Assistive system prototype for field testing under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: What is LabelLens?
            ========================================================================= */}
        <section className="py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <ScrollReveal direction="up" distance="md" className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 1</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  What is LabelLens?
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                LabelLens is a digital inspection assistant engineered for Legal Metrology officers in India. When inspecting consumer packages in retail shops, wholesale depots, and ecommerce distribution hubs, officers must verify numerous statutory declarations mandated under the <strong>Legal Metrology Act, 2009</strong> and the <strong>Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)</strong>.
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                LabelLens transforms this manual, paper-intensive task into an organized digital workflow. By capturing photos of the product package, extracting text declarations, and cross-referencing values against codified rules, LabelLens provides inspectors with clear review points and pre-populates structured inspection sheets.
              </p>
            </ScrollReveal>

            {/* Feature Cards with Staggered CSS-based Scroll Reveal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                {
                  title: 'Human-in-the-Loop',
                  desc: 'Non-autonomous assistive tool. All final compliance determinations remain exclusively with the authorized inspector.',
                },
                {
                  title: 'Rule-Codified Logic',
                  desc: 'Evaluations strictly mirror codified sections of PCR 2011 (e.g., Rule 6 mandatory declarations, Rule 11 symbols, and Rule 13 font heights).',
                },
                {
                  title: 'Standardized Records',
                  desc: 'Generates tamper-evident inspection sheets and supervisory ledgers ready for departmental documentation.',
                },
              ].map((card, i) => (
                <ScrollReveal
                  key={card.title}
                  delay={100 * (i + 1)}
                  direction="up"
                  distance="md"
                  className="h-full"
                >
                  <div className="h-full p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all">
                    <div className="font-bold text-slate-900 text-sm mb-1">{card.title}</div>
                    <p className="text-xs text-slate-600 leading-normal">{card.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: Why use LabelLens?
            ========================================================================= */}
        <section className="py-16 sm:py-20 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <ScrollReveal direction="up" distance="md" className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 2</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Why use LabelLens?
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Field enforcement of packaging regulations presents significant operational challenges:
              </p>
            </ScrollReveal>

            {/* Problem Cards with Staggered CSS-based Scroll Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  icon: Clock,
                  iconColor: 'text-amber-600',
                  title: 'Time-Consuming Manual Verification',
                  desc: 'Inspecting small printed text across multiple panels (MRP, manufacturer address, month/year of manufacture, unit sale price, consumer care) takes 15–25 minutes per sample.',
                },
                {
                  icon: AlertTriangle,
                  iconColor: 'text-amber-600',
                  title: 'Microscopic Typography & Ambiguity',
                  desc: 'Inspectors often struggle to measure whether printed numerals satisfy the strict area-based font height minimums specified in PCR 2011 Schedule II.',
                },
                {
                  icon: Camera,
                  iconColor: 'text-blue-600',
                  title: 'Unorganized Evidence Bundles',
                  desc: 'Photos captured on personal mobile phones get misplaced or lack statutory timestamps and structured linkage to the business or commodity.',
                },
                {
                  icon: FileText,
                  iconColor: 'text-blue-600',
                  title: 'Inconsistent Field Reporting',
                  desc: 'Handwritten memos lack uniformity across jurisdictions, creating evidentiary difficulties when issuing statutory notices or compounding offenses.',
                },
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <ScrollReveal
                    key={item.title}
                    delay={100 * (i + 1)}
                    direction="up"
                    distance="md"
                    className="h-full"
                  >
                    <div className="h-full p-5 bg-white border border-slate-200 rounded-lg space-y-2 hover:border-slate-300 hover:shadow-xs transition-all">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <IconComp className={`w-4 h-4 ${item.iconColor} shrink-0`} />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: Key benefits
            ========================================================================= */}
        <section className="py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <ScrollReveal direction="up" distance="md">
              <div className="border-l-4 border-blue-700 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 3</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Key Benefits
                </h2>
              </div>
            </ScrollReveal>

            {/* Benefit Cards with Staggered CSS-based Scroll Reveal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  title: 'Rapid Visual Verification',
                  desc: 'Captures front, back, and side packaging panels in seconds using standard mobile browser cameras or direct uploads.',
                },
                {
                  title: 'Automated PCR Rule Checking',
                  desc: 'Cross-checks mandatory declarations like MRP inclusive-of-taxes syntax, standard unit symbols (g, kg, ml), and packer details.',
                },
                {
                  title: 'Linked Evidence Dossier',
                  desc: 'Every observation is visually linked to a specific crop on the product image, eliminating doubt about what was printed.',
                },
                {
                  title: 'Form 1 Printable Reports',
                  desc: 'Generates clean, standardized inspection sheets with official emblems and complete statutory metadata ready for immediate sign-off.',
                },
              ].map((benefit, i) => (
                <ScrollReveal
                  key={benefit.title}
                  delay={100 * (i + 1)}
                  direction="up"
                  distance="md"
                  className="h-full"
                >
                  <div className="h-full flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">{benefit.title}</h3>
                      <p className="text-xs text-slate-600">{benefit.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: How LabelLens works (Interactive Workflow Pipeline)
            ========================================================================= */}
        <section className="py-16 sm:py-20 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <ScrollReveal direction="up" distance="md" className="space-y-2">
              <div className="border-l-4 border-blue-700 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 4</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  How LabelLens Works
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                LabelLens operates as a structured, 5-step field inspection pipeline:
              </p>
            </ScrollReveal>

            {/* Workflow Step Cards with Staggered CSS-based Scroll Reveal */}
            <div className="space-y-3 pt-2">
              {[
                {
                  step: 1,
                  title: 'Store & Commodity Identification',
                  desc: 'Inspector enters retail store information, commodity category, brand, and declared net quantity. Reference IDs and officer credentials are auto-generated.',
                },
                {
                  step: 2,
                  title: 'Evidence Capture',
                  desc: 'Inspector photographs the front principal display panel, back statutory declarations, and closeup stamps using mobile camera or file upload.',
                },
                {
                  step: 3,
                  title: 'OCR & Declarations Parsing',
                  desc: 'Package markings are identified: MRP, packing date, net quantity, manufacturer address, consumer helpline, and unit sale price.',
                },
                {
                  step: 4,
                  title: 'Inspector Verification Workspace',
                  desc: 'Inspector reviews potential rule observations side-by-side with cropped photo evidence. The officer can accept, modify, or dismiss findings.',
                },
                {
                  step: 5,
                  title: 'Report Generation & Ledger Archival',
                  desc: 'A formal inspection sheet is generated with sovereign watermarks, statutory citations, and full evidence chain, ready for official sign-off.',
                },
              ].map((stepItem, i) => (
                <ScrollReveal
                  key={stepItem.step}
                  delay={80 * (i + 1)}
                  direction="up"
                  distance="sm"
                >
                  <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-start gap-4 hover:border-blue-400 hover:shadow-xs transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-800 font-bold text-sm flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                      {stepItem.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">
                        {stepItem.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{stepItem.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: Legal Metrology Overview
            ========================================================================= */}
        <section className="py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <ScrollReveal direction="up" distance="md" className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 5</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Legal Metrology Regulatory Overview
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Under Section 52(2)(j) of the Legal Metrology Act, 2009, the Central Government promulgated the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong>. Every pre-packaged commodity intended for retail sale must bear legible, definite, and unambiguous mandatory declarations.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="up" distance="md">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Core Mandatory Declarations (Rule 6):</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Name and address of the manufacturer / packer / importer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Country of origin (for imported commodities)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Common or generic name of the commodity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Net quantity in standard SI metric units (Rule 11)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Month and year of manufacture or pre-packing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Maximum Retail Price (MRP) &ldquo;inclusive of all taxes&rdquo;</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Unit Sale Price (USP) where mandated</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                    <span>Consumer redressal contact (name, phone, address, email)</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={220} direction="up" distance="sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500">
                  Detailed references, minimum font heights, and amendments available in the reference section.
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('/legal-metrology')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer w-fit"
                >
                  <span>Read Full PCR 2011 Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: Login CTA
            ========================================================================= */}
        <section className="relative py-16 sm:py-20 border-b border-slate-200 bg-slate-900 text-white overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <ScrollReveal direction="up" distance="md" className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md border border-blue-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Ready to Conduct a Package Inspection?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Authenticate with your authorized inspector credentials to log field visits, verify commodity packaging, and generate official inspection dossiers.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} direction="up" distance="sm">
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-950/50 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 pt-3">
                Select Inspector Login or Admin Login on the authentication page.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: Simple Footer
            ========================================================================= */}
        <footer className="py-8 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <OfficialEmblem type="india" size="xs" />
              <div>
                <span className="font-black text-slate-900">Label<span className="text-blue-600">Lens</span></span>
                <span className="text-slate-400"> &bull; </span>
                <span>Legal Metrology Statutory Surveillance System</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <button
                onClick={() => navigateTo('/legal-metrology')}
                className="hover:text-blue-700 cursor-pointer underline"
              >
                PCR 2011 Rules
              </button>
              <button
                onClick={() => navigateTo('/login')}
                className="hover:text-blue-700 cursor-pointer underline"
              >
                Role Sign-In
              </button>
              <span>Non-Autonomous Assistive System</span>
            </div>
          </div>
        </footer>
      </div>
    </PublicShell>
  );
};
