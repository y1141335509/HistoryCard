'use client';

import { useState, useEffect } from 'react';
import { HistoryCard, User, HistoricalFigure } from '@/types';
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
import VisTimeline from '@/components/VisTimeline';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';
import FiguresList from '@/components/FiguresList';
import FigureTimeline from '@/components/FigureTimeline';
import { sampleTimelineEvents, sampleTimelinePeriods } from '@/lib/timeline-data';
import { historicalFigures } from '@/lib/historical-figures';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [cards, setCards] = useState<HistoryCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);
  const [userAge, setUserAge] = useState<number>(25); // 默认用户年龄，可以从用户资料获取
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

  // 历史人物相关处理函数
  const handleFigureSelect = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
  };

  const handleBackToFiguresList = () => {
    setSelectedFigure(null);
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

            <VisTimeline
              events={sampleTimelineEvents}
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

        {currentView === 'figures' && (
          <div className="space-y-8">
            {!selectedFigure ? (
              <FiguresList
                figures={historicalFigures}
                onFigureSelect={handleFigureSelect}
              />
            ) : (
              <div className="space-y-6">
                {/* 返回按钮 */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBackToFiguresList}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span>←</span>
                    <span>返回人物列表</span>
                  </button>

                  <div className="text-sm text-slate-600">
                    对比您的年龄：<span className="font-bold text-purple-600">{userAge} 岁</span>
                  </div>
                </div>

                {/* 人物时间轴 */}
                <FigureTimeline
                  figure={selectedFigure}
                  userAge={userAge}
                  onAchievementClick={(achievement) => {
                    console.log('点击成就:', achievement);
                  }}
                />
              </div>
            )}
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