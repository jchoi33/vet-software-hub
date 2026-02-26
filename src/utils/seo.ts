import type { Tool } from './tools';

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  schema: object;
}

const SITE_NAME = 'VetSoftwareHub';
const SITE_URL = 'https://vetsoftwarehub.com';
const CURRENT_YEAR = new Date().getFullYear();

export function getReviewMeta(tool: Tool): SEOMeta {
  return {
    title: `${tool.name} Review ${CURRENT_YEAR}: Pricing, Features, Pros & Cons | ${SITE_NAME}`,
    description: `Honest ${tool.name} review for ${CURRENT_YEAR}. ${tool.tagline}. Starting at ${tool.starting_price_monthly ? `$${tool.starting_price_monthly}/mo` : 'custom pricing'}. See features, pricing, pros, cons, and who it's best for.`,
    canonical: `${SITE_URL}/reviews/${tool.slug}`,
    ogTitle: `${tool.name} Review ${CURRENT_YEAR} — Is It Right for Your Vet Practice?`,
    ogDescription: `Independent review of ${tool.name}. ${tool.pros[0]}. ${tool.cons[0]}. Full pricing and feature breakdown.`,
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: tool.deployment,
      description: tool.tagline,
      url: tool.website,
      aggregateRating: tool.rating_capterra ? {
        '@type': 'AggregateRating',
        ratingValue: tool.rating_capterra,
        bestRating: 5,
        ratingCount: tool.review_count_approx,
      } : undefined,
      offers: tool.starting_price_monthly ? {
        '@type': 'Offer',
        price: tool.starting_price_monthly,
        priceCurrency: 'USD',
        priceValidUntil: `${CURRENT_YEAR}-12-31`,
      } : undefined,
    },
  };
}

export function getComparisonMeta(toolA: Tool, toolB: Tool): SEOMeta {
  return {
    title: `${toolA.name} vs ${toolB.name} ${CURRENT_YEAR}: Which Vet Software Is Better? | ${SITE_NAME}`,
    description: `${toolA.name} vs ${toolB.name} comparison for ${CURRENT_YEAR}. Compare pricing, features, ratings, and find which veterinary software is right for your practice.`,
    canonical: `${SITE_URL}/compare/${[toolA.slug, toolB.slug].sort().join('-vs-')}`,
    ogTitle: `${toolA.name} vs ${toolB.name} — ${CURRENT_YEAR} Veterinary Software Comparison`,
    ogDescription: `Side-by-side comparison of ${toolA.name} and ${toolB.name}. Pricing, features, user ratings, and our recommendation.`,
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${toolA.name} vs ${toolB.name}: ${CURRENT_YEAR} Comparison`,
      description: `Detailed comparison of ${toolA.name} and ${toolB.name} for veterinary practices.`,
      author: { '@type': 'Organization', name: SITE_NAME },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  };
}

export function getBestForMeta(useCase: string, displayName: string): SEOMeta {
  return {
    title: `Best Veterinary Software for ${displayName} ${CURRENT_YEAR} | ${SITE_NAME}`,
    description: `Top veterinary practice management software for ${displayName.toLowerCase()} in ${CURRENT_YEAR}. Independent rankings based on features, pricing, and real user reviews.`,
    canonical: `${SITE_URL}/best/${useCase}`,
    ogTitle: `Best Vet Software for ${displayName} — ${CURRENT_YEAR} Rankings`,
    ogDescription: `We compared 20+ veterinary PIMS to find the best options for ${displayName.toLowerCase()}. See our top picks.`,
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Best Veterinary Software for ${displayName} ${CURRENT_YEAR}`,
      author: { '@type': 'Organization', name: SITE_NAME },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  };
}

export function getAlternativesMeta(tool: Tool): SEOMeta {
  return {
    title: `${tool.name} Alternatives ${CURRENT_YEAR}: Top Competitors Compared | ${SITE_NAME}`,
    description: `Looking for ${tool.name} alternatives? We compared the best veterinary software options in ${CURRENT_YEAR}. See pricing, features, and honest recommendations.`,
    canonical: `${SITE_URL}/alternatives/${tool.slug}`,
    ogTitle: `Best ${tool.name} Alternatives for ${CURRENT_YEAR}`,
    ogDescription: `${tool.name} not the right fit? Here are the top alternatives for veterinary practices.`,
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${tool.name} Alternatives ${CURRENT_YEAR}`,
      author: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}

export function getPricingMeta(tool: Tool): SEOMeta {
  return {
    title: `${tool.name} Pricing ${CURRENT_YEAR}: Plans, Costs & Value Breakdown | ${SITE_NAME}`,
    description: `Complete ${tool.name} pricing guide for ${CURRENT_YEAR}. ${tool.starting_price_monthly ? `Starting at $${tool.starting_price_monthly}/mo.` : 'Custom pricing.'} See all plans, what's included, and whether it's worth it for your practice.`,
    canonical: `${SITE_URL}/pricing/${tool.slug}`,
    ogTitle: `${tool.name} Pricing ${CURRENT_YEAR} — Full Breakdown`,
    ogDescription: `How much does ${tool.name} actually cost? Complete pricing analysis for veterinary practices.`,
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${tool.name} Pricing ${CURRENT_YEAR}`,
      author: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}
