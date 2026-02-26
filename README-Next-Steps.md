# VetSoftwareHub — Your $10K/Month Niche Authority Site

## What's In This Starter Kit

```
vet-software-hub/
├── CLAUDE.md              ← THE KEY FILE: Paste this into your Claude Code project.
│                            It contains every instruction Claude Code needs to build,
│                            populate, and maintain the entire site autonomously.
│
├── data/
│   └── tools.json         ← Master dataset of 18 veterinary software tools with
│                            pricing, features, ratings, pros/cons, affiliate info.
│                            This is the engine that powers 300+ pages.
│
├── src/
│   └── utils/
│       ├── tools.ts       ← Helper functions for reading/filtering/sorting tools
│       └── seo.ts         ← SEO metadata generators for every page type
│
├── package.json           ← Astro 5 + React + Tailwind project config
└── astro.config.mjs       ← Astro configuration with sitemap plugin
```

## Your Next Steps (This Weekend)

### Step 1: Set Up Your Dev Environment (30 minutes)
```bash
# Install Node.js 20+ if you haven't already
# Install Claude Code: npm install -g @anthropic-ai/claude-code

# Create your project
mkdir vet-software-hub && cd vet-software-hub

# Copy all the files from this starter kit into the directory
# (CLAUDE.md, data/, src/, package.json, astro.config.mjs)

# Install dependencies
npm install
```

### Step 2: Launch Claude Code (the magic happens here)
```bash
# Start Claude Code in your project directory
claude

# Claude Code will read CLAUDE.md automatically and understand the entire project.
# Give it this first prompt:
```

**Your first Claude Code prompt:**
```
Read CLAUDE.md and data/tools.json. Then:

1. Build the complete Astro site scaffold following the project structure in CLAUDE.md
2. Create the BaseLayout with proper SEO meta tags, schema markup, and affiliate disclosure
3. Build the homepage with:
   - Hero section explaining what VetSoftwareHub is
   - "Top 5 Picks" summary cards using data from tools.json
   - Comparison wizard CTA
   - Email capture section
4. Build the ToolCard, ComparisonTable, PricingCard, ProsCons, AffiliateButton,
   and RatingStars components
5. Generate the first 5 review pages for: digitail, ezyvet, shepherd, daysmart-vet, vetspire
6. Generate the first 5 comparison pages for the highest-value pairs:
   digitail-vs-ezyvet, digitail-vs-shepherd, ezyvet-vs-vetspire,
   daysmart-vet-vs-hippo-manager, shepherd-vs-vetbadger
7. Deploy to Vercel

Make the design clean, trustworthy, and professional. Use a color palette
of navy blue (#1e3a5f), white, and subtle green (#10b981) accents.
Typography: use a professional serif for headings and clean sans-serif for body text.
```

### Step 3: Expand Content (Next Week, ~5 hrs)
```
Generate all remaining review pages for every tool in tools.json.
Then generate the top 15 "best for" pages:
- best-veterinary-software-for-small-practices
- best-veterinary-software-for-large-hospitals
- best-free-veterinary-software
- best-veterinary-software-with-ai
- best-cloud-based-veterinary-software
- best-veterinary-software-for-multi-location
- best-veterinary-software-for-startups
- best-veterinary-software-for-equine-practices
- best-veterinary-software-for-mobile-vets
- best-veterinary-software-for-emergency-clinics
- best-veterinary-software-for-specialty-clinics
- best-veterinary-software-for-client-communication
- best-veterinary-software-for-inventory-management
- best-veterinary-software-for-telemedicine
- best-veterinary-software-for-mixed-practice
```

### Step 4: Build Free Tool (Week 2, ~3 hrs)
```
Build the Vet Practice Revenue Calculator as a React component:
- Inputs: number of vets, avg appointments/day, avg transaction value,
  current no-show rate, monthly software cost
- Outputs: estimated monthly revenue, revenue lost to no-shows,
  potential savings with better software, ROI of switching
- Include email capture: "Get your personalized report"
- At the bottom, recommend top 3 tools based on their practice size
  (using data from tools.json), each with affiliate links
```

### Step 5: Apply for Affiliate Programs (Week 2)
Apply to these programs in priority order:
1. **Weave** — getweave.com/partners (highest monthly price = highest commissions)
2. **Digitail** — digitail.com (contact partnerships team)
3. **ezyVet** — Through IDEXX partnership
4. **Shepherd** — shepherd.vet (referral program)
5. **DaySmart Vet** — daysmart.com/vet (partner program)
6. **PetDesk** — petdesk.com (partnership program)
7. **Hippo Manager** — hippomanager.com (referral program)

### Step 6: Submit to Google (Week 2)
1. Register domain: vetsoftwarehub.com (or similar available domain)
2. Point DNS to Vercel
3. Submit sitemap to Google Search Console
4. Submit site to Bing Webmaster Tools
5. Create Google Business Profile for the site

### Step 7: Weekly Maintenance (ongoing, 2-3 hrs/week)
Open Claude Code and prompt:
```
Check tools.json for any pricing that needs updating.
Generate 3 new comparison pages targeting keywords we haven't covered yet.
Draft this week's email newsletter highlighting our latest review.
Create 5 social media snippets from our top-performing pages.
```

## Revenue Timeline

| Month | Activity | Expected Revenue |
|-------|----------|-----------------|
| 1-2 | Build site, 100+ pages live, apply to affiliates | $0 |
| 3-4 | Pages start ranking, first affiliate clicks | $100-$500 |
| 5-6 | 200+ pages indexed, traffic growing, first conversions | $500-$2,000 |
| 7-9 | Authority building, email list growing, consistent conversions | $2,000-$4,000 |
| 10-12 | 300+ pages, strong rankings, display ads added | $3,000-$6,000 |
| 13-18 | Full authority, compounding traffic, launch Site 2 | $5,000-$10,000+ |

## Important Reminders

- **Don't skip the affiliate disclosure.** FTC requires it. It also builds trust.
- **Don't fabricate reviews.** Only use real data from G2, Capterra, and vendor sites.
- **Update pricing quarterly.** Stale pricing destroys trust and rankings.
- **Respond to comments/emails.** Real engagement signals authority to Google.
- **Be patient months 1-3.** SEO compounds — the hockey stick comes later.
- **Track everything.** Set up Plausible from day one so you know what's working.
