export interface GrantData {
  title: string;
  description: string;
  organization: string;
  category: string[];
  amount?: string;
  deadline?: Date;
  url: string;
  requirements?: string;
  eligibility?: string;
  source: string;
  location?: string; // "Africa", "Kenya", "Global", etc.
  tags?: string[];
}

export type ScraperFunction = () => Promise<GrantData[]>;
