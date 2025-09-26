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
  "difficulty": "Easy/Medium/Hard",
  "estimatedTime": "1-3分钟",
  "historicalPeriod": "具体时间段（如'公元1066年'，'15世纪'）",
  "keyFigures": ["相关历史人物列表"],
  "relatedEvents": ["相关历史事件"],
  "options": ["正确答案", "错误选项1", "错误选项2", "错误选项3"]
}

重点关注：
- 准确的历史事实和具体日期（请务必核实准确性）
- 重要的历史人物、事件的具体背景和意义
- 历史事件的因果关系和长远影响
- 不同文明、朝代、时代的特色
- 考古发现、史料记录和学术共识
- 避免传说、神话或未经证实的说法

请确保所有信息都基于可靠的历史记录和学术研究。内容既要有教育意义又要引人入胜。

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
        difficulty: card.difficulty || 'Medium',
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
        answer: this.getTopicAnswer(topic, question),
        explanation: this.getTopicExplanation(topic, question),
        category: category,
        difficulty: 'Medium' as const,
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

  private getTopicAnswer(topic: string, questionType: string): string {
    const answerTemplates: Record<string, Record<string, string>> = {
      '古罗马帝国': {
        'facts': '古罗马帝国是人类历史上最强大的帝国之一，存续了超过500年，在其鼎盛时期控制了地中海周围的广大地区，包括现今的欧洲、北非和西亚部分地区。',
        'timeline': '罗马帝国建立于公元前27年，屋大维被元老院授予"奥古斯都"称号，标志着帝国时代开始。帝国在2世纪达到鼎盛，至公元476年西罗马帝国灭亡。',
        'figures': '奥古斯都是首位皇帝，图拉真将帝国疆域扩展到最大，哈德良建造了著名的哈德良长城，马可·奥勒留是哲学家皇帝，君士坦丁大帝使基督教合法化。',
        'significance': '罗马帝国在法律、语言、建筑、政治制度等方面为后世欧洲文明奠定了基础，罗马法成为现代法律体系的重要基础。',
        'impact': '罗马帝国的分裂导致了中世纪欧洲的形成，拉丁语演化成了众多欧洲语言，基督教成为西方文明的主导宗教。',
        'evidence': '罗马斗兽场、万神庙、图拉真柱、庞贝古城等建筑遗迹，以及众多碑石雕像、文献记录和考古发现为帝国历史提供了丰富证据。'
      },
      '汉朝': {
        'facts': '汉朝是中国历史上最重要的朝代之一，建立了统一的中央集权制度，创立了郡县制，奠定了中华文明的政治和文化基础。',
        'timeline': '汉朝分为西汉(公元前206年-公元8年)和东汉(公元25年-220年)两个时期，总共延续了400多年。',
        'figures': '汉高祖刘邦建立汉朝，汉武帝刘彻开疆拓土建立丝绸之路，光武帝刘秀中兴汉朝建立东汉，都是杰出的皇帝。',
        'significance': '汉朝建立了丝绸之路，促进了东西方文化交流，对世界文明发展产生了深远影响，"汉族"、"汉语"等概念由此而来。',
        'impact': '汉朝的政治制度、文化传统、儒家思想影响了后续两千多年的中国历史，成为中华文明的核心组成部分。',
        'evidence': '长城遗迹、兵马俑、汉简、马王堆汉墓、丝绸之路遗迹等为汉朝的辉煌提供了丰富的考古证据。'
      }
    };

    const questionTypeMap: Record<string, string> = {
      '关键历史事实': 'facts',
      '何时发生': 'timeline',
      '重要人物': 'figures',
      '历史意义': 'significance',
      '影响后来': 'impact',
      '考古证据': 'evidence'
    };

    // 从问题中提取类型
    let answerType = 'facts';
    for (const [key, type] of Object.entries(questionTypeMap)) {
      if (questionType.includes(key)) {
        answerType = type;
        break;
      }
    }

    const topicAnswers = answerTemplates[topic];
    if (topicAnswers && topicAnswers[answerType]) {
      return topicAnswers[answerType];
    }

    // 默认答案
    const defaultAnswers: Record<string, string> = {
      'facts': `${topic}是历史上一个重要的文明或事件，对人类发展产生了深远影响。`,
      'timeline': `${topic}在特定的历史时期发生，有着明确的时间背景和发展脉络。`,
      'figures': `${topic}涉及众多重要的历史人物，他们推动了历史的发展。`,
      'significance': `${topic}的历史意义体现在对后世文明和社会发展的重大影响。`,
      'impact': `${topic}对后来的历史事件产生了连锁反应和深远影响。`,
      'evidence': `${topic}留下了丰富的考古证据和历史资料供我们研究。`
    };

    return defaultAnswers[answerType] || defaultAnswers['facts'];
  }

  private getTopicExplanation(topic: string, questionType: string): string {
    const explanationMap: Record<string, string> = {
      '关键历史事实': `了解${topic}的关键事实有助于我们理解其在历史中的重要地位和影响。`,
      '何时发生': `准确的时间线对于理解${topic}与其他历史事件的关系至关重要。`,
      '重要人物': `这些关键人物在${topic}的发展过程中发挥了决定性作用。`,
      '历史意义': `评估${topic}的历史意义有助于我们理解其对今天世界的影响。`,
      '影响后来': `理解${topic}的长期影响揭示了历史事件之间的因果关系。`,
      '考古证据': `考古证据为我们提供了关于${topic}的实物证明和细节。`
    };

    for (const [key, explanation] of Object.entries(explanationMap)) {
      if (questionType.includes(key)) {
        return explanation;
      }
    }

    return `了解${topic}有助于我们学习历史模式、文化发展和人类在时间长河中的进步。`;
  }
}

// 导出默认实例
const claudeGenerator = new ClaudeHistoryCardGenerator();

export async function generateKnowledgeCards(topic: string, count: number = 6): Promise<HistoryCard[]> {
  return await claudeGenerator.generateHistoryCards(topic, count);
}