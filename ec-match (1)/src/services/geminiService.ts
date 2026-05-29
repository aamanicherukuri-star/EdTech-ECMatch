import { UserProfile, Opportunity } from "../types";

/**
 * Curates extracurricular opportunities.
 * Replaced with a reliable local generator to bypass API key requirements for under-18 developers.
 */
export async function curateOpportunities(profile: Partial<UserProfile>, customQuery?: string): Promise<Opportunity[]> {
  // Simulate a realistic network delay so your UI loading spinners still work perfectly
  await new Promise(resolve => setTimeout(resolve, 800));

  // A robust pool of mock opportunities that match your required JSON structural properties
  const mockDatabase: Opportunity[] = [
    {
      id: "opp-mock-1",
      title: "Stanford Institutes of Medicine Summer Research Program (SIMR)",
      rationale: "This premier research program offers unmatched hands-on laboratory experience. It directly establishes your scientific competency, pairing perfectly with an ambitious STEM profile targeting Top-20 institutions.",
      isVerified: true,
      format: "In-person",
      cost: "Free (Stipend Provided)",
      effortLevel: "High",
      deadline: "February 20, 2027",
      materials: ["Essay", "Transcript", "2 Recommendation Letters"],
      url: "https://simr.stanford.edu",
      description: "A hands-on research initiative granting high school students the unique chance to collaborate one-on-one with Stanford faculty, researchers, and post-doctoral scholars on impactful medical research ventures.",
      subject: "STEM",
      topic: "Medicine & Biology",
      type: "Summer Program",
      ageGroup: "16-18",
      prestigeRating: 5
    },
    {
      id: "opp-mock-2",
      title: "Congressional App Challenge",
      rationale: "Winning or participating heavily in a federally recognized initiative demonstrates deep community engagement and tangible technical skills. This acts as a superb focal point for a Computer Science-centric admissions narrative.",
      isVerified: true,
      format: "Online",
      cost: "Free",
      effortLevel: "Medium",
      deadline: "October 24, 2026",
      materials: ["App Source Code", "Video Demonstration"],
      url: "https://www.congressionalappchallenge.us",
      description: "An official nation-wide initiative hosted by members of the U.S. House of Representatives encouraging high school students to learn coding by developing and submitting original applications.",
      subject: "STEM",
      topic: "AI & Computer Science",
      type: "Competition",
      ageGroup: "13-18",
      prestigeRating: 4
    },
    {
      id: "opp-mock-3",
      title: "The New York Times Summer Journalism Institute",
      rationale: "Exceptional writing and investigative logic are highly sought-after traits in humanities admissions. This prestigious program validates your narrative abilities on a globally respected platform.",
      isVerified: true,
      format: "Hybrid",
      cost: "Scholarship Available",
      effortLevel: "High",
      deadline: "March 15, 2027",
      materials: ["Writing Portfolio", "Personal Statement"],
      url: "https://www.nytimes.com",
      description: "An intensive training program where exceptional students learn directly from New York Times reporters and editors, developing advanced reporting, analytical writing, and multimedia skills.",
      subject: "Social Sciences",
      topic: "Journalism & Policy",
      type: "Internship",
      ageGroup: "15-18",
      prestigeRating: 5
    },
    {
      id: "opp-mock-4",
      title: "MIT THINK Scholars Program",
      rationale: "Unlike standard science fairs, THINK rewards early-stage technical proposals with direct mentoring and funding. This completely solidifies an applicant's potential for high-impact innovation.",
      isVerified: false,
      format: "Online",
      cost: "Free",
      effortLevel: "High",
      deadline: "January 1, 2027",
      materials: ["Project Proposal", "Technical Abstract"],
      url: "https://think.mit.edu",
      description: "An educational initiative run by MIT undergraduates that challenges high school students to submit design proposals for innovative engineering or scientific research projects.",
      subject: "STEM",
      topic: "Engineering",
      type: "Competition",
      ageGroup: "14-18",
      prestigeRating: 5
    }
  ];

  // If a custom search query was typed into your UI filters, filter our local database to match it
  // If a custom search query was typed into your UI filters
 // If a custom search query was typed into your UI filters
if (customQuery) {
  // Break the search query down into individual words (and remove common words like "find", "me", "show")
  const searchWords = customQuery
    .toLowerCase()
    .split(/\s+/)
    .filter(word => !['find', 'me', 'show', 'opportunities', 'opportunity', 'a', 'the', 'for', 'any', 'i', 'want'].includes(word));

  // If they only typed filler words, just return the whole database
  if (searchWords.length === 0) {
    return mockDatabase;
  }

  // Filter the database: An item matches if ANY of the search words are found in its title, topic, or subject
  const filteredResults = mockDatabase.filter(opp => {
    const title = opp.title.toLowerCase();
    const topic = opp.topic.toLowerCase();
    const subject = opp.subject.toLowerCase();

    return searchWords.some(word => 
      title.includes(word) || 
      topic.includes(word) || 
      subject.includes(word)
    );
  });

  // Fallback: If absolutely nothing matches their specific keywords, return everything so the UI doesn't break
  if (filteredResults.length === 0) {
    return mockDatabase;
  }

  return filteredResults;
}

  return mockDatabase;
}
