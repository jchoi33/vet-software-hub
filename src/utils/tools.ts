import toolsData from '../../data/tools.json';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  website: string;
  founded: number;
  hq: string;
  deployment: string;
  starting_price_monthly: number | null;
  pricing_model: string;
  free_trial: boolean;
  free_plan: boolean;
  best_for: string[];
  practice_types: string[];
  key_features: string[];
  integrations: string[];
  pros: string[];
  cons: string[];
  rating_g2: number | null;
  rating_capterra: number | null;
  review_count_approx: number;
  affiliate_program: boolean;
  affiliate_notes: string;
  users_approx: string;
}

// Filter out any invalid/placeholder entries
export function getAllTools(): Tool[] {
  return toolsData.tools.filter((t: any) => t.slug && t.slug !== null) as Tool[];
}

export function getToolBySlug(slug: string): Tool | undefined {
  return getAllTools().find(t => t.slug === slug);
}

export function getToolById(id: string): Tool | undefined {
  return getAllTools().find(t => t.id === id);
}

// Generate all unique comparison pairs
export function getAllComparisonPairs(): [Tool, Tool][] {
  const tools = getAllTools();
  const pairs: [Tool, Tool][] = [];
  
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      pairs.push([tools[i], tools[j]]);
    }
  }
  
  return pairs;
}

// Get comparison slug (alphabetical order for consistency)
export function getComparisonSlug(toolA: Tool, toolB: Tool): string {
  const sorted = [toolA.slug, toolB.slug].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}

// Get tools sorted by a metric
export function getToolsSortedByRating(): Tool[] {
  return getAllTools().sort((a, b) => {
    const ratingA = a.rating_capterra || a.rating_g2 || 0;
    const ratingB = b.rating_capterra || b.rating_g2 || 0;
    return ratingB - ratingA;
  });
}

export function getToolsSortedByPrice(): Tool[] {
  return getAllTools()
    .filter(t => t.starting_price_monthly !== null)
    .sort((a, b) => (a.starting_price_monthly || 0) - (b.starting_price_monthly || 0));
}

export function getToolsWithAffiliate(): Tool[] {
  return getAllTools().filter(t => t.affiliate_program);
}

export function getCloudTools(): Tool[] {
  return getAllTools().filter(t => t.deployment === 'Cloud-based');
}

export function getToolsForPracticeType(type: string): Tool[] {
  return getAllTools().filter(t => 
    t.practice_types.some(pt => pt.toLowerCase().includes(type.toLowerCase()))
  );
}

// Generate affiliate link with UTM tracking
export function getAffiliateLink(tool: Tool, page: string, position: string): string {
  const baseUrl = tool.website;
  const utmParams = new URLSearchParams({
    utm_source: 'vetsoftwarehub',
    utm_medium: 'affiliate',
    utm_campaign: page,
    utm_content: position,
  });
  return `${baseUrl}?${utmParams.toString()}`;
}

// Get the average rating across platforms
export function getAverageRating(tool: Tool): number | null {
  const ratings = [tool.rating_g2, tool.rating_capterra].filter(r => r !== null) as number[];
  if (ratings.length === 0) return null;
  return parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1));
}

// Get pricing display string
export function getPricingDisplay(tool: Tool): string {
  if (tool.free_plan) return 'Free plan available';
  if (tool.starting_price_monthly === null) return 'Custom pricing';
  return `From $${tool.starting_price_monthly}/mo`;
}

export const siteConfig = toolsData.meta;
