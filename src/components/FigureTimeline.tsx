'use client';

import { useState } from 'react';
import { HistoricalFigure, Achievement, FigureTimelineProps } from '@/types';

export default function FigureTimeline({ figure, userAge, onAchievementClick }: FigureTimelineProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [viewMode, setViewMode] = useState<'age' | 'year'>('age');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showOnlyMilestones, setShowOnlyMilestones] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null);

  // 计算人物寿命
  const lifespan = figure.deathYear ? figure.deathYear - figure.birthYear : new Date().getFullYear() - figure.birthYear;

  // 按年龄排序成就
  const sortedAchievements = [...figure.achievements].sort((a, b) => a.age - b.age);

  // 过滤成就
  const filteredAchievements = sortedAchievements.filter(achievement => {
    if (filterCategory !== 'all' && achievement.category !== filterCategory) return false;
    if (showOnlyMilestones && achievement.importance !== 'high') return false;
    return true;
  });

  // 获取所有成就类别
  const allCategories = Array.from(new Set(figure.achievements.map(a => a.category)));

  // 动画播放功能
  const startAnimation = () => {
    setPlayAnimation(true);
    setCurrentAnimationStep(0);

    const interval = setInterval(() => {
      setCurrentAnimationStep(prev => {
        if (prev >= filteredAchievements.length - 1) {
          clearInterval(interval);
          setTimeout(() => setPlayAnimation(false), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  // 获取成就重要性颜色
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // 获取成就类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education': return '🎓';
      case 'career': return '💼';
      case 'achievement': return '🏆';
      case 'personal': return '👤';
      case 'discovery': return '🔬';
      case 'creation': return '🎨';
      case 'leadership': return '👑';
      default: return '⭐';
    }
  };

  // 获取成就类别中文名
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      education: '教育',
      career: '职业',
      achievement: '成就',
      personal: '个人',
      discovery: '发现',
      creation: '创作',
      leadership: '领导',
      other: '其他'
    };
    return names[category] || category;
  };

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    onAchievementClick?.(achievement);
  };

  return (
    <div className="w-full space-y-8">
      {/* 人物信息卡片 */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* 人物基本信息 */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                {figure.chineseName || figure.name}
              </h1>
              {figure.chineseName && (
                <p className="text-slate-300 text-xl font-medium">{figure.name}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/20">
                  {formatYear(figure.birthYear)} - {figure.deathYear ? formatYear(figure.deathYear) : '现在'}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 rounded-full border border-green-400/20">
                  享年 {lifespan} 岁
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-400/20">
                  {figure.nationality}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 text-lg leading-relaxed">{figure.biography}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-3">👔 职业</h3>
                <div className="flex flex-wrap gap-2">
                  {figure.occupation.map((job, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                      {job}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-3">🏆 主要成就</h3>
                <div className="space-y-2">
                  {figure.knownFor.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="text-sm text-slate-400">
                      • {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 影响力评分和统计 */}
          <div className="lg:w-80">
            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30">
              <h3 className="text-lg font-bold text-amber-300 mb-4">📊 影响力评估</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-200">历史影响力</span>
                    <span className="text-amber-200 font-bold">{figure.influence}/10</span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${figure.influence * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/20">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-200">{figure.achievements.length}</div>
                      <div className="text-xs text-amber-300">记录成就</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-200">{lifespan}</div>
                      <div className="text-xs text-amber-300">活跃年数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 交互式控制面板 */}
      <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-purple-500/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              🎭 互动式人生时间轴
            </h2>
            <p className="text-slate-300 text-sm">
              探索 {figure.chineseName} 的人生轨迹 • 共 {filteredAchievements.length} 项成就
            </p>
          </div>

          {userAge && (
            <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 rounded-full border border-green-400/20 animate-pulse">
              🎯 您的年龄：{userAge} 岁
            </div>
          )}
        </div>

        {/* 控制按钮区域 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 视图模式 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">📅 时间视图</label>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('age')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'age'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                按年龄
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'year'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                按年份
              </button>
            </div>
          </div>

          {/* 成就筛选 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">🏷️ 成就类别</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">全部类别</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* 里程碑过滤 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">⭐ 重要筛选</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowOnlyMilestones(!showOnlyMilestones)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showOnlyMilestones
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-600'
                }`}
              >
                <span>{showOnlyMilestones ? '✨' : '📋'}</span>
                <span>{showOnlyMilestones ? '里程碑' : '全部'}</span>
              </button>
            </div>
          </div>

          {/* 动画播放 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">🎬 动画播放</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={startAnimation}
                disabled={playAnimation}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  playAnimation
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                }`}
              >
                <span>{playAnimation ? '⏸️' : '▶️'}</span>
                <span>{playAnimation ? '播放中' : '播放'}</span>
              </button>

              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showComparison
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-600'
                }`}
              >
                <span>{showComparison ? '📊' : '📈'}</span>
                <span>对比</span>
              </button>
            </div>
          </div>
        </div>

        {/* 进度条（动画时显示） */}
        {playAnimation && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>播放进度</span>
              <span>{currentAnimationStep + 1} / {filteredAchievements.length}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentAnimationStep + 1) / filteredAchievements.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 成就时间轴 */}
      <div className="relative">
        {/* 时间轴主线 */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>

        <div className="space-y-8">
          {filteredAchievements.map((achievement, index) => {
            const isUserAgeReached = userAge && achievement.age <= userAge;
            const isAnimationActive = playAnimation && index <= currentAnimationStep;
            const isCurrentStep = playAnimation && index === currentAnimationStep;
            const isHovered = hoveredAchievement === achievement.id;

            return (
              <div
                key={achievement.id}
                className={`relative flex items-start space-x-6 group cursor-pointer transition-all duration-700 ${
                  isUserAgeReached ? 'opacity-100' : 'opacity-70'
                } ${
                  playAnimation && !isAnimationActive ? 'opacity-30 scale-95' : ''
                } ${
                  isCurrentStep ? 'ring-2 ring-yellow-400 ring-offset-4 ring-offset-slate-900 scale-105' : ''
                } ${
                  isHovered ? 'scale-[1.02] z-10' : ''
                }`}
                onClick={() => handleAchievementClick(achievement)}
                onMouseEnter={() => setHoveredAchievement(achievement.id)}
                onMouseLeave={() => setHoveredAchievement(null)}
              >
                {/* 时间轴节点 */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getImportanceColor(achievement.importance)}
                                  shadow-lg group-hover:shadow-2xl transition-all duration-500
                                  flex items-center justify-center text-2xl border-4 border-white/20
                                  ${isCurrentStep ? 'animate-pulse ring-4 ring-yellow-400/50' : ''}
                                  ${isHovered ? 'scale-125 rotate-12' : 'group-hover:scale-110'}
                                  ${isUserAgeReached ? 'shadow-green-400/30' : ''}
                                  relative overflow-hidden`}>

                    {/* 发光效果 */}
                    {isCurrentStep && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-full animate-ping"></div>
                    )}

                    <span className="relative z-10">{getCategoryIcon(achievement.category)}</span>

                    {/* 成就解锁特效 */}
                    {isUserAgeReached && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs animate-bounce">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* 年龄标签 */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-slate-800 text-slate-200 px-2 py-1 rounded-full text-xs font-bold border border-slate-600">
                      {viewMode === 'age' ? `${achievement.age}岁` : formatYear(achievement.year)}
                    </div>
                  </div>

                  {/* 用户年龄对比指示器 */}
                  {userAge && achievement.age === userAge && (
                    <div className="absolute -right-20 top-1/2 transform -translate-y-1/2">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        您的年龄
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-green-500"></div>
                    </div>
                  )}
                </div>

                {/* 成就内容 */}
                <div className={`flex-1 pb-8 ${
                  isUserAgeReached ? 'bg-gradient-to-br from-white to-slate-50' : 'bg-gradient-to-br from-slate-100 to-slate-200'
                } rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]`}>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 bg-gradient-to-r ${getImportanceColor(achievement.importance)}
                                       text-white rounded-full text-xs font-medium`}>
                          {achievement.importance === 'high' ? '🔥 重大成就' :
                           achievement.importance === 'medium' ? '⚡ 重要进展' : '💫 一般成就'}
                        </span>
                        <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium">
                          {getCategoryIcon(achievement.category)} {getCategoryName(achievement.category)}
                        </span>
                        {achievement.location && (
                          <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs">
                            📍 {achievement.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {userAge && (
                      <div className={`text-sm font-bold ${
                        achievement.age <= userAge ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {achievement.age <= userAge ? '✅ 已超越' : '🎯 待超越'}
                      </div>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-4">{achievement.description}</p>

                  {achievement.relatedFigures && achievement.relatedFigures.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-slate-600">相关人物：</span>
                      {achievement.relatedFigures.map((person, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {person}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 选中成就详情模态框 */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-500/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  {selectedAchievement.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/20">
                    {selectedAchievement.age} 岁 • {formatYear(selectedAchievement.year)}
                  </span>
                  {selectedAchievement.location && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 rounded-full border border-green-400/20">
                      📍 {selectedAchievement.location}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-slate-400 hover:text-red-400 text-3xl font-light transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-200 mb-3">📝 详细描述</h4>
                <p className="text-slate-300 leading-relaxed">{selectedAchievement.description}</p>
              </div>

              {selectedAchievement.relatedFigures && selectedAchievement.relatedFigures.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-200 mb-3">👥 相关人物</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAchievement.relatedFigures.map((person, index) => (
                      <span key={index} className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-medium border border-blue-400/20">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAchievement.sources && selectedAchievement.sources.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-200 mb-3">📚 参考文献</h4>
                  <ul className="space-y-2">
                    {selectedAchievement.sources.map((source, index) => (
                      <li key={index} className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                        <span className="font-bold text-slate-300">[{index + 1}]</span> {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 对比分析面板 */}
      {showComparison && userAge && (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 rounded-2xl p-8 shadow-2xl border border-emerald-500/20">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
            📊 成就对比分析
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 年龄对比 */}
            <div className="bg-emerald-800/30 p-6 rounded-xl border border-emerald-400/20">
              <h4 className="text-lg font-bold text-emerald-300 mb-4">🎯 年龄里程碑</h4>

              {/* 已超越的成就 */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-emerald-200">已超越成就</span>
                    <span className="text-emerald-400 font-bold">
                      {filteredAchievements.filter(a => a.age <= userAge).length}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-900/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full"
                      style={{
                        width: `${(filteredAchievements.filter(a => a.age <= userAge).length / filteredAchievements.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-emerald-200">待超越成就</span>
                    <span className="text-orange-400 font-bold">
                      {filteredAchievements.filter(a => a.age > userAge).length}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-900/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                      style={{
                        width: `${(filteredAchievements.filter(a => a.age > userAge).length / filteredAchievements.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近的目标 */}
            <div className="bg-emerald-800/30 p-6 rounded-xl border border-emerald-400/20">
              <h4 className="text-lg font-bold text-emerald-300 mb-4">🎯 下一个目标</h4>
              {(() => {
                const nextAchievement = filteredAchievements.find(a => a.age > userAge);
                if (!nextAchievement) {
                  return (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2">🏆</div>
                      <p className="text-emerald-200">您已超越所有记录成就！</p>
                    </div>
                  );
                }

                return (
                  <div className="text-center">
                    <div className="text-3xl mb-3">{getCategoryIcon(nextAchievement.category)}</div>
                    <h5 className="font-bold text-emerald-200 mb-2">{nextAchievement.title}</h5>
                    <div className="text-orange-400 font-bold text-lg mb-2">
                      {nextAchievement.age} 岁
                    </div>
                    <div className="text-sm text-emerald-300">
                      还需 {nextAchievement.age - userAge} 年
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 成就分类统计 */}
            <div className="bg-emerald-800/30 p-6 rounded-xl border border-emerald-400/20">
              <h4 className="text-lg font-bold text-emerald-300 mb-4">📈 类别分布</h4>
              <div className="space-y-2">
                {allCategories.slice(0, 4).map(category => {
                  const count = filteredAchievements.filter(a => a.category === category).length;
                  const percentage = (count / filteredAchievements.length) * 100;

                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getCategoryIcon(category)}</span>
                        <span className="text-emerald-200 text-sm">{getCategoryName(category)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-emerald-900/50 rounded-full h-1">
                          <div
                            className="bg-emerald-400 h-1 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 励志语句 */}
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-400/20">
            <p className="text-emerald-200 italic">
              {userAge < 25
                ? "青春年华，正是学习和成长的黄金时期！"
                : userAge < 40
                ? "人生黄金期，是时候创造属于自己的伟大成就！"
                : "经验丰富的年龄，智慧与能力并重的人生阶段！"
              }
            </p>
          </div>
        </div>
      )}

      {/* 统计信息条 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">📊</span>
            <span className="text-slate-300">总成就: <span className="font-bold text-blue-400">{filteredAchievements.length}</span></span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-red-400">🔥</span>
            <span className="text-slate-300">重要成就: <span className="font-bold text-red-400">{filteredAchievements.filter(a => a.importance === 'high').length}</span></span>
          </div>

          {userAge && (
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">已超越: <span className="font-bold text-green-400">{filteredAchievements.filter(a => a.age <= userAge).length}</span></span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-purple-400">⏱️</span>
            <span className="text-slate-300">活跃期: <span className="font-bold text-purple-400">{lifespan} 年</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}