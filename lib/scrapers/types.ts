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
  tags?: string[];
}

export type ScraperFunction = () => Promise<GrantData[]>;
