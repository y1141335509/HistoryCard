'use client';

import { User, HistoryCard } from '@/types';
import {
  UserCircleIcon,
  FireIcon,
  BookOpenIcon,
  HeartIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  user: User;
  favoriteCards: HistoryCard[];
}

export default function UserProfile({ user, favoriteCards }: UserProfileProps) {
  const stats = [
    {
      label: '学习天数',
      value: user.streak || 0,
      icon: FireIcon,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      label: '已学习卡片',
      value: user.learnedCards || 0,
      icon: BookOpenIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: '收藏卡片',
      value: user.favorites?.length || 0,
      icon: HeartIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: '学习时长',
      value: `${Math.floor((user.totalStudyTime || 0) / 60)}分钟`,
      icon: ClockIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600">{user.email || '未设置邮箱'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-lg p-4 text-center`}>
                <div className={`${stat.color} flex justify-center mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>注册时间: {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>最后登录: {formatDate(user.lastLoginAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 收藏的卡片 */}
      {favoriteCards.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
            我的收藏 ({favoriteCards.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCards.map((card) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {card.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {card.difficulty}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {card.question}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {card.answer}
                </p>

                {card.historicalPeriod && card.historicalPeriod !== '未知' && (
                  <div className="mt-2 text-xs text-gray-500">
                    📅 {card.historicalPeriod}
                  </div>
                )}

                {card.keyFigures && card.keyFigures.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {card.keyFigures.slice(0, 2).map((figure, index) => (
                      <span key={index} className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        {figure}
                      </span>
                    ))}
                    {card.keyFigures.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{card.keyFigures.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {favoriteCards.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏的卡片</h3>
          <p className="text-gray-600">
            在学习过程中点击❤️按钮收藏喜欢的历史知识卡片吧！
          </p>
        </div>
      )}

      {/* 学习成就 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">学习成就</h2>

        <div className="space-y-3">
          {/* 连续学习成就 */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <FireIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">学习达人</div>
                <div className="text-sm text-gray-600">连续学习 {user.streak || 0} 天</div>
              </div>
            </div>
            <div className="text-orange-500 font-bold">
              {user.streak && user.streak >= 7 ? '🏆' : user.streak && user.streak >= 3 ? '🥉' : '💪'}
            </div>
          </div>

          {/* 卡片学习成就 */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">知识探索者</div>
                <div className="text-sm text-gray-600">已完成 {user.learnedCards || 0} 张卡片</div>
              </div>
            </div>
            <div className="text-blue-500 font-bold">
              {(user.learnedCards || 0) >= 50 ? '🏆' : (user.learnedCards || 0) >= 20 ? '🥈' : (user.learnedCards || 0) >= 10 ? '🥉' : '📚'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}