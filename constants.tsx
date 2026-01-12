
import React from 'react';
import { Job, JobType, ForumPost, UserProfile, UserRole, SubscriptionTier } from './types';
import { Briefcase, Sparkles, Heart, Calculator, Users, Search, LayoutDashboard, MessageCircle, CreditCard, BookUser } from 'lucide-react';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Assistant Gardener',
    employer: 'Green Spaces Ltd',
    type: JobType.PEACE_JOB,
    location: 'Soweto, Johannesburg',
    description: 'Looking for an enthusiastic assistant for residential garden maintenance.',
    requirements: ['Punctual', 'Basic knowledge of plants', 'Hardworking'],
    salaryRange: 'R150 - R200 per day',
    postedAt: '2 hours ago',
    skills: ['Landscaping', 'Manual Labor'],
    verified: true,
    coordinates: { lat: -26.2309, lng: 27.8584 }
  },
  {
    id: '2',
    title: 'Junior Web Developer',
    employer: 'TechSpark ZA',
    type: JobType.FULL_TIME,
    location: 'Sandton, Johannesburg',
    description: 'Entry-level React position for a motivated self-learner.',
    requirements: ['React basics', 'HTML/CSS', 'Problem solving'],
    salaryRange: 'R15,000 - R20,000 pm',
    postedAt: '1 day ago',
    skills: ['React', 'JavaScript', 'Tailwind'],
    verified: true,
    coordinates: { lat: -26.1076, lng: 28.0567 }
  }
];

export const MOCK_TALENT: UserProfile[] = [
  {
    id: 't1',
    name: 'Thabo Molefe',
    role: UserRole.JOB_SEEKER,
    skills: ['Gardening', 'Painting', 'Handyman'],
    bio: 'General laborer with 5 years of experience in township maintenance.',
    location: 'Soweto',
    certifications: [],
    completedGigs: 45,
    rating: 4.9,
    walletBalance: 0,
    badges: ['Top Rated', 'Verified'],
    hourlyRate: 85,
    subscriptionTier: SubscriptionTier.FREE,
    favorites: [],
    reviews: [
      { id: 'r1', reviewerId: 'e1', reviewerName: 'Musa N.', rating: 5, comment: 'Punctual and very efficient gardener.', date: '12 May' }
    ]
  },
  {
    id: 't2',
    name: 'Lerato Kunene',
    role: UserRole.JOB_SEEKER,
    skills: ['Social Media', 'Content Creation'],
    bio: 'Digital native helping small businesses grow their online presence.',
    location: 'Johannesburg CBD',
    certifications: ['Google Digital Garage'],
    completedGigs: 12,
    rating: 4.7,
    walletBalance: 0,
    badges: ['Skills Pro'],
    hourlyRate: 150,
    subscriptionTier: SubscriptionTier.FREE,
    favorites: [],
    reviews: []
  },
  {
    id: 't3',
    name: 'Mandla Zulu',
    role: UserRole.JOB_SEEKER,
    skills: ['Carpentry', 'Plumbing'],
    bio: 'Experienced craftsman specialized in home repairs and bespoke furniture.',
    location: 'Pretoria East',
    certifications: ['Red Seal Carpentry'],
    completedGigs: 89,
    rating: 5.0,
    walletBalance: 0,
    badges: ['Expert'],
    hourlyRate: 220,
    subscriptionTier: SubscriptionTier.FREE,
    favorites: [],
    reviews: []
  }
];

export const MOCK_USER: UserProfile = {
  id: 'user_1',
  name: 'Zanele Dlamini',
  role: UserRole.JOB_SEEKER,
  skills: ['Marketing', 'Communication', 'Customer Service'],
  bio: 'Passionate marketer looking to transition into digital advertising.',
  location: 'Johannesburg',
  certifications: ['Diploma in Marketing (UJ)'],
  completedGigs: 12,
  rating: 4.8,
  walletBalance: 1250.00,
  badges: ['Early Adopter', 'Top Rated'],
  subscriptionTier: SubscriptionTier.FREE,
  favorites: [],
  reviews: []
};

export const getNavItems = (role: UserRole) => {
  const common = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: 'dashboard' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'Messages', path: 'messages' },
    { icon: <BookUser className="w-5 h-5" />, label: 'Contacts', path: 'contacts' },
  ];

  if (role === UserRole.JOB_SEEKER) {
    return [
      ...common,
      { icon: <Search className="w-5 h-5" />, label: 'Find Jobs', path: 'jobs' },
      { icon: <Briefcase className="w-5 h-5" />, label: 'Applications', path: 'applications' },
      { icon: <Calculator className="w-5 h-5" />, label: 'Budgeter', path: 'budget' },
      { icon: <Sparkles className="w-5 h-5" />, label: 'Learning', path: 'learning' },
      { icon: <Heart className="w-5 h-5" />, label: 'Community', path: 'community' },
    ];
  } else {
    return [
      ...common,
      { icon: <Users className="w-5 h-5" />, label: 'Find Talent', path: 'talent' },
      { icon: <CreditCard className="w-5 h-5" />, label: 'Subscription', path: 'subscription' },
      { icon: <Briefcase className="w-5 h-5" />, label: 'My Job Posts', path: 'my-jobs' },
      { icon: <Heart className="w-5 h-5" />, label: 'Community', path: 'community' },
    ];
  }
};

export const BUDGET_CATEGORIES = [
  'Transport (Taxis/Bus)',
  'Data & Airtime',
  'Food & Groceries',
  'Rent/Housing',
  'Savings',
  'Other'
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zu', label: 'isiZulu' },
];
