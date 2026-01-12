
export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER = 'EMPLOYER'
}

export enum JobType {
  PEACE_JOB = 'PEACE_JOB',
  FREELANCE = 'FREELANCE',
  PART_TIME = 'PART_TIME',
  FULL_TIME = 'FULL_TIME'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS'
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: UserRole;
  lastMessage: string;
  messages: Message[];
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Job {
  id: string;
  title: string;
  employer: string;
  type: JobType;
  location: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  postedAt: string;
  skills: string[];
  verified: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment_sent' | 'payment_received';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  skills: string[];
  bio: string;
  location: string;
  certifications: string[];
  completedGigs: number;
  rating: number;
  walletBalance: number;
  badges: string[];
  hourlyRate?: number;
  subscriptionTier: SubscriptionTier;
  favorites: string[]; 
  reviews: Review[];
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  category: 'Advice' | 'Success Story' | 'Mental Health' | 'Finance';
  isLiked?: boolean;
}

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  type: 'expense' | 'saving';
}

export interface HireOffer {
  id: string;
  talentId: string;
  talentName: string;
  jobTitle: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
}
