// File: lib/types.ts
export interface College {
  id: number;
  name: string;
  slug: string;
  bannerImage: string | null;
  type: { code: string };
  ownershipType: { code: string };
  establishedYear: number;
  area: number | null;
  genderAccepted: string;
  address: string | null;
  city: { id: number; name: string; stateId: number };
  state: { id: number; name: string };
  pincode: string | null;
  country: string;
  website: string;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  phone: string[];
  email: string[];
  courses: {
    id: number;
    info: string | null;
    courseLookup: {
      id: number;
      code: string;
      courseCode: string;
      categoryCode: string;
      typeCode: string;
    };
  }[];
  logo: string | null;
  brochure: string | null;
  hostelBrochure: string | null;
  naacGrade: string | null;
  nirfRank: number | null;
  info: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Review {
  id: number;
  reviewer: string;
  avatar?: string;
  course: string;
  batch: string;
  date: string;
  rating: number;
  likes: string[];
  dislikes: string[];
  helpfulCount: number;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  category: string;
  type: string;
  durationYears: number;
  eligibility: string[];
  applicationStart?: string;
  applicationEnd?: string;
  totalFee?: number;
  minFee?: number;
  maxFee?: number;
  entranceExams?: string[];
  fees?: CourseFee[];
  info?: string;
  scholarships?: Scholarship[];
  placements?: PlacementStat[];
  programType?: string; // Added programType field to help with new categorization
}

export interface CourseFee {
  id: number;
  year: number;
  amount: number;
}

export interface Scholarship {
  id: number;
  name: string;
  description?: string;
  amount?: number;
  criteria?: string;
  lastDate?: string;
}

export interface PlacementStat {
  year: number;
  placedCount?: number;
  minPackage?: number;
  avgPackage?: number;
  highestPackage?: number;
  topRecruiters?: string[];
}

// New interface for Q&A functionality
export interface Question {
  id: number;
  question: string;
  askedBy: {
    name: string;
    avatar?: string;
    role?: string;
  };
  date: string;
  answers: Answer[];
  upvotes: number;
  downvotes: number;
  tags?: string[];
  status: 'open' | 'answered' | 'closed';
  views: number;
}

export interface Answer {
  id: number;
  text: string;
  answeredBy: {
    name: string;
    avatar?: string;
    role?: string;
  };
  date: string;
  upvotes: number;
  downvotes: number;
  isVerified?: boolean;
  isAccepted?: boolean;
}
