'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TimelineEvent, TimelinePeriod, TimelineProps } from '@/types';

export default function ModernTimeline({ events, periods, onEventClick, onPeriodClick }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 排序事件
  const sortedEvents = events.sort((a, b) => a.year - b.year);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    // 创建主容器
    const container = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'linear-gradient(to bottom, #f8fafc, #f1f5f9)');

    const g = container
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 创建时间尺度
    const xScale = d3.scaleLinear()
      .domain(d3.extent(sortedEvents, d => d.year) as [number, number])
      .range([0, width]);

    // 绘制时期背景
    if (periods) {
      periods.forEach(period => {
        const startX = xScale(period.startYear);
        const endX = xScale(period.endYear);

        g.append('rect')
          .attr('x', startX)
          .attr('y', 0)
          .attr('width', endX - startX)
          .attr('height', height)
          .attr('fill', period.color || '#e2e8f0')
          .attr('opacity', 0.1)
          .style('cursor', 'pointer')
          .on('click', () => onPeriodClick?.(period));

        // 添加时期标签
        g.append('text')
          .attr('x', (startX + endX) / 2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', '#64748b')
          .text(period.name);
      });
    }

    // 主时间线
    g.append('line')
      .attr('x1', 0)
      .attr('y1', height / 2)
      .attr('x2', width)
      .attr('y2', height / 2)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

    // 年份刻度
    const yearTicks = xScale.ticks(10);
    yearTicks.forEach(year => {
      const x = xScale(year);

      g.append('line')
        .attr('x1', x)
        .attr('y1', height / 2 - 15)
        .attr('x2', x)
        .attr('y2', height / 2 + 15)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1);

      g.append('text')
        .attr('x', x)
        .attr('y', height / 2 + 35)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#64748b')
        .text(year < 0 ? `${Math.abs(year)}BC` : `${year}AD`);
    });

    // 重要程度的颜色和大小
    const getEventColor = (importance: string) => {
      switch (importance) {
        case 'high': return '#dc2626';
        case 'medium': return '#f59e0b';
        case 'low': return '#3b82f6';
        default: return '#6b7280';
      }
    };

    const getEventRadius = (importance: string) => {
      switch (importance) {
        case 'high': return 8;
        case 'medium': return 6;
        case 'low': return 4;
        default: return 4;
      }
    };

    // 绘制事件点
    sortedEvents.forEach((event, index) => {
      const x = xScale(event.year);
      const y = height / 2 + (index % 2 === 0 ? -80 : 80);
      const radius = getEventRadius(event.importance);
      const color = getEventColor(event.importance);

      // 连接线
      g.append('line')
        .attr('x1', x)
        .attr('y1', height / 2)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '2,2')
        .attr('opacity', 0.6);

      // 事件点
      const eventGroup = g.append('g')
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedEvent(event);
          onEventClick?.(event);
        })
        .on('mouseenter', function() {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', radius * 1.5)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');

          // 显示工具提示
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.left = `${x + margin.left}px`;
            tooltipRef.current.style.top = `${y + margin.top - 10}px`;
            tooltipRef.current.innerHTML = `
              <div class="bg-white p-3 rounded-lg shadow-lg border max-w-xs">
                <div class="font-semibold text-gray-900">${event.title}</div>
                <div class="text-sm text-gray-600">${event.year < 0 ? `公元前${Math.abs(event.year)}年` : `公元${event.year}年`}</div>
                ${event.location ? `<div class="text-xs text-gray-500 mt-1">📍 ${event.location}</div>` : ''}
              </div>
            `;
          }
        })
        .on('mouseleave', function() {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', radius)
            .style('filter', 'none');

          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
          }
        });

      eventGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');

      // 事件标签
      eventGroup.append('text')
        .attr('x', x)
        .attr('y', y + (index % 2 === 0 ? -15 : 25))
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', color)
        .style('pointer-events', 'none')
        .text(event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title);
    });

  }, [sortedEvents, periods]);

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  return (
    <div className="w-full space-y-6">
      {/* 控制面板 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 历史时间线</h2>
            <p className="text-gray-600 text-sm">探索人类历史的重要时刻，点击事件了解详情</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-xs text-gray-600">重要事件</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="text-xs text-gray-600">一般事件</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-xs text-gray-600">次要事件</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG 时间线 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4">
          <svg ref={svgRef} className="w-full"></svg>
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none z-10"
            style={{ display: 'none' }}
          ></div>
        </div>
      </div>

      {/* 选中事件详情 */}
      {selectedEvent && (
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">📅 基本信息</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">时间</span>
                    <span className="text-sm font-medium text-blue-900">{formatYear(selectedEvent.year)}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">地点</span>
                      <span className="text-sm font-medium text-blue-900">{selectedEvent.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">类别</span>
                    <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded text-center">{selectedEvent.category}</span>
                  </div>
                </div>
              </div>

              {selectedEvent.figures && selectedEvent.figures.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-3">👑 关键人物</h4>
                  <div className="space-y-1">
                    {selectedEvent.figures.map((figure, index) => (
                      <span key={index} className="inline-block text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded mr-1 mb-1">
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.sources && selectedEvent.sources.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">📚 参考文献</h4>
                  <ul className="space-y-1">
                    {selectedEvent.sources.map((source, index) => (
                      <li key={index} className="text-xs text-green-800 leading-relaxed">
                        <span className="font-medium">{index + 1}.</span> {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}