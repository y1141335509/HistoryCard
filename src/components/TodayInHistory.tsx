'use client';

import { useState, useEffect } from 'react';
import { HistoricalEvent, getTodaysEvents } from '@/data/historical-events';

interface ModernEvent {
  year: number;
  title: string;
  description: string;
  category: string;
}

const modernEvents: ModernEvent[] = [
  {
    year: 2021,
    title: '中国空间站核心舱天和成功发射',
    description: '标志着中国独立建造空间站进入关键阶段',
    category: '科技'
  },
  {
    year: 2020,
    title: '全球新冠疫情爆发',
    description: '改变了全世界的生活方式和工作模式',
    category: '社会'
  },
  {
    year: 2019,
    title: '首张黑洞照片发布',
    description: '人类首次直接观测到黑洞，证实了爱因斯坦的相对论',
    category: '科学'
  }
];

interface TodayInHistoryProps {
  userBirthYear?: number;
}

export default function TodayInHistory({ userBirthYear = 1998 }: TodayInHistoryProps) {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [todayEvents, setTodayEvents] = useState<HistoricalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${month}-${day}`;
    setCurrentDate(dateString);

    // 获取今天发生的历史事件
    const eventsToday = getTodaysEvents();
    setTodayEvents(eventsToday);
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons = {
      politics: '🏛️',
      science: '🔬',
      culture: '🎨',
      war: '⚔️',
      discovery: '🌍',
      birth: '👶',
      death: '💐',
      invention: '💡'
    };
    return icons[category as keyof typeof icons] || '📜';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      politics: 'from-red-500 to-red-600',
      science: 'from-blue-500 to-blue-600',
      culture: 'from-purple-500 to-purple-600',
      war: 'from-gray-600 to-gray-700',
      discovery: 'from-green-500 to-green-600',
      birth: 'from-pink-500 to-pink-600',
      death: 'from-slate-500 to-slate-600',
      invention: 'from-yellow-500 to-orange-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getYearsAgo = (eventYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - eventYear;
  };

  const getUserAgeAtEvent = (eventYear: number) => {
    if (!userBirthYear) return null;
    const userAge = eventYear - userBirthYear;
    return userAge > 0 ? userAge : null;
  };

  const formatDate = (month: number, day: number) => {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return `${monthNames[month - 1]}${day}日`;
  };

  const today = new Date();
  const todayFormatted = formatDate(today.getMonth() + 1, today.getDate());

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 shadow-xl border border-indigo-100">
      {/* 标题部分 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-4xl">📅</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            历史上的今天
          </h2>
        </div>
        <p className="text-slate-600 text-lg">
          {todayFormatted} • 探索历史在今天留下的印记
        </p>
        <div className="mt-2 text-sm text-slate-500">
          找到 <span className="font-bold text-purple-600">{todayEvents.length}</span> 个重要历史事件
        </div>
      </div>

      {/* 事件列表 */}
      {todayEvents.length > 0 ? (
        <div className="space-y-6">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-slate-200 hover:border-purple-300"
            >
              {/* 事件头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-r ${getCategoryColor(event.category)} text-white rounded-full text-xl shadow-lg`}>
                    {getCategoryIcon(event.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white rounded-full text-xs font-medium shadow`}>
                        {event.category === 'politics' ? '政治' :
                         event.category === 'science' ? '科学' :
                         event.category === 'culture' ? '文化' :
                         event.category === 'war' ? '战争' :
                         event.category === 'discovery' ? '发现' :
                         event.category === 'birth' ? '诞生' :
                         event.category === 'death' ? '逝世' :
                         event.category === 'invention' ? '发明' : '其他'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium">📍 {event.location}</span>
                      <span className="font-medium">📅 {event.year}年</span>
                      <span className="font-bold text-indigo-600">{getYearsAgo(event.year)}年前</span>
                    </div>
                  </div>
                </div>

                {event.significance === 'high' && (
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow animate-pulse">
                    ⭐ 重大事件
                  </div>
                )}
              </div>

              {/* 事件描述 */}
              <div className="mb-4">
                <p className="text-slate-700 leading-relaxed">{event.description}</p>
              </div>

              {/* 关键人物 */}
              {event.keyFigures && event.keyFigures.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-600">关键人物：</span>
                    {event.keyFigures.map((figure, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                      >
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 历史影响 */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  💫 历史影响
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{event.impact}</p>
              </div>

              {/* 时间对比 */}
              {userBirthYear && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    🕰️ 时间对比
                  </h4>
                  <div className="text-sm text-slate-700">
                    {getUserAgeAtEvent(event.year) ? (
                      <p>当这件事发生时，您已经 <span className="font-bold text-purple-600">{getUserAgeAtEvent(event.year)} 岁</span></p>
                    ) : (
                      <p>这件事发生在您出生前 <span className="font-bold text-purple-600">{Math.abs(getUserAgeAtEvent(event.year) || 0)} 年</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  📚 了解更多
                </button>

                <div className="text-xs text-slate-500">
                  重要程度：{event.significance === 'high' ? '⭐⭐⭐' : event.significance === 'medium' ? '⭐⭐' : '⭐'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-slate-600">今天没有找到特别的历史事件</p>
          <p className="text-sm text-slate-500 mt-2">不过历史的每一天都有其独特的意义</p>
        </div>
      )}

      {/* 现代对比版块 */}
      <div className="mt-8 pt-8 border-t-2 border-gradient-to-r from-indigo-200 to-purple-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🌟 现代里程碑
          </h3>
          <p className="text-slate-600">近年来改变世界的重要事件</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modernEvents.slice(0, 3).map((modernEvent, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-green-700">{modernEvent.year}</span>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                  {modernEvent.category}
                </span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{modernEvent.title}</h4>
              <p className="text-sm text-slate-600">{modernEvent.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 你知道吗提示 */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <h4 className="font-semibold text-amber-800">你知道吗？</h4>
        </div>
        <p className="text-sm text-slate-700">
          历史上的今天功能可以帮助我们理解时间的相对性。同一个日期在不同年份发生的事件，
          往往能够展现人类文明发展的脉络和规律。通过对比不同时代的事件，我们可以更好地理解历史的进程。
        </p>
      </div>
    </div>
  );
}