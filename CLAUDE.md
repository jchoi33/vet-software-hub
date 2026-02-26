# CLAUDE.md — VetSoftwareHub Operating Manual

## IDENTITY
You are the autonomous engineering system for VetSoftwareHub.com — an independent
authority site that helps veterinary practices find the right practice management
software. You build, populate, optimize, and expand this content property.

## BUSINESS MODEL
- **Primary revenue**: B2B SaaS affiliate commissions (recurring monthly payouts)
- **Secondary revenue**: Display ads (Mediavine/Raptive once at 50K sessions/mo, Ezoic before that)
- **Tertiary revenue**: Email newsletter sponsorships + digital products (Buyer's Guide PDF)
- **Strategy**: Programmatic SEO — generate 300+ data-driven pages from structured tool data
- **Edge**: Only independent, non-vendor-biased comparison site in the veterinary PIMS space. Every major competitor is a vendor (Digitail, DaySmart, Cherry) writing biased "best of" posts ranking themselves #1.

## NICHE: Veterinary Practice Management Software (PIMS)
- 30+ tools in the market (see data/tools.json for master dataset)
- Tool pricing: $99-$399+/month → affiliate commissions ~$30-$150/month recurring per referral
- Target audience: Veterinary practice owners, practice managers, hospital administrators
- Market growing 19% through 2026 (U.S. Bureau of Labor Statistics)
- ~33,000 veterinary practices in the USA alone

## TECH STACK
- **Framework**: Astro 5.x (static site generation, blazing fast, SEO-perfect)
- **Styling**: Tailwind CSS 4.x
- **Interactive components**: React (embedded in Astro pages for calculators/tools)
- **Hosting**: Vercel (free tier to start)
- **Database**: Supabase (email subscribers, tool usage analytics, quiz results)
- **Email**: Beehiiv (newsletter) + Resend (transactional)
- **Analytics**: Plausible Analytics ($9/mo, privacy-friendly)
- **Content format**: MDX files generated programmatically from data/tools.json
- **Affiliate tracking**: Custom UTM parameters per tool per page

## SITE STRUCTURE
```
vetsoftwarehub.com/
├── /                              # Homepage with top picks + comparison wizard
├── /reviews/[tool-slug]           # 20 individual in-depth reviews
├── /compare/[tool-a]-vs-[tool-b] # 190 comparison pages (auto-generated)
├── /best/[use-case]              # 30 "Best for X" category pages
├── /alternatives/[tool-slug]     # 20 alternatives pages
├── /pricing/[tool-slug]          # 20 pricing breakdown pages
├── /guides/[topic]               # 20 educational guides
├── /tools/                       # Interactive free tools
│   ├── /tools/revenue-calculator # Vet Practice Revenue Calculator
│   ├── /tools/compare            # Side-by-side comparison tool
│   └── /tools/switching-cost     # PIMS switching cost calculator
├── /newsletter                   # Email signup + archive
└── /about                        # About page (builds trust/E-E-A-T)
```

## PROJECT FILE STRUCTURE
```
vet-software-hub/
├── CLAUDE.md                          # This file
├── astro.config.mjs
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── data/
│   └── tools.json                     # Master dataset (THE source of truth)
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro           # SEO base with schema markup
│   │   ├── ReviewLayout.astro         # For individual reviews
│   │   ├── ComparisonLayout.astro     # For X vs Y pages
│   │   └── GuideLayout.astro         # For editorial guides
│   ├── pages/
│   │   ├── index.astro                # Homepage
│   │   ├── about.astro
│   │   ├── newsletter.astro
│   │   ├── reviews/
│   │   │   └── [slug].astro           # Dynamic: generates from tools.json
│   │   ├── compare/
│   │   │   └── [...slugs].astro       # Dynamic: all X-vs-Y combos
│   │   ├── best/
│   │   │   └── [usecase].astro        # Dynamic: best-for pages
│   │   ├── alternatives/
│   │   │   └── [slug].astro           # Dynamic: alternatives pages
│   │   ├── pricing/
│   │   │   └── [slug].astro           # Dynamic: pricing pages
│   │   ├── guides/
│   │   │   └── [slug].astro           # Markdown-driven guides
│   │   └── tools/
│   │       ├── revenue-calculator.astro
│   │       ├── compare.astro
│   │       └── switching-cost.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ToolCard.astro             # Reusable tool summary card
│   │   ├── ComparisonTable.astro      # Side-by-side feature table
│   │   ├── PricingCard.astro          # Pricing display component
│   │   ├── ProsCons.astro             # Pros/cons list component
│   │   ├── AffiliateButton.astro      # CTA button with UTM tracking
│   │   ├── RatingStars.astro          # Star rating display
│   │   ├── EmailCapture.astro         # Newsletter signup form
│   │   ├── TableOfContents.astro      # Auto-generated TOC
│   │   ├── SchemaMarkup.astro         # JSON-LD structured data
│   │   ├── RevenueCalculator.tsx      # React interactive calculator
│   │   ├── ComparisonWizard.tsx       # React comparison tool
│   │   └── SwitchingCostCalc.tsx      # React switching cost calculator
│   ├── utils/
│   │   ├── tools.ts                   # Helper functions for tools.json
│   │   ├── seo.ts                     # SEO metadata generators
│   │   ├── affiliates.ts             # Affiliate link builder with UTM
│   │   └── comparisons.ts            # Generate all comparison pairs
│   └── styles/
│       └── global.css                 # Tailwind base + custom styles
├── public/
│   ├── images/
│   │   ├── tools/                     # Tool logos/screenshots
│   │   └── og/                        # Auto-generated OG images
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   ├── generate-comparisons.ts        # Build all X-vs-Y page data
│   ├── generate-og-images.ts          # Create social sharing images
│   ├── validate-data.ts              # Ensure tools.json is valid
│   └── check-affiliate-links.ts      # Verify all affiliate URLs work
└── .github/
    └── workflows/
        ├── daily-checks.yml           # Check broken links, monitor rankings
        ├── weekly-content.yml         # Generate newsletter, social snippets
        └── monthly-refresh.yml        # Full data refresh cycle
```

## CONTENT GENERATION RULES

### Data Integrity
- EVERY claim about a tool MUST come from data/tools.json or cited public sources
- NEVER fabricate features, pricing, or ratings
- When data is uncertain, say "contact [tool] for current pricing" rather than guess
- Update timestamps must be accurate

### SEO Architecture
- Primary keyword in URL, H1, title tag, and first 100 words
- Every page targets ONE primary keyword + 2-3 secondary keywords
- Internal links: every page links to 3-5 related pages minimum
- Schema markup on every page (Product, Review, FAQ, SoftwareApplication)
- Auto-generate FAQ section from real "People Also Ask" queries
- Canonical URLs set correctly to avoid duplicate content

### Affiliate Ethics (CRITICAL for E-E-A-T)
- Prominent affiliate disclosure on EVERY page with affiliate links
- NEVER rank a tool higher solely because of commission rates
- Always include free/low-cost alternatives in comparisons
- Be honest about weaknesses — trust converts better than hype
- Disclose when a tool has no affiliate program (proves independence)
- Track which tools have affiliate programs in tools.json

### Writing Style
- Authoritative but accessible — write for practice managers, not developers
- Use veterinary terminology correctly (SOAP notes, PIMS, EMR, etc.)
- Include specific numbers: pricing, user counts, ratings
- Every comparison must have a clear, justified recommendation
- Avoid generic filler — every paragraph should add unique value
- First person plural ("we tested", "we recommend") for authority

### Page Templates

#### Review Page (/reviews/[tool])
1. Quick verdict box (rating, best for, pricing, key takeaway)
2. What is [Tool]? (2-3 paragraphs)
3. Key features breakdown (with pros/cons per feature)
4. Pricing analysis (tiers, what you get, value assessment)
5. Who is [Tool] best for? (specific practice types)
6. Who should look elsewhere?
7. How [Tool] compares to alternatives (mini comparison table)
8. Real user feedback summary (aggregate from G2/Capterra)
9. Final verdict + affiliate CTA
10. FAQ section

#### Comparison Page (/compare/[tool-a]-vs-[tool-b])
1. Quick comparison table (side-by-side key metrics)
2. Overview of both tools
3. Feature-by-feature comparison (5-7 key areas)
4. Pricing comparison
5. User ratings comparison
6. Who should choose [Tool A]?
7. Who should choose [Tool B]?
8. Our recommendation
9. FAQ section

#### Best-For Page (/best/[use-case])
1. Quick picks summary (top 3 with one-line verdict each)
2. How we evaluated (methodology — builds trust)
3. Detailed review of each recommended tool (3-5 tools)
4. Comparison table of all picks
5. How to choose the right one for your practice
6. FAQ section

## AUTOMATION SCHEDULES

### Daily (GitHub Actions)
- Verify all affiliate links are working (200 status codes)
- Check for any tools.json data inconsistencies

### Weekly (Claude Code session, ~30 min)
- Generate 2-3 new content pieces targeting emerging keywords
- Draft weekly email newsletter from top-performing content
- Create social media snippets from new/updated content

### Monthly (Claude Code session, ~2 hours)
- Refresh pricing data across all tools
- Check for new tools entering the market
- Update any features that have changed
- Review analytics: top pages, conversion rates, revenue
- Identify content gaps and generate new pages
- Update "last updated" dates on refreshed content

### Quarterly
- Full competitive analysis of other sites in the niche
- Refresh all comparison pages with latest data
- Generate new case study / in-depth guide content
- Review and optimize affiliate program relationships

## KEY METRICS TO TRACK
- Organic traffic (target: +15% month-over-month after month 3)
- Email subscribers (target: 500+ by month 6)
- Affiliate click-through rate (target: 3-5% on money pages)
- Affiliate conversion rate (target: 2-5% of clicks)
- Revenue per page (identify and double down on top performers)
- Domain Rating/Authority (target: DR 20+ by month 6)
- Pages indexed by Google (target: 200+ by month 3)
- Average position for money keywords (target: top 10 by month 6)

## COMMANDS
```bash
# Development
npm run dev                    # Start Astro dev server
npm run build                  # Build production site
npm run preview                # Preview production build

# Content generation
npm run generate:comparisons   # Generate all comparison page data
npm run generate:og            # Generate OG images for all pages
npm run validate:data          # Validate tools.json integrity
npm run check:links            # Check all affiliate links

# Deployment
vercel                         # Deploy to Vercel (staging)
vercel --prod                  # Deploy to production
```

## LAUNCH SEQUENCE
1. Scaffold Astro project with all layouts and components
2. Build homepage with top picks + comparison wizard
3. Generate all 20 review pages from tools.json
4. Generate top 30 comparison pages (highest-volume keyword pairs)
5. Generate 15 best-for pages
6. Build Revenue Calculator tool (React)
7. Set up email capture with Beehiiv
8. Deploy to Vercel
9. Submit sitemap to Google Search Console
10. Apply to affiliate programs for all tools with programs
11. Begin weekly content expansion cycle
