/**
 * Test data generator for December 2025 grants
 * This ensures the system works even when scrapers return empty results
 */

import type { GrantData } from "./types";

/**
 * Generate test grants for December 2025
 * These are sample grants to verify the system is working
 */
export function generateTestGrants(): GrantData[] {
  const now = new Date();
  const december2025 = new Date(2025, 11, 31); // December 31, 2025
  
  return [
    {
      title: "AWS Cloud Credits for Research - December 2025",
      description: "Amazon Web Services provides cloud credits for research projects. Apply for up to $10,000 in AWS credits for your research project.",
      organization: "Amazon Web Services",
      category: ["Cloud Compute"],
      amount: "$10,000 in credits",
      deadline: december2025,
      url: "https://aws.amazon.com/grants/",
      source: "AWS Cloud Credits",
      location: "Global",
      tags: ["AWS", "Cloud", "Research"],
    },
    {
      title: "Google Cloud Research Credits - December 2025",
      description: "Google Cloud offers research credits for academic and research institutions working on innovative projects.",
      organization: "Google",
      category: ["Cloud Compute"],
      amount: "Up to $5,000",
      deadline: december2025,
      url: "https://cloud.google.com/edu/researchers",
      source: "Google Cloud Research Credits",
      location: "Global",
      tags: ["Google Cloud", "Research"],
    },
    {
      title: "i3 Innovations Africa - Health Tech Grants",
      description: "Supporting African-led health tech companies building data-driven access to healthcare. Focus on improving patient access to quality, affordable healthcare.",
      organization: "i3 Innovations Africa",
      category: ["Technology", "Health AI"],
      deadline: new Date(2025, 1, 28), // February 28, 2025
      url: "https://innovationsinafrica.com/application/",
      source: "i3 Innovations Africa",
      location: "Africa",
      eligibility: "African-led and African-owned businesses focused on serving African markets. Must be tech-enabled, data-driven, and growth-stage.",
      tags: ["Health Tech", "Africa", "Innovation"],
    },
    {
      title: "IEEE Computer Society Emerging Technology Fund",
      description: "Grants ranging from $5,000 to $50,000 for innovative projects focused on emerging technologies.",
      organization: "IEEE Computer Society",
      category: ["Technology"],
      amount: "$5,000 - $50,000",
      url: "https://www.computer.org/communities/emerging-technology-fund",
      source: "IEEE Computer Society",
      location: "Global",
      eligibility: "Open to all countries. At least one team member must be an IEEE or IEEE CS member.",
      tags: ["IEEE", "Emerging Technology"],
    },
    {
      title: "NRF Kenya Research Grants - December 2025",
      description: "National Research Fund Kenya offers grants for technology and innovation research projects in Kenya.",
      organization: "National Research Fund Kenya",
      category: ["Technology"],
      deadline: december2025,
      url: "https://www.nrf.go.ke/category/grants-and-calls/",
      source: "NRF Kenya",
      location: "Kenya",
      tags: ["Kenya", "Research", "NRF"],
    },
    {
      title: "ICTWorks Technology Funding - Africa",
      description: "Funding opportunities for ICT and technology projects in Africa, with focus on Kenya and East Africa.",
      organization: "ICTWorks",
      category: ["Technology"],
      deadline: december2025,
      url: "https://www.ictworks.org/category/funding/",
      source: "ICTWorks",
      location: "Africa",
      tags: ["ICT", "Technology", "Africa"],
    },
  ];
}
