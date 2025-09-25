import { HistoryCard } from '@/types';

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export class ClaudeHistoryCardGenerator {
  private apiKey: string;
  private headers: Record<string, string>;

  constructor(apiKey: string = CLAUDE_API_KEY || '') {
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01'
    };
  }

  async generateHistoryCards(topic: string, count: number = 6): Promise<HistoryCard[]> {
    try {
      console.log(`正在为主题"${topic}"生成${count}张历史卡片`);

      const prompt = this.createHistoryPrompt(topic, count);
      const response = await this.callClaudeAPI(prompt);

      if (!response) {
        throw new Error('Claude API没有返回响应');
      }

      const cards = this.parseCardsFromResponse(response, topic);
      return cards;

    } catch (error) {
      console.error('Claude API错误:', error);
      return this.generateFallbackHistoryCards(topic, count);
    }
  }

  private createHistoryPrompt(topic: string, count: number): string {
    return `你是一位历史教育专家。为"${topic}"生成${count}张互动知识卡片。

每张卡片应遵循以下JSON格式：
{
  "question": "关于该主题的吸引人的问题",
  "answer": "清晰简洁的答案",
  "explanation": "额外的精彩细节或背景信息",
  "category": "具体历史类别（古代历史、中世纪、文艺复兴、现代等）",
  "difficulty": "简单/中等/困难",
  "estimatedTime": "1-3分钟",
  "historicalPeriod": "具体时间段（如'公元1066年'，'15世纪'）",
  "keyFigures": ["相关历史人物列表"],
  "relatedEvents": ["相关历史事件"],
  "options": ["正确答案", "错误选项1", "错误选项2", "错误选项3"]
}

重点关注：
- 准确的历史事实和日期
- 有趣的故事和鲜为人知的细节
- 事件和人物之间的联系
- 不同文明和时代
- 考古发现和证据

让内容对历史爱好者有吸引力，对学生有教育意义。

只返回${count}张卡片的有效JSON数组，不要添加其他文本。`;
  }

  private async callClaudeAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error) {
      console.error('调用Claude API失败:', error);
      throw error;
    }
  }

  private parseCardsFromResponse(response: string, topic: string): HistoryCard[] {
    try {
      // 清理响应 - 移除markdown格式
      let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const cardsData = JSON.parse(cleanResponse);

      if (!Array.isArray(cardsData)) {
        throw new Error('响应不是数组格式');
      }

      return cardsData.map((card: any, index: number) => ({
        id: `history_card_${Date.now()}_${index}`,
        question: card.question || `关于${topic}有什么重要的？`,
        answer: card.answer || `${topic}在历史上具有重要意义。`,
        explanation: card.explanation || `了解${topic}有助于我们理解历史背景。`,
        category: card.category || this.categorizeHistoryTopic(topic),
        difficulty: card.difficulty || '中等',
        estimatedTime: card.estimatedTime || '2分钟',
        historicalPeriod: card.historicalPeriod || '未知',
        keyFigures: card.keyFigures || [],
        relatedEvents: card.relatedEvents || [],
        options: card.options || this.generateDefaultOptions(card.answer),
        topic: topic,
        createdAt: new Date().toISOString()
      }));

    } catch (error) {
      console.error('解析Claude响应失败:', error);
      console.log('原始响应:', response);
      throw error;
    }
  }

  private categorizeHistoryTopic(topic: string): string {
    const historyCategories: Record<string, string[]> = {
      '古代历史': ['古代', '埃及', '希腊', '罗马', '美索不达米亚', '文明', '青铜时代', '石器时代', '法老', '金字塔', '斯巴达', '雅典'],
      '中世纪历史': ['中世纪', '中古', '十字军', '封建', '维京', '拜占庭', '骑士', '城堡', '修道院', '黑死病'],
      '文艺复兴': ['文艺复兴', '宗教改革', '达芬奇', '米开朗基罗', '15世纪', '16世纪', '人文主义', '印刷术'],
      '现代历史': ['工业', '革命', '拿破仑', '世界大战', '19世纪', '20世纪', '启蒙运动', '民主'],
      '亚洲历史': ['中国', '日本', '印度', '朝代', '皇帝', '武士', '丝绸之路', '蒙古', '佛陀', '孔子'],
      '军事历史': ['战争', '战役', '军队', '战略', '战士', '武器', '冲突', '围攻', '海军', '战术'],
      '政治历史': ['国王', '女王', '皇帝', '政府', '帝国', '共和国', '民主', '革命', '条约', '宪法'],
      '文化历史': ['艺术', '文学', '哲学', '宗教', '文化', '社会', '传统', '节日', '仪式'],
      '经济历史': ['贸易', '商人', '经济', '货币', '商业', '行会', '市场', '银行', '税收'],
      '科学历史': ['发现', '发明', '科学', '天文', '医学', '技术', '数学', '学者']
    };

    const topicLower = topic.toLowerCase();

    for (const [category, keywords] of Object.entries(historyCategories)) {
      if (keywords.some(keyword => topicLower.includes(keyword))) {
        return category;
      }
    }

    return '通用历史';
  }

  private generateDefaultOptions(correctAnswer: string): string[] {
    const defaultWrongOptions = [
      '这在历史上不准确',
      '这个事件从未发生过',
      '这是来自不同的时期',
      '这个答案是错误的'
    ];

    const options = [correctAnswer];
    const shuffled = defaultWrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    options.push(...shuffled);

    return options.sort(() => 0.5 - Math.random());
  }

  private generateFallbackHistoryCards(topic: string, count: number): HistoryCard[] {
    console.log('生成备用历史卡片...');

    const fallbackCards: HistoryCard[] = [];
    const category = this.categorizeHistoryTopic(topic);

    const historyQuestions = [
      `关于${topic}的关键历史事实是什么？`,
      `${topic}在历史上何时发生？`,
      `${topic}中的重要人物有哪些？`,
      `${topic}的历史意义是什么？`,
      `${topic}如何影响后来的历史事件？`,
      `${topic}有什么考古证据？`
    ];

    for (let i = 0; i < count; i++) {
      const question = historyQuestions[i % historyQuestions.length];

      const card: HistoryCard = {
        id: `fallback_history_${Date.now()}_${i}`,
        question: question,
        answer: `${topic}在塑造人类历史和文明方面发挥了重要作用。`,
        explanation: `了解${topic}有助于我们学习历史模式、文化发展和人类在时间长河中的进步。`,
        category: category,
        difficulty: '中等' as const,
        estimatedTime: '2分钟',
        historicalPeriod: '各个时期',
        keyFigures: [],
        relatedEvents: [],
        options: [
          `${topic}在塑造人类历史和文明方面发挥了重要作用。`,
          '这在历史上不准确',
          '这个事件在历史上从未发生',
          '这是来自不同的历史时代'
        ],
        topic: topic,
        createdAt: new Date().toISOString()
      };

      fallbackCards.push(card);
    }

    return fallbackCards;
  }
}

// 导出默认实例
const claudeGenerator = new ClaudeHistoryCardGenerator();

export async function generateKnowledgeCards(topic: string, count: number = 6): Promise<HistoryCard[]> {
  return await claudeGenerator.generateHistoryCards(topic, count);
}