
export interface AcademicBaseline {
  gpa?: string;
  gradingScale?: string;
  rigorousCourses?: string[];
  subjectInterests?: string[];
}

export interface ActivePortfolio {
  pastECs?: string[];
  competitions?: string[];
  experiences?: string[];
  careerGoals?: string;
}

export interface HolisticIdentity {
  background?: string;
  intellectualDiet?: {
    books?: string[];
    movies?: string[];
    podcasts?: string[];
  };
  personalOutlets?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  age?: string;
  gender?: string;
  academicBaseline?: AcademicBaseline;
  activePortfolio?: ActivePortfolio;
  holisticIdentity?: HolisticIdentity;
  onboardingCompleted: boolean;
  createdAt: string;
  themeColor?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  rationale: string;
  isVerified: boolean;
  format: 'Online' | 'In-person' | 'Hybrid';
  cost: string;
  effortLevel: 'Low' | 'Medium' | 'High';
  deadline: string;
  materials: string[];
  url: string;
  description?: string;
  prestigeRating: number; // 1-5
  subject: string;
  topic: string;
  type: string; // Competition, Workshop, Project based, etc.
  ageGroup: string;
  location?: string;
}

export type PipelineStatus = 'Saved' | 'In Progress' | 'Applied' | 'Completed';
export type UserRanking = 'Best' | 'Medium' | 'Low';

export interface UserOpportunity extends Opportunity {
  status: PipelineStatus;
  ranking: UserRanking;
  savedAt: string;
  hoursLogged: number;
  impactSummary: string;
}
