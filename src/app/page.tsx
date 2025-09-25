'use client';

import { useState, useEffect } from 'react';
import { HistoryCard, User } from '@/types';
import { generateKnowledgeCards } from '@/lib/claude-api';
import {
  getCurrentUser,
  isUserLoggedIn,
  loginUser,
  registerUser,
  logoutUser,
  markCardAsLearned,
  toggleFavoriteCard
} from '@/lib/user-manager';

import Header from '@/components/Header';
import Timeline from '@/components/Timeline';
import { sampleTimelineEvents, sampleTimelinePeriods, generateTimelineFromCards } from '@/lib/timeline-data';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [cards, setCards] = useState<HistoryCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User>(() => {
    // 初始化用户状态
    return getCurrentUser() || {
      username: 'Guest',
      learnedCards: 0,
      streak: 0,
      favorites: []
    };
  });

  useEffect(() => {
    loadInitialCards();
  }, []);

  const loadInitialCards = async () => {
    setLoading(true);
    try {
      const initialCards = await generateKnowledgeCards('古罗马帝国');
      setCards(initialCards);
    } catch (error) {
      console.error('加载初始卡片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const newCards = await generateKnowledgeCards(query);
      setCards(newCards);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 用户认证处理
  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await loginUser(username, password);
      setUser(loggedInUser);
      setShowAuthModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const newUser = await registerUser(username, email, password);
      setUser(newUser);
      setShowAuthModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser({
      username: 'Guest',
      learnedCards: 0,
      streak: 0,
      favorites: []
    });
    setCurrentView('home');
  };

  const handleCardComplete = (cardId: string) => {
    if (isUserLoggedIn()) {
      markCardAsLearned(cardId);
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } else {
      setUser(prev => ({
        ...prev,
        learnedCards: prev.learnedCards + 1
      }));
    }
  };

  const handleFavorite = (cardId: string) => {
    if (isUserLoggedIn()) {
      toggleFavoriteCard(cardId);
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } else {
      setUser(prev => ({
        ...prev,
        favorites: prev.favorites.includes(cardId)
          ? prev.favorites.filter(id => id !== cardId)
          : [...prev.favorites, cardId]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gradient mb-4">
                通过互动卡片探索历史
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                通过AI生成的互动学习卡片探索历史事件、文明和传奇人物。从古代帝国到现代革命。
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Daily Digest */}
            <DailyDigest cards={cards.slice(0, 3)} />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                cards.map(card => (
                  <KnowledgeCard
                    key={card.id}
                    card={card}
                    isFavorite={user.favorites.includes(card.id)}
                    onComplete={() => handleCardComplete(card.id)}
                    onFavorite={() => handleFavorite(card.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {currentView === 'timeline' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">历史时间线</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                探索人类历史上的重要事件，从古代文明到现代社会，通过交互式时间线了解历史的发展脉络。
              </p>
            </div>

            <Timeline
              events={[
                ...sampleTimelineEvents,
                ...generateTimelineFromCards(cards)
              ]}
              periods={sampleTimelinePeriods}
              onEventClick={(event) => {
                console.log('点击事件:', event);
              }}
              onPeriodClick={(period) => {
                console.log('点击时期:', period);
              }}
            />
          </div>
        )}

        {currentView === 'quiz' && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">测验模式</h2>
            <p className="text-gray-600">敬请期待！测验功能正在开发中。</p>
          </div>
        )}

        {currentView === 'profile' && (
          <UserProfile
            user={user}
            favoriteCards={cards.filter(card => user.favorites.includes(card.id))}
          />
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}

// 临时组件，之后会创建单独的文件
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索历史主题..."
        className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
      >
        🔍
      </button>
    </form>
  );
}

function DailyDigest({ cards }: { cards: HistoryCard[] }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">📚 今日精选</h2>
      <p className="text-blue-100 mb-6">为您精心挑选的历史知识卡片</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-white/10 backdrop-blur rounded-lg p-4">
            <span className="text-blue-200 text-sm">{card.category}</span>
            <h3 className="font-semibold mt-2 line-clamp-2">{card.question}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeCard({ card, isFavorite, onComplete, onFavorite }: {
  card: HistoryCard;
  isFavorite: boolean;
  onComplete: () => void;
  onFavorite: () => void;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {card.category}
          </span>
          {card.historicalPeriod && card.historicalPeriod !== '未知' && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {card.historicalPeriod}
            </span>
          )}
        </div>
        <button
          onClick={onFavorite}
          className={`transition-colors ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {card.question}
      </h3>

      {!showAnswer ? (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            想想看，然后揭晓答案！
          </p>
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            👁️ 查看答案
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-900">{card.answer}</p>
          </div>

          {card.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                ℹ️ 你知道吗？
              </h4>
              <p className="text-sm text-gray-900">{card.explanation}</p>
            </div>
          )}

          {(card.keyFigures?.length || card.relatedEvents?.length) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">
                👥 历史背景
              </h4>

              {card.keyFigures?.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-700">关键人物：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.keyFigures.slice(0, 3).map((figure, index) => (
                      <span key={index} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.relatedEvents?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-amber-700">相关事件：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.relatedEvents.slice(0, 2).map((event, index) => (
                      <span key={index} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!completed && (
            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✅ 标记为已学
            </button>
          )}

          {completed && (
            <div className="flex items-center justify-center text-green-600 font-medium">
              ✅ 已完成！
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          难度：{card.difficulty}
        </span>
        <span className="text-xs text-gray-500">
          {card.estimatedTime}
        </span>
      </div>
    </div>
  );
}

function UserProfile({ user, favoriteCards }: {
  user: User;
  favoriteCards: HistoryCard[];
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{user.learnedCards}</div>
            <div className="text-sm text-gray-500">已学习卡片</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{user.streak}</div>
            <div className="text-sm text-gray-500">连续学习天数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{user.favorites.length}</div>
            <div className="text-sm text-gray-500">收藏卡片</div>
          </div>
        </div>
      </div>

      {favoriteCards.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">收藏的卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteCards.map(card => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {card.category}
                </span>
                <h3 className="font-semibold mt-2">{card.question}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AuthModal({ isOpen, onClose, onLogin, onRegister }: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        await onLogin(formData.username, formData.password);
      } else {
        await onRegister(formData.username, formData.email, formData.password);
      }
      onClose();
    } catch (error: any) {
      alert(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? '欢迎回来' : '加入历史卡片'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {loading ? '请稍候...' : (isLoginMode ? '登录' : '创建账户')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLoginMode ? "还没有账户？" : "已有账户？"}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormData({ username: '', email: '', password: '' });
              }}
              className="ml-1 text-blue-600 hover:underline font-medium"
            >
              {isLoginMode ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        {isLoginMode && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>演示账户：</strong> 使用任意用户名/密码来试用应用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}