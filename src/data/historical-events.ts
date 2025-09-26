// 历史事件数据库 - 按日期组织的历史事件
export interface HistoricalEvent {
  id: string;
  date: string; // MM-DD format
  year: number;
  title: string;
  description: string;
  category: 'politics' | 'science' | 'culture' | 'war' | 'discovery' | 'birth' | 'death' | 'invention';
  significance: 'high' | 'medium' | 'low';
  keyFigures?: string[];
  location?: string;
  impact: string;
}

// 这里可以扩展更多日期的历史事件
export const historicalEventsByDate: Record<string, HistoricalEvent[]> = {
  '09-25': [
    {
      id: 'event_0925_1513',
      date: '09-25',
      year: 1513,
      title: '巴尔沃亚发现太平洋',
      description: '西班牙探险家瓦斯科·努涅斯·德·巴尔沃亚成为第一个从美洲大陆看到太平洋的欧洲人。',
      category: 'discovery',
      significance: 'high',
      keyFigures: ['瓦斯科·努涅斯·德·巴尔沃亚'],
      location: '巴拿马',
      impact: '这一发现证实了美洲是一个独立的大陆，为后续的环球航行和贸易路线开辟奠定了基础。'
    },
    {
      id: 'event_0925_1789',
      date: '09-25',
      year: 1789,
      title: '美国国会通过权利法案',
      description: '美国国会通过了宪法的前十条修正案，即著名的《权利法案》。',
      category: 'politics',
      significance: 'high',
      keyFigures: ['詹姆斯·麦迪逊'],
      location: '美国',
      impact: '《权利法案》保障了美国公民的基本权利，成为现代民主制度的重要基石。'
    },
    {
      id: 'event_0925_1956',
      date: '09-25',
      year: 1956,
      title: '世界第一条跨大西洋海底电话电缆投入使用',
      description: 'TAT-1海底电话电缆正式投入商业使用，连接北美和欧洲。',
      category: 'invention',
      significance: 'high',
      keyFigures: [],
      location: '大西洋',
      impact: '这标志着现代通信时代的开始，为后来的全球通信网络发展奠定了基础。'
    }
  ],

  '01-01': [
    {
      id: 'event_0101_1984',
      date: '01-01',
      year: 1984,
      title: '中国实施对外开放政策',
      description: '中国政府正式实施全面对外开放政策，标志着改革开放进入新阶段。',
      category: 'politics',
      significance: 'high',
      keyFigures: ['邓小平'],
      location: '中国',
      impact: '这一政策改变了中国的发展轨迹，为中国融入全球经济体系奠定了基础。'
    }
  ],

  '07-20': [
    {
      id: 'event_0720_1969',
      date: '07-20',
      year: 1969,
      title: '阿波罗11号登月成功',
      description: '尼尔·阿姆斯特朗成为第一个踏上月球表面的人类。',
      category: 'science',
      significance: 'high',
      keyFigures: ['尼尔·阿姆斯特朗', '巴兹·奥尔德林', '迈克尔·柯林斯'],
      location: '月球',
      impact: '人类首次登月成功，标志着太空探索进入新时代，展示了科技的巨大潜力。'
    }
  ],

  '11-09': [
    {
      id: 'event_1109_1989',
      date: '11-09',
      year: 1989,
      title: '柏林墙倒塌',
      description: '分割东西柏林28年的柏林墙被推倒，象征着冷战的结束。',
      category: 'politics',
      significance: 'high',
      keyFigures: [],
      location: '德国柏林',
      impact: '柏林墙的倒塌标志着冷战的结束，促进了德国统一和欧洲一体化进程。'
    }
  ],

  '12-25': [
    {
      id: 'event_1225_336',
      date: '12-25',
      year: 336,
      title: '第一个官方圣诞节庆祝',
      description: '罗马皇帝君士坦丁一世正式将12月25日定为基督教的圣诞节。',
      category: 'culture',
      significance: 'high',
      keyFigures: ['君士坦丁一世'],
      location: '罗马帝国',
      impact: '这一决定使圣诞节成为世界上最重要的宗教和文化节日之一。'
    }
  ]
};

// 获取指定日期的历史事件
export function getEventsForDate(month: number, day: number): HistoricalEvent[] {
  const dateKey = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return historicalEventsByDate[dateKey] || [];
}

// 获取今天的历史事件
export function getTodaysEvents(): HistoricalEvent[] {
  const today = new Date();
  return getEventsForDate(today.getMonth() + 1, today.getDate());
}