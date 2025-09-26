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

export type ViewType = 'home' | 'quiz' | 'profile' | 'timeline' | 'vault' | 'figures';

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
  sources?: string[]; // 文献引用
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

// Historical Figures related types
export interface Achievement {
  id: string;
  age: number;
  year: number;
  title: string;
  description: string;
  category: 'education' | 'career' | 'achievement' | 'personal' | 'discovery' | 'creation' | 'leadership' | 'other';
  importance: 'low' | 'medium' | 'high';
  location?: string;
  relatedFigures?: string[]; // 相关人物
  sources?: string[];
}

export interface HistoricalFigure {
  id: string;
  name: string;
  chineseName?: string;
  birthYear: number;
  deathYear?: number; // undefined表示仍在世
  birthDate?: string; // 更精确的出生日期
  deathDate?: string; // 更精确的死亡日期
  nationality: string;
  occupation: string[];
  category: 'politician' | 'scientist' | 'artist' | 'writer' | 'philosopher' | 'military' | 'inventor' | 'explorer' | 'religious' | 'other';
  era: string; // 时代：如"古代希腊"、"文艺复兴"、"现代"等
  biography: string; // 简短传记
  knownFor: string[]; // 主要成就
  achievements: Achievement[]; // 详细成就时间轴
  portrait?: string; // 肖像图片URL
  quotes?: string[]; // 名言
  relatedEvents?: string[]; // 相关历史事件ID
  influence: number; // 影响力评分 1-10
  tags: string[]; // 标签：如"哲学家"、"数学家"等
}

export interface FigureTimelineProps {
  figure: HistoricalFigure;
  userAge?: number; // 用户当前年龄，用于对比
  onAchievementClick?: (achievement: Achievement) => void;
}