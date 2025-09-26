'use client';

import { useState, useEffect, useRef } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import { TimelineEvent, TimelinePeriod, TimelineProps } from '@/types';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export default function VisTimeline({ events, periods, onEventClick, onPeriodClick }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstance = useRef<Timeline | null>(null);

  // 排序事件
  const sortedEvents = events.sort((a, b) => a.year - b.year);

  useEffect(() => {
    if (!timelineRef.current) return;

    // 准备数据
    const items = new DataSet(
      sortedEvents.map(event => ({
        id: event.id,
        content: `<div style="padding: 4px 8px;">
          <strong>${event.title}</strong><br>
          <small style="color: #666;">${event.year < 0 ? `公元前${Math.abs(event.year)}年` : `公元${event.year}年`}</small>
          ${event.location ? `<br><small style="color: #888;">📍 ${event.location}</small>` : ''}
        </div>`,
        start: new Date(event.year < 0 ? Math.abs(event.year) * -1 : event.year, 0, 1),
        group: event.category,
        className: `importance-${event.importance}`,
        type: 'box',
        title: event.description
      }))
    );

    // 准备分组数据
    const groups = new DataSet([
      ...Array.from(new Set(sortedEvents.map(e => e.category))).map((category, index) => ({
        id: category,
        content: category,
        order: index
      }))
    ]);

    // 配置选项
    const options = {
      width: '100%',
      height: '500px',
      margin: {
        item: 20,
        axis: 40
      },
      orientation: 'top',
      zoomable: true,
      moveable: true,
      showTooltips: true,
      tooltip: {
        followMouse: true,
        overflowMethod: 'cap' as const
      },
      groupOrder: 'order',
      editable: false,
      selectable: true,
      multiselect: false,
      stack: true,
      showMajorLabels: true,
      showMinorLabels: true,
      format: {
        minorLabels: {
          millisecond: 'SSS',
          second: 's',
          minute: 'HH:mm',
          hour: 'HH:mm',
          weekday: 'ddd D',
          day: 'D',
          week: 'w',
          month: 'MMM',
          year: 'YYYY'
        },
        majorLabels: {
          millisecond: 'HH:mm:ss',
          second: 'D MMMM HH:mm',
          minute: 'ddd D MMMM',
          hour: 'ddd D MMMM',
          weekday: 'MMMM YYYY',
          day: 'MMMM YYYY',
          week: 'MMMM YYYY',
          month: 'YYYY',
          year: ''
        }
      }
    };

    // 创建时间线实例
    timelineInstance.current = new Timeline(timelineRef.current, items, groups, options);

    // 添加事件监听器
    timelineInstance.current.on('select', (params) => {
      if (params.items.length > 0) {
        const selectedId = params.items[0];
        const selectedEvent = sortedEvents.find(e => e.id === selectedId);
        if (selectedEvent) {
          setSelectedEvent(selectedEvent);
          onEventClick?.(selectedEvent);
        }
      }
    });

    // 清理函数
    return () => {
      if (timelineInstance.current) {
        timelineInstance.current.destroy();
      }
    };
  }, [sortedEvents, onEventClick]);

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  const zoomIn = () => {
    timelineInstance.current?.zoomIn(0.2);
  };

  const zoomOut = () => {
    timelineInstance.current?.zoomOut(0.2);
  };

  const fit = () => {
    timelineInstance.current?.fit();
  };

  return (
    <div className="w-full space-y-6">
      {/* 控制面板 */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              ⚡ 交互式历史时间线
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              探索人类历史的宏伟画卷 • 专业级可视化体验 • 支持缩放与交互浏览
            </p>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={zoomIn}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              title="放大"
            >
              🔍+
            </button>
            <button
              onClick={zoomOut}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              title="缩小"
            >
              🔍-
            </button>
            <button
              onClick={fit}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              title="适合屏幕"
            >
              📐
            </button>
          </div>
        </div>

        {/* 图例 */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg"></div>
            <span className="text-sm text-slate-300 font-medium">重要历史事件</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
            <span className="text-sm text-slate-300 font-medium">一般历史事件</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
            <span className="text-sm text-slate-300 font-medium">次要历史事件</span>
          </div>
        </div>
      </div>

      {/* 时间线容器 */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-1">
          <div
            ref={timelineRef}
            className="timeline-container bg-white/90 backdrop-blur-sm rounded-xl"
          />
        </div>
      </div>

      {/* 选中事件详情 */}
      {selectedEvent && (
        <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
                {selectedEvent.title}
              </h3>
              <div className="flex items-center space-x-6 text-sm">
                <span className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/20">
                  <span>📅</span>
                  <span className="text-slate-300 font-medium">{formatYear(selectedEvent.year)}</span>
                </span>
                {selectedEvent.location && (
                  <span className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full border border-green-400/20">
                    <span>📍</span>
                    <span className="text-slate-300 font-medium">{selectedEvent.location}</span>
                  </span>
                )}
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-400/20">
                  {selectedEvent.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-slate-400 hover:text-red-400 text-3xl font-light transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-300 leading-relaxed text-lg font-light">{selectedEvent.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedEvent.figures && selectedEvent.figures.length > 0 && (
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-5 rounded-2xl border border-amber-400/30 backdrop-blur-sm">
                  <h4 className="font-bold text-amber-300 mb-4 flex items-center text-lg">
                    <span className="mr-3 text-xl">👑</span>
                    关键人物
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.figures.map((figure, index) => (
                      <div key={index} className="text-sm bg-amber-400/20 text-amber-200 px-3 py-2 rounded-xl font-medium border border-amber-400/20">
                        {figure}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-5 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                <h4 className="font-bold text-blue-300 mb-4 flex items-center text-lg">
                  <span className="mr-3 text-xl">⭐</span>
                  重要程度
                </h4>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full shadow-lg ${
                    selectedEvent.importance === 'high' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                    selectedEvent.importance === 'medium' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}></div>
                  <span className="text-base text-blue-200 font-medium">
                    {selectedEvent.importance === 'high' ? '🔥 极高重要性' :
                     selectedEvent.importance === 'medium' ? '⚡ 中等重要性' : '💫 一般重要性'}
                  </span>
                </div>
              </div>

              {selectedEvent.sources && selectedEvent.sources.length > 0 && (
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-5 rounded-2xl border border-green-400/30 backdrop-blur-sm">
                  <h4 className="font-bold text-green-300 mb-4 flex items-center text-lg">
                    <span className="mr-3 text-xl">📚</span>
                    学术文献
                  </h4>
                  <ul className="space-y-3">
                    {selectedEvent.sources.map((source, index) => (
                      <li key={index} className="text-sm text-green-200 leading-relaxed bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                        <span className="font-bold text-green-300 mr-2">[{index + 1}]</span>
                        <span className="font-medium">{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.timeline-container .vis-timeline) {
          border: none;
          font-family: 'Inter', system-ui, sans-serif;
        }

        :global(.vis-item.importance-high) {
          background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
          border: 3px solid #991b1b;
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
          transform: scale(1.05);
          border-radius: 12px;
        }

        :global(.vis-item.importance-medium) {
          background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
          border: 3px solid #b45309;
          color: white;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
          border-radius: 10px;
        }

        :global(.vis-item.importance-low) {
          background: linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8);
          border: 2px solid #1d4ed8;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          border-radius: 8px;
        }

        :global(.vis-item.vis-selected) {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.4), 0 8px 32px rgba(139, 92, 246, 0.3) !important;
          transform: scale(1.1) !important;
          z-index: 100 !important;
        }

        :global(.vis-group-label) {
          color: #1f2937;
          font-weight: 700;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        :global(.vis-panel.vis-left) {
          border-right: 3px solid #e5e7eb;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          box-shadow: inset -5px 0 15px rgba(0,0,0,0.05);
        }

        :global(.vis-time-axis .vis-text) {
          color: #4b5563;
          font-weight: 600;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        :global(.vis-time-axis .vis-text.vis-major) {
          color: #1f2937;
          font-weight: 800;
          font-size: 14px;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9));
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        :global(.vis-panel.vis-center) {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
        }
      `}</style>
    </div>
  );
}