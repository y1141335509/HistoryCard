export interface HistoryCard {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  historicalPeriod?: string;
  keyFigures?: string[];
  relatedEvents?: string[];
  options: string[];
  topic: string;
  createdAt: string;
}

export interface User {
  username: string;
  email?: string;
  learnedCards: number;
  streak: number;
  favorites: string[];
  completedCards?: string[];
  totalStudyTime?: number;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

export interface KnowledgeCardProps {
  card: HistoryCard;
  isFavorite: boolean;
  onComplete: (cardId: string) => void;
  onFavorite: (cardId: string) => void;
}

export interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User;
  onAuthClick: () => void;
  onLogout: () => void;
}

export type ViewType = 'home' | 'quiz' | 'profile' | 'timeline' | 'vault';

// Timeline related types
export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  year: number;
  description: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  location?: string;
  figures?: string[];
  relatedCards?: string[];
  imageUrl?: string;
}

export interface TimelinePeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
  events: TimelineEvent[];
}

export interface TimelineProps {
  events: TimelineEvent[];
  periods?: TimelinePeriod[];
  onEventClick?: (event: TimelineEvent) => void;
  onPeriodClick?: (period: TimelinePeriod) => void;
}