import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tool {
  name: string;
  slug: string;
  tagline: string;
  website: string;
  starting_price_monthly: number | null;
  pricing_model: string;
  free_trial: boolean;
  best_for: string[];
  pros: string[];
  rating_capterra: number | null;
  rating_g2: number | null;
  affiliate_program: boolean;
}

interface RecommendedTool extends Tool {
  whyRecommended: string;
  affiliateUrl: string;
  badge: string;
}

interface CalcInputs {
  numVets: number;
  appsPerDay: number;
  avgTransaction: number;
  noShowRate: number;
  softwareCost: number;
}

interface CalcResults {
  monthlyRevenue: number;
  annualRevenue: number;
  noShowLossMonthly: number;
  noShowLossAnnual: number;
  revenuePerVet: number;
  workingDaysPerMonth: number;
  totalAppsPerMonth: number;
  potentialRecovery: number; // If no-show rate dropped to 5%
  softwareROIMonths: number | null;
  netMonthlyGain: number;
}

// ─── Tool dataset (embedded — avoids async fetch) ────────────────────────────

const TOOLS: Tool[] = [
  {
    name: "Shepherd Veterinary Software",
    slug: "shepherd",
    tagline: "PIMS built by a vet who got it",
    website: "https://www.shepherd.vet",
    starting_price_monthly: 99,
    pricing_model: "Per location/month",
    free_trial: true,
    best_for: ["Start-up practices", "Small clinics", "Solo veterinarians"],
    pros: ["Built by a veterinarian", "Very intuitive interface", "Affordable for startups", "50% discount for new practices"],
    rating_capterra: 4.9,
    rating_g2: 4.8,
    affiliate_program: true,
  },
  {
    name: "Digitail",
    slug: "digitail",
    tagline: "AI-native, all-in-one platform for modern veterinary clinics",
    website: "https://digitail.com",
    starting_price_monthly: 150,
    pricing_model: "Per veterinarian/month",
    free_trial: true,
    best_for: ["Multi-location clinics", "Growing practices", "AI-forward teams"],
    pros: ["AI-powered note generation saves hours daily", "Modern intuitive interface", "Strong mobile app for pet parents"],
    rating_capterra: 4.8,
    rating_g2: 4.7,
    affiliate_program: true,
  },
  {
    name: "VetBadger",
    slug: "vetbadger",
    tagline: "Veterinary software designed to reduce burnout",
    website: "https://vetbadger.com",
    starting_price_monthly: 99,
    pricing_model: "Per practice/month",
    free_trial: true,
    best_for: ["Small practices wanting simplicity", "Budget-conscious clinics", "Solo vets"],
    pros: ["Workflow designed to reduce burnout", "Affordable pricing", "Clean interface", "Free trial available"],
    rating_capterra: 4.5,
    rating_g2: 4.4,
    affiliate_program: true,
  },
  {
    name: "ezyVet",
    slug: "ezyvet",
    tagline: "Cloud-based veterinary practice management solution",
    website: "https://ezyvet.com",
    starting_price_monthly: 250,
    pricing_model: "Custom quote based on practice size",
    free_trial: true,
    best_for: ["Large hospitals", "Specialty/referral clinics", "Multi-location enterprises"],
    pros: ["Extremely customizable workflows", "Deep IDEXX integration", "Powerful reporting suite"],
    rating_capterra: 4.4,
    rating_g2: 4.5,
    affiliate_program: true,
  },
  {
    name: "DaySmart Vet",
    slug: "daysmart-vet",
    tagline: "Easy-to-use cloud-based practice management",
    website: "https://www.daysmart.com/vet",
    starting_price_monthly: 116,
    pricing_model: "Per practice/month",
    free_trial: true,
    best_for: ["Small to mid-size practices", "Client communication focus", "Practices wanting simplicity"],
    pros: ["Strong client communication tools", "Two-way text messaging", "User-friendly interface"],
    rating_capterra: 4.2,
    rating_g2: 4.3,
    affiliate_program: true,
  },
  {
    name: "Vetspire",
    slug: "vetspire",
    tagline: "Innovative PIMS for clinical decision-making",
    website: "https://vetspire.com",
    starting_price_monthly: 349,
    pricing_model: "Per full-time veterinarian/month",
    free_trial: false,
    best_for: ["Specialty clinics", "Teaching hospitals", "Data-driven practices"],
    pros: ["Originally built for teaching hospitals", "Strong clinical decision support", "Fast interface"],
    rating_capterra: 4.5,
    rating_g2: 4.6,
    affiliate_program: true,
  },
  {
    name: "Onward Vet",
    slug: "onward-vet",
    tagline: "AI-powered PIMS with speech-to-text and automated SOAP notes",
    website: "https://onwardvet.com",
    starting_price_monthly: 300,
    pricing_model: "Per practice/month",
    free_trial: true,
    best_for: ["Tech-forward practices", "Solo vets wanting AI assistance", "Practices drowning in documentation"],
    pros: ["AI-driven note-taking saves significant time", "Modern interface", "Built to reduce documentation burden"],
    rating_capterra: null,
    rating_g2: null,
    affiliate_program: true,
  },
  {
    name: "Provet Cloud",
    slug: "provet-cloud",
    tagline: "Comprehensive cloud-based veterinary practice management",
    website: "https://provetcloud.com",
    starting_price_monthly: 249,
    pricing_model: "Per practice/month",
    free_trial: true,
    best_for: ["International/multi-country practices", "Mid to large clinics", "Practices wanting robust inventory"],
    pros: ["Strong international support", "Robust inventory management", "Scalable"],
    rating_capterra: 4.4,
    rating_g2: 4.3,
    affiliate_program: true,
  },
  {
    name: "PetDesk",
    slug: "petdesk",
    tagline: "Client engagement platform for veterinary practices",
    website: "https://petdesk.com",
    starting_price_monthly: 200,
    pricing_model: "Custom quote based on features",
    free_trial: false,
    best_for: ["Practices focused on client retention", "Client engagement optimization", "Online booking focused"],
    pros: ["Excellent client-facing app", "Strong automated reminders", "Reduces no-shows significantly"],
    rating_capterra: 4.4,
    rating_g2: 4.5,
    affiliate_program: true,
  },
];

// ─── Recommendation engine ────────────────────────────────────────────────────

function getRecommendations(inputs: CalcInputs): RecommendedTool[] {
  const { numVets, noShowRate, softwareCost } = inputs;

  // Score each tool based on practice profile
  const scored = TOOLS.map((tool) => {
    let score = 0;
    let whyRecommended = "";
    let badge = "";

    const price = tool.starting_price_monthly ?? 999;
    const rating = ((tool.rating_capterra ?? 0) + (tool.rating_g2 ?? 0)) / (tool.rating_capterra && tool.rating_g2 ? 2 : 1) || 0;

    // Practice size logic
    if (numVets === 1) {
      // Solo vet
      if (tool.best_for.some((b) => b.toLowerCase().includes("solo") || b.toLowerCase().includes("start"))) score += 3;
      if (price <= 120) score += 2;
      if (price <= 99) score += 1;
    } else if (numVets <= 3) {
      // Small practice
      if (tool.best_for.some((b) => b.toLowerCase().includes("small"))) score += 3;
      if (price <= 200) score += 2;
    } else if (numVets <= 8) {
      // Mid-size
      if (tool.best_for.some((b) => b.toLowerCase().includes("growing") || b.toLowerCase().includes("mid"))) score += 3;
    } else {
      // Large / enterprise
      if (tool.best_for.some((b) => b.toLowerCase().includes("large") || b.toLowerCase().includes("multi") || b.toLowerCase().includes("enterprise"))) score += 3;
    }

    // High no-show rate → reward client communication tools
    if (noShowRate >= 10) {
      if (tool.pros.some((p) => p.toLowerCase().includes("remind") || p.toLowerCase().includes("no-show") || p.toLowerCase().includes("communicat"))) score += 2;
      if (tool.slug === "petdesk") score += 3; // PetDesk is king of no-show reduction
      if (tool.slug === "daysmart-vet") score += 2;
    }

    // Reward good ratings
    score += rating * 0.5;

    // Affordable upgrade from current software
    if (softwareCost > 0 && price < softwareCost * 0.8) score += 1;

    // Free trial bonus
    if (tool.free_trial) score += 0.5;

    // Determine why recommended
    if (numVets === 1 && tool.slug === "shepherd") {
      whyRecommended = "Built by a veterinarian for solo practitioners. The 50% startup discount makes it the most affordable full-featured PIMS available.";
      badge = "Best for Solo Vets";
    } else if (numVets <= 3 && tool.slug === "vetbadger") {
      whyRecommended = "Designed specifically to reduce staff burnout. At $99/mo with a free trial, it is one of the most affordable full-featured cloud PIMS available.";
      badge = "Easiest to Learn";
    } else if (numVets <= 3 && tool.slug === "shepherd") {
      whyRecommended = "At $99/mo per location with a 50% new-practice discount, it is the best-value full-featured PIMS for small clinics.";
      badge = "Best Value";
    } else if (noShowRate >= 10 && tool.slug === "petdesk") {
      whyRecommended = "Reduces no-shows by 20-40% through automated reminders and two-way texting. With your current no-show rate, this could recover thousands in monthly revenue.";
      badge = "Best for No-Show Reduction";
    } else if (numVets >= 4 && tool.slug === "digitail") {
      whyRecommended = `At ${numVets} vets, Digitail's AI SOAP notes save each doctor 30-60 min/day in documentation. That's recovered clinical capacity worth more than the software cost.`;
      badge = "Best ROI for Growing Clinics";
    } else if (numVets >= 8 && tool.slug === "ezyvet") {
      whyRecommended = "The most customizable cloud PIMS on the market. Handles multi-location reporting, complex workflows, and the deepest IDEXX integration available.";
      badge = "Best for Large Hospitals";
    } else if (numVets >= 8 && tool.slug === "vetspire") {
      whyRecommended = "Built for specialty and teaching hospitals. Handles high clinical complexity with decision support tools that improve diagnostic accuracy.";
      badge = "Best for Specialty Clinics";
    } else {
      // Generic fallback reasons
      const topPro = tool.pros[0] ?? "Strong feature set";
      whyRecommended = `${topPro}. Rated ${rating > 0 ? rating.toFixed(1) + "/5.0" : "highly"} by practice managers. ${tool.free_trial ? "Free trial available — no commitment required." : ""}`;
      badge = tool.best_for[0] ?? "Top Pick";
    }

    const affiliateUrl = `${tool.website}?utm_source=vetsoftwarehub&utm_medium=affiliate&utm_campaign=revenue-calculator&utm_content=${tool.slug}`;

    return { ...tool, score, whyRecommended, badge, affiliateUrl };
  });

  // Sort by score, take top 3, ensure variety
  const sorted = scored.sort((a, b) => b.score - a.score);

  // Dedupe by category to ensure variety
  const picks: RecommendedTool[] = [];
  const seen = new Set<string>();
  for (const tool of sorted) {
    if (picks.length >= 3) break;
    // Avoid two tools with the same starting price to ensure variety
    const priceKey = tool.starting_price_monthly?.toString() ?? "custom";
    if (!seen.has(priceKey)) {
      picks.push(tool);
      seen.add(priceKey);
    } else if (picks.length < 3) {
      picks.push(tool);
    }
  }

  return picks.slice(0, 3);
}

// ─── Calculation logic ────────────────────────────────────────────────────────

function calculate(inputs: CalcInputs): CalcResults {
  const { numVets, appsPerDay, avgTransaction, noShowRate, softwareCost } = inputs;
  const workingDaysPerMonth = 22;
  const totalAppsPerMonth = numVets * appsPerDay * workingDaysPerMonth;
  const noShowRateDecimal = noShowRate / 100;

  const monthlyRevenue = totalAppsPerMonth * avgTransaction * (1 - noShowRateDecimal);
  const annualRevenue = monthlyRevenue * 12;
  const noShowLossMonthly = totalAppsPerMonth * avgTransaction * noShowRateDecimal;
  const noShowLossAnnual = noShowLossMonthly * 12;
  const revenuePerVet = monthlyRevenue / numVets;

  // Potential recovery: if no-show rate dropped from current to 5%
  const targetNoShowRate = Math.min(noShowRate, 5) / 100;
  const optimizedRevenue = totalAppsPerMonth * avgTransaction * (1 - targetNoShowRate);
  const potentialRecovery = noShowRate > 5 ? optimizedRevenue - monthlyRevenue : 0;

  // ROI of switching: months until better software pays for itself
  // Assume better software costs $150/mo more but recovers 15% of no-shows
  const softwareUpgradeCost = Math.max(0, 150 - softwareCost); // net additional cost
  const noShowRecovery = noShowLossMonthly * 0.15; // conservative 15% recovery
  const aiTimeSaving = numVets * 50; // $50/vet/mo in recovered clinical time
  const netMonthlyGain = noShowRecovery + aiTimeSaving - softwareUpgradeCost;

  const softwareROIMonths = softwareUpgradeCost > 0 && netMonthlyGain > 0
    ? Math.ceil(softwareUpgradeCost / netMonthlyGain)
    : null;

  return {
    monthlyRevenue,
    annualRevenue,
    noShowLossMonthly,
    noShowLossAnnual,
    revenuePerVet,
    workingDaysPerMonth,
    totalAppsPerMonth,
    potentialRecovery,
    softwareROIMonths,
    netMonthlyGain,
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
}

// ─── Slider input component ───────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  hint: string;
  onChange: (v: number) => void;
}

function SliderInput({ label, value, min, max, step, format, hint, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="rounded-md bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700 tabular-nums">
          {format(value)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200"
          style={{
            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
          }}
        />
      </div>
      <p className="text-xs text-slate-400">{hint}</p>
    </div>
  );
}

// ─── Result metric card ───────────────────────────────────────────────────────

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  color?: "default" | "green" | "red" | "amber";
  large?: boolean;
}

function MetricCard({ label, value, sub, color = "default", large }: MetricProps) {
  const colors = {
    default: "border-slate-200 bg-white",
    green: "border-teal-200 bg-teal-50",
    red: "border-red-200 bg-red-50",
    amber: "border-amber-200 bg-amber-50",
  };
  const valueColors = {
    default: "text-slate-900",
    green: "text-teal-700",
    red: "text-red-700",
    amber: "text-amber-700",
  };

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 font-bold tabular-nums ${large ? "text-3xl" : "text-2xl"} ${valueColors[color]}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

// ─── Star rating display ──────────────────────────────────────────────────────

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-slate-400">No reviews yet</span>;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className={`h-3.5 w-3.5 ${i < full ? "text-amber-400" : half && i === full ? "text-amber-300" : "text-slate-200"}`}>
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Email capture inside calculator ─────────────────────────────────────────

interface EmailCaptureProps {
  monthlyRevenue: number;
  noShowLoss: number;
}

function InlineEmailCapture({ monthlyRevenue, noShowLoss }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-semibold text-teal-800">Report on its way!</p>
        <p className="mt-1 text-sm text-teal-600">
          We have sent your personalized revenue report and software recommendations to {email}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
            <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-teal-900">Get Your Personalized Revenue Report</h3>
          <p className="mt-1 text-sm text-teal-700">
            We will email you a PDF with your full revenue analysis ({fmtK(monthlyRevenue)}/mo estimate), 
            no-show cost breakdown ({fmtK(noShowLoss)}/mo lost), and our top software recommendations 
            for your practice size.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send My Report"}
        </button>
      </form>
      <p className="mt-2 text-xs text-teal-600">
        No spam. Unsubscribe anytime. We also send a weekly vet software deal digest.
      </p>
    </div>
  );
}

// ─── Main Calculator Component ────────────────────────────────────────────────

export default function RevenueCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>({
    numVets: 2,
    appsPerDay: 18,
    avgTransaction: 185,
    noShowRate: 8,
    softwareCost: 0,
  });

  const [results, setResults] = useState<CalcResults>(calculate(inputs));
  const [recommendations, setRecommendations] = useState<RecommendedTool[]>(getRecommendations(inputs));
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleChange(key: keyof CalcInputs, value: number) {
    const next = { ...inputs, [key]: value };
    setInputs(next);
    setResults(calculate(next));
    setRecommendations(getRecommendations(next));
  }

  function handleCalculate() {
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const avgRating = (tool: Tool) => {
    const ratings = [tool.rating_capterra, tool.rating_g2].filter(Boolean) as number[];
    if (!ratings.length) return null;
    return parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1));
  };

  return (
    <div className="font-sans text-slate-800">

      {/* ── Inputs Panel ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Enter Your Practice Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Adjust the sliders to match your practice. Results update instantly.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <SliderInput
            label="Number of Veterinarians"
            value={inputs.numVets}
            min={1} max={20} step={1}
            format={(v) => `${v} vet${v !== 1 ? "s" : ""}`}
            hint="Full-time vets actively seeing patients"
            onChange={(v) => handleChange("numVets", v)}
          />
          <SliderInput
            label="Appointments Per Vet Per Day"
            value={inputs.appsPerDay}
            min={4} max={40} step={1}
            format={(v) => `${v} appts`}
            hint="Average across all vets on a typical workday"
            onChange={(v) => handleChange("appsPerDay", v)}
          />
          <SliderInput
            label="Average Transaction Value"
            value={inputs.avgTransaction}
            min={50} max={600} step={5}
            format={(v) => `$${v}`}
            hint="Average invoice per appointment (all services)"
            onChange={(v) => handleChange("avgTransaction", v)}
          />
          <SliderInput
            label="No-Show / Cancellation Rate"
            value={inputs.noShowRate}
            min={0} max={30} step={1}
            format={(v) => `${v}%`}
            hint="Industry average is 6-10%. Above 10% is high."
            onChange={(v) => handleChange("noShowRate", v)}
          />
          <div className="sm:col-span-2">
            <SliderInput
              label="Current Monthly Software Cost"
              value={inputs.softwareCost}
              min={0} max={1000} step={10}
              format={(v) => v === 0 ? "None / $0" : `$${v}/mo`}
              hint="What you currently pay for your PIMS. Used to calculate ROI of switching."
              onChange={(v) => handleChange("softwareCost", v)}
            />
          </div>
        </div>

        {/* Live preview totals */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Appts/Mo</p>
            <p className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
              {(inputs.numVets * inputs.appsPerDay * 22).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Est. Revenue/Mo</p>
            <p className="mt-1 text-lg font-bold text-teal-700 tabular-nums">
              {fmtK(results.monthlyRevenue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">No-Show Loss/Mo</p>
            <p className="mt-1 text-lg font-bold text-red-600 tabular-nums">
              {fmtK(results.noShowLossMonthly)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Revenue/Vet/Mo</p>
            <p className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
              {fmtK(results.revenuePerVet)}
            </p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full rounded-xl bg-teal-600 py-3.5 text-base font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.99]"
        >
          Calculate My Full Revenue Report →
        </button>
      </div>

      {/* ── Results Panel ── */}
      {showResults && (
        <div ref={resultsRef} className="mt-8 space-y-8">

          {/* Revenue summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Your Revenue Snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">
              Based on {inputs.numVets} vet{inputs.numVets !== 1 ? "s" : ""}, {inputs.appsPerDay} appts/day, ${inputs.avgTransaction} avg transaction, {inputs.noShowRate}% no-show rate.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Est. Monthly Revenue"
                value={fmtK(results.monthlyRevenue)}
                sub={`${results.totalAppsPerMonth.toLocaleString()} appointments completed`}
                color="green"
                large
              />
              <MetricCard
                label="Est. Annual Revenue"
                value={fmtK(results.annualRevenue)}
                sub="Projected at current rate"
                color="default"
              />
              <MetricCard
                label="Revenue Per Vet / Month"
                value={fmtK(results.revenuePerVet)}
                sub="Industry benchmark: $25K–$45K"
                color="default"
              />
              <MetricCard
                label="Monthly No-Show Loss"
                value={fmtK(results.noShowLossMonthly)}
                sub={`${fmtK(results.noShowLossAnnual)}/year walking out the door`}
                color="red"
              />
            </div>
          </section>

          {/* No-show deep dive */}
          {results.noShowLossMonthly > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-amber-900">
                    No-Show Opportunity: {fmtK(results.noShowLossMonthly)}/mo Left on the Table
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-amber-800">
                    Your {inputs.noShowRate}% no-show rate costs you <strong>{fmtK(results.noShowLossMonthly)}/month</strong> in missed appointments.
                    {results.potentialRecovery > 0 && (
                      <> Reducing it to 5% with automated reminders and two-way texting could recover <strong>{fmtK(results.potentialRecovery)}/month</strong> — that is <strong>{fmtK(results.potentialRecovery * 12)}/year</strong>.</>
                    )}
                    {inputs.noShowRate >= 10 && (
                      <> Your current rate is above the industry average of 6-10%. This is a high-priority area to address.</>
                    )}
                  </p>
                </div>
              </div>

              {results.potentialRecovery > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Potential Monthly Recovery</p>
                  <p className="mt-1 text-2xl font-bold text-amber-700 tabular-nums">{fmtK(results.potentialRecovery)}</p>
                  <p className="mt-1 text-xs text-amber-600">If no-show rate reduced to 5% with better reminder tools</p>
                </div>
              )}
            </section>
          )}

          {/* Software ROI */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Software ROI Analysis</h2>
            <p className="mt-1 text-sm text-slate-500">
              What better PIMS software could mean for your bottom line.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="No-Show Revenue Recovered"
                value={fmtK(results.noShowLossMonthly * 0.15)}
                sub="Conservative 15% recovery via better reminders"
                color="green"
              />
              <MetricCard
                label="AI Time Savings / Month"
                value={fmtK(inputs.numVets * 50)}
                sub={`$50 recovered per vet via faster documentation`}
                color="green"
              />
              <MetricCard
                label="Est. Net Monthly Gain"
                value={results.netMonthlyGain > 0 ? `+${fmtK(results.netMonthlyGain)}` : "Varies by tool"}
                sub={results.netMonthlyGain > 0 ? "After software upgrade cost" : "Compare tools below to find best fit"}
                color={results.netMonthlyGain > 0 ? "green" : "default"}
              />
            </div>

            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
              Assumptions: 15% no-show reduction from improved reminders; $50/vet/mo in recovered clinical time from AI note generation; net cost is difference between current and new software. Individual results vary.
            </div>
          </section>

          {/* Email capture */}
          <InlineEmailCapture
            monthlyRevenue={results.monthlyRevenue}
            noShowLoss={results.noShowLossMonthly}
          />

          {/* Tool recommendations */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Top 3 Recommended Tools for Your Practice
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Based on {inputs.numVets} vet{inputs.numVets !== 1 ? "s" : ""}, {inputs.noShowRate}% no-show rate, and your current software cost. Ranked by fit for your specific profile.
            </p>

            <div className="mt-6 space-y-5">
              {recommendations.map((tool, i) => {
                const rating = avgRating(tool);
                return (
                  <article
                    key={tool.slug}
                    className={`rounded-xl border p-5 sm:p-6 transition-shadow hover:shadow-md ${i === 0 ? "border-teal-200 bg-teal-50/30" : "border-slate-200 bg-white"}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        {/* Rank badge */}
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${i === 0 ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                          #{i + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">{tool.name}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${i === 0 ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"}`}>
                              {tool.badge}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{tool.tagline}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3">
                            <Stars rating={rating} />
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-semibold text-slate-700">
                              {tool.starting_price_monthly !== null
                                ? `From $${tool.starting_price_monthly}/mo`
                                : "Custom pricing"}
                            </span>
                            {tool.free_trial && (
                              <>
                                <span className="text-xs text-slate-400">·</span>
                                <span className="text-xs font-semibold text-teal-600">Free trial</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                        <a
                          href={tool.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${i === 0 ? "bg-teal-600 text-white hover:bg-teal-500" : "border border-teal-200 bg-white text-teal-700 hover:bg-teal-50"}`}
                        >
                          {tool.free_trial ? "Start Free Trial" : "Get a Demo"}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a
                          href={`/reviews/${tool.slug}`}
                          className="text-xs text-slate-500 hover:text-teal-600 transition-colors"
                        >
                          Read full review →
                        </a>
                      </div>
                    </div>

                    {/* Why recommended */}
                    <div className="mt-4 rounded-lg border border-teal-100 bg-white px-4 py-3">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-teal-700">Why this fits your practice: </span>
                        {tool.whyRecommended}
                      </p>
                    </div>

                    {/* Top pros */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tool.pros.slice(0, 3).map((pro) => (
                        <span key={pro} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600">
                          ✓ {pro}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              <strong>Disclosure:</strong> VetSoftwareHub earns a commission if you purchase through our links, at no extra cost to you. Recommendations are based on practice size, no-show rate, and rating data — not commission rates.
            </div>
          </section>

          {/* Methodology note */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">How we calculate these numbers:</strong> Monthly revenue = (vets × appts/day × 22 working days) × avg transaction × (1 - no-show rate). No-show loss = appointments × avg transaction × no-show rate. Potential recovery assumes reducing to 5% no-show rate with improved reminder tools. Software ROI assumes 15% no-show reduction and $50/vet/mo in AI-driven time savings. All figures are estimates for planning purposes — your actual results will vary.
          </div>

        </div>
      )}
    </div>
  );
}
