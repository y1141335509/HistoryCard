'use client';

import { useState } from 'react';
import { HistoricalFigure } from '@/types';

interface FiguresListProps {
  figures: HistoricalFigure[];
  onFigureSelect: (figure: HistoricalFigure) => void;
}

export default function FiguresList({ figures, onFigureSelect }: FiguresListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'influence' | 'name' | 'birthYear'>('influence');

  // 获取所有类别和时代
  const categories = Array.from(new Set(figures.map(f => f.category)));
  const eras = Array.from(new Set(figures.map(f => f.era)));

  // 过滤和排序人物
  const filteredAndSortedFigures = figures
    .filter(figure => {
      if (selectedCategory !== 'all' && figure.category !== selectedCategory) return false;
      if (selectedEra !== 'all' && figure.era !== selectedEra) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'influence':
          return b.influence - a.influence;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'birthYear':
          return a.birthYear - b.birthYear;
        default:
          return 0;
      }
    });

  // 获取类别中文名
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      politician: '政治家',
      scientist: '科学家',
      artist: '艺术家',
      writer: '文学家',
      philosopher: '哲学家',
      military: '军事家',
      inventor: '发明家',
      explorer: '探险家',
      religious: '宗教家',
      other: '其他'
    };
    return names[category] || category;
  };

  // 获取类别颜色
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      politician: 'from-red-500 to-red-600',
      scientist: 'from-blue-500 to-blue-600',
      artist: 'from-purple-500 to-purple-600',
      writer: 'from-green-500 to-green-600',
      philosopher: 'from-yellow-500 to-orange-500',
      military: 'from-gray-700 to-gray-800',
      inventor: 'from-indigo-500 to-indigo-600',
      explorer: 'from-teal-500 to-teal-600',
      religious: 'from-amber-500 to-amber-600',
      other: 'from-slate-500 to-slate-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  const calculateAge = (birthYear: number, deathYear?: number) => {
    const endYear = deathYear || new Date().getFullYear();
    return endYear - birthYear;
  };

  return (
    <div className="w-full space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
          📚 历史伟人时间轴
        </h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
          探索历史上最杰出的人物，了解他们在不同年龄段的成就与里程碑，与自己的人生进程进行对比，获得启发与动力。
        </p>
      </div>

      {/* 筛选和排序控件 */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">类别</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">全部类别</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">时代</label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">全部时代</option>
              {eras.map(era => (
                <option key={era} value={era}>
                  {era}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">排序方式</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'influence' | 'name' | 'birthYear')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="influence">影响力排序</option>
              <option value="name">姓名排序</option>
              <option value="birthYear">出生年份</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
              共找到 <span className="font-bold text-purple-600">{filteredAndSortedFigures.length}</span> 位历史人物
            </div>
          </div>
        </div>
      </div>

      {/* 人物卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedFigures.map((figure) => (
          <div
            key={figure.id}
            onClick={() => onFigureSelect(figure)}
            className="group cursor-pointer bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-slate-200 hover:border-purple-300"
          >
            {/* 人物头部信息 */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1">
                    {figure.chineseName || figure.name}
                  </h3>
                  {figure.chineseName && (
                    <p className="text-slate-500 text-sm">{figure.name}</p>
                  )}
                  <p className="text-slate-600 text-sm mt-1">{figure.nationality} • {figure.era}</p>
                </div>

                <div className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(figure.category)} text-white rounded-full text-xs font-medium shadow-lg`}>
                  {getCategoryName(figure.category)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-blue-600 font-medium">生卒年份</div>
                  <div className="text-blue-800 font-bold">
                    {formatYear(figure.birthYear)} - {figure.deathYear ? formatYear(figure.deathYear) : '现在'}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-green-600 font-medium">享年</div>
                  <div className="text-green-800 font-bold">
                    {calculateAge(figure.birthYear, figure.deathYear)} 岁
                  </div>
                </div>
              </div>
            </div>

            {/* 影响力评分 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">历史影响力</span>
                <span className="text-sm font-bold text-purple-600">{figure.influence}/10</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 group-hover:from-purple-600 group-hover:to-pink-600"
                  style={{ width: `${figure.influence * 10}%` }}
                ></div>
              </div>
            </div>

            {/* 职业标签 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {figure.occupation.slice(0, 3).map((job, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium"
                  >
                    {job}
                  </span>
                ))}
                {figure.occupation.length > 3 && (
                  <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs">
                    +{figure.occupation.length - 3} 更多
                  </span>
                )}
              </div>
            </div>

            {/* 主要成就 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">🏆 主要成就</h4>
              <ul className="space-y-1">
                {figure.knownFor.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="text-xs text-slate-600 flex items-start">
                    <span className="text-purple-500 mr-1">•</span>
                    <span className="line-clamp-1">{achievement}</span>
                  </li>
                ))}
                {figure.knownFor.length > 2 && (
                  <li className="text-xs text-slate-500 italic">
                    还有 {figure.knownFor.length - 2} 项重要成就...
                  </li>
                )}
              </ul>
            </div>

            {/* 成就统计 */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">记录成就</span>
                <span className="font-bold text-purple-600">{figure.achievements.length} 项</span>
              </div>
            </div>

            {/* 悬停提示 */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                点击查看详细时间轴 →
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFigures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">没有找到匹配的历史人物</h3>
          <p className="text-slate-500">请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
}