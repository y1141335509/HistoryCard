'use client';

import { useState } from 'react';
import { HeaderProps } from '@/types';
import {
  UserIcon,
  HomeIcon,
  AcademicCapIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function Header({
  currentView,
  setCurrentView,
  user,
  onAuthClick,
  onLogout
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isLoggedIn = user && user.username && user.username !== 'Guest';

  const navigation = [
    { name: '首页', id: 'home', icon: HomeIcon },
    { name: '测验模式', id: 'quiz', icon: AcademicCapIcon },
    { name: '个人资料', id: 'profile', icon: UserCircleIcon },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏛️</span>
            </div>
            <span className="text-xl font-bold text-gradient">历史卡片</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Streak Display */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-orange-500">🔥</span>
                  <span>连续学习 {user.streak || 0} 天</span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">
                          已学习 {user.learnedCards || 0} 张卡片
                        </p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setCurrentView('profile');
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3" />
                          查看资料
                        </button>

                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <span className="w-4 h-4 mr-3">🚪</span>
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}