'use client';

import { useState, useEffect, useRef } from 'react';
import { TimelineEvent, TimelinePeriod, TimelineProps } from '@/types';
import { format } from 'date-fns';

export default function Timeline({ events, periods, onEventClick, onPeriodClick }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewRange, setViewRange] = useState({ start: -8000, end: 2024 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sort events by year
  const sortedEvents = events.sort((a, b) => a.year - b.year);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  const getEventPosition = (year: number) => {
    const { start, end } = viewRange;
    const totalRange = end - start;
    const position = ((year - start) / totalRange) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getImportanceSize = (importance: string) => {
    switch (importance) {
      case 'high': return 'w-4 h-4';
      case 'medium': return 'w-3 h-3';
      case 'low': return 'w-2 h-2';
      default: return 'w-2 h-2';
    }
  };

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  // 鼠标滚轮缩放功能
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  // 拖拽功能
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      scrollLeft: timelineRef.current?.scrollLeft || 0
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - dragStart.x) * 2;
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = dragStart.scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">历史时间线</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
            >
              缩小
            </button>
            <span className="text-sm text-gray-600">缩放: {zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
            >
              放大
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {formatYear(viewRange.start)} - {formatYear(viewRange.end)}
          </div>
          <select
            value={`${viewRange.start}-${viewRange.end}`}
            onChange={(e) => {
              const [start, end] = e.target.value.split('-').map(Number);
              setViewRange({ start, end });
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="-8000-2024">全部历史</option>
            <option value="-8000-0">史前和古代</option>
            <option value="-3000-0">古代文明</option>
            <option value="0-500">早期古典时期</option>
            <option value="500-1500">中世纪</option>
            <option value="1500-1800">近世</option>
            <option value="1800-1950">近代</option>
            <option value="1950-2024">现代</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 mb-2">图例</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">重要事件</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">一般事件</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">次要事件</span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div
          ref={timelineRef}
          className="relative h-96 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `scaleX(${zoomLevel})`,
            transformOrigin: 'left center',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Timeline Base Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>

          {/* Year Markers */}
          <div className="absolute top-0 left-0 w-full h-full">
            {(() => {
              const { start, end } = viewRange;
              const totalRange = end - start;
              let yearStep;

              // 动态调整年份步长
              if (totalRange <= 100) yearStep = 10;
              else if (totalRange <= 500) yearStep = 50;
              else if (totalRange <= 2000) yearStep = 200;
              else if (totalRange <= 5000) yearStep = 500;
              else yearStep = 1000;

              const markers = [];
              const startMarker = Math.ceil(start / yearStep) * yearStep;

              for (let year = startMarker; year <= end; year += yearStep) {
                const position = getEventPosition(year);
                if (position >= 0 && position <= 100) {
                  markers.push(
                    <div
                      key={year}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${position}%`, top: '75%' }}
                    >
                      <div className="w-px h-4 bg-gray-400"></div>
                      <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                        {formatYear(year)}
                      </span>
                    </div>
                  );
                }
              }
              return markers;
            })()}
          </div>

          {/* Timeline Events */}
          {sortedEvents.map((event, index) => {
            const position = getEventPosition(event.year);
            const isVisible = position >= 0 && position <= 100;

            if (!isVisible) return null;

            return (
              <div
                key={event.id}
                className="absolute flex flex-col items-center cursor-pointer group"
                style={{
                  left: `${position}%`,
                  top: index % 2 === 0 ? '20%' : '55%',
                }}
                onClick={() => handleEventClick(event)}
              >
                {/* Event Line */}
                <div className="w-px h-8 bg-gray-400 group-hover:bg-blue-500 transition-colors"></div>

                {/* Event Dot */}
                <div
                  className={`${getImportanceSize(event.importance)} ${getImportanceColor(event.importance)}
                           rounded-full border-2 border-white shadow-sm group-hover:scale-125
                           transition-transform cursor-pointer`}
                  title={event.title}
                ></div>

                {/* Event Label */}
                <div className="mt-2 bg-white border border-gray-200 rounded px-2 py-1 shadow-sm
                              group-hover:bg-blue-50 transition-all pointer-events-none
                              min-w-max max-w-48">
                  <div className="text-xs font-medium text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500">{formatYear(event.year)}</div>
                  {event.location && (
                    <div className="text-xs text-gray-400">📍 {event.location}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Period Backgrounds (if provided) */}
          {periods?.map((period) => {
            const startPos = getEventPosition(period.startYear);
            const endPos = getEventPosition(period.endYear);
            const width = endPos - startPos;

            if (width <= 0) return null;

            return (
              <div
                key={period.id}
                className="absolute top-0 h-full opacity-10 cursor-pointer"
                style={{
                  left: `${startPos}%`,
                  width: `${width}%`,
                  backgroundColor: period.color,
                }}
                onClick={() => onPeriodClick?.(period)}
                title={period.name}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Detail */}
      {selectedEvent && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">时间:</span>
                  <span className="text-sm text-gray-900">{formatYear(selectedEvent.year)}</span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">地点:</span>
                    <span className="text-sm text-gray-900">📍 {selectedEvent.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">类别:</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {selectedEvent.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">重要程度:</span>
                  <div className={`w-3 h-3 ${getImportanceColor(selectedEvent.importance)} rounded-full`}></div>
                  <span className="text-sm text-gray-900 capitalize">{selectedEvent.importance}</span>
                </div>
              </div>
            </div>

            <div>
              {selectedEvent.figures && selectedEvent.figures.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500 block mb-2">关键人物:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.figures.map((figure, index) => (
                      <span
                        key={index}
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                      >
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm font-medium text-gray-500 block mb-2">描述:</span>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedEvent.description}</p>
          </div>

          {selectedEvent.sources && selectedEvent.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-500 block mb-2">📚 参考文献:</span>
              <ul className="space-y-1">
                {selectedEvent.sources.map((source, index) => (
                  <li key={index} className="text-xs text-gray-600 pl-4 relative">
                    <span className="absolute left-0 top-0">{index + 1}.</span>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}