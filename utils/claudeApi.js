// Claude API integration for history card generation
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'your-api-key-here';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

class ClaudeHistoryCardGenerator {
  constructor(apiKey = CLAUDE_API_KEY) {
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01'
    };
  }

  async generateHistoryCards(topic, count = 6) {
    try {
      console.log(`Generating ${count} history cards for topic: ${topic}`);

      const prompt = this.createHistoryPrompt(topic, count);
      const response = await this.callClaudeAPI(prompt);

      if (!response) {
        throw new Error('No response from Claude API');
      }

      const cards = this.parseCardsFromResponse(response, topic);
      return cards;

    } catch (error) {
      console.error('Claude API Error:', error);
      return this.generateFallbackHistoryCards(topic, count);
    }
  }

  createHistoryPrompt(topic, count) {
    return `You are a history education expert. Generate ${count} interactive knowledge cards about "${topic}".

Each card should follow this JSON format:
{
  "question": "An engaging question about the topic",
  "answer": "A clear, concise answer",
  "explanation": "Additional fascinating details or context",
  "category": "Specific historical category (Ancient History, Medieval, Modern, etc.)",
  "difficulty": "Easy/Medium/Hard",
  "estimatedTime": "1-3 min",
  "historicalPeriod": "Specific time period (e.g., '1066 CE', '15th century')",
  "keyFigures": ["List of relevant historical figures"],
  "relatedEvents": ["Related historical events"],
  "options": ["Correct answer", "Wrong option 1", "Wrong option 2", "Wrong option 3"]
}

Focus on:
- Accurate historical facts and dates
- Interesting stories and lesser-known details
- Connections between events and people
- Different civilizations and time periods
- Archaeological discoveries and evidence

Make the content engaging for history enthusiasts and educational for students.

Return ONLY a valid JSON array of ${count} cards, no additional text.`;
  }

  async callClaudeAPI(prompt) {
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
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error) {
      console.error('Failed to call Claude API:', error);
      throw error;
    }
  }

  parseCardsFromResponse(response, topic) {
    try {
      // Clean the response - remove any markdown formatting
      let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const cardsData = JSON.parse(cleanResponse);

      if (!Array.isArray(cardsData)) {
        throw new Error('Response is not an array');
      }

      return cardsData.map((card, index) => ({
        id: `history_card_${Date.now()}_${index}`,
        question: card.question || `What is important about ${topic}?`,
        answer: card.answer || `${topic} has significant historical importance.`,
        explanation: card.explanation || `Learning about ${topic} helps us understand historical context.`,
        category: card.category || this.categorizeHistoryTopic(topic),
        difficulty: card.difficulty || 'Medium',
        estimatedTime: card.estimatedTime || '2 min',
        historicalPeriod: card.historicalPeriod || 'Unknown',
        keyFigures: card.keyFigures || [],
        relatedEvents: card.relatedEvents || [],
        options: card.options || this.generateDefaultOptions(card.answer),
        topic: topic,
        createdAt: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.log('Raw response:', response);
      throw error;
    }
  }

  categorizeHistoryTopic(topic) {
    const historyCategories = {
      'Ancient History': ['ancient', 'egypt', 'greece', 'rome', 'mesopotamia', 'civilization', 'bronze age', 'stone age'],
      'Medieval History': ['medieval', 'middle ages', 'crusades', 'feudal', 'viking', 'byzantine', 'knights'],
      'Renaissance': ['renaissance', 'reformation', 'leonardo', 'michelangelo', '15th century', '16th century'],
      'Modern History': ['industrial', 'revolution', 'napoleon', 'world war', '19th century', '20th century'],
      'Asian History': ['china', 'japan', 'india', 'dynasty', 'emperor', 'samurai', 'silk road'],
      'Military History': ['war', 'battle', 'army', 'strategy', 'warrior', 'weapon', 'conflict'],
      'Political History': ['king', 'queen', 'emperor', 'government', 'empire', 'republic', 'democracy'],
      'Cultural History': ['art', 'literature', 'philosophy', 'religion', 'culture', 'society', 'tradition']
    };

    const topicLower = topic.toLowerCase();

    for (const [category, keywords] of Object.entries(historyCategories)) {
      if (keywords.some(keyword => topicLower.includes(keyword))) {
        return category;
      }
    }

    return 'General History';
  }

  generateDefaultOptions(correctAnswer) {
    const defaultWrongOptions = [
      'This is not historically accurate',
      'This event never occurred',
      'This is from a different time period',
      'This answer is incorrect'
    ];

    const options = [correctAnswer];
    const shuffled = defaultWrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    options.push(...shuffled);

    return options.sort(() => 0.5 - Math.random());
  }

  generateFallbackHistoryCards(topic, count) {
    console.log('Generating fallback history cards...');

    const fallbackCards = [];
    const category = this.categorizeHistoryTopic(topic);

    for (let i = 0; i < count; i++) {
      const card = {
        id: `fallback_history_${Date.now()}_${i}`,
        question: `What is a key historical fact about ${topic}?`,
        answer: `${topic} played an important role in shaping human history.`,
        explanation: `Understanding ${topic} helps us learn about historical patterns and human development.`,
        category: category,
        difficulty: 'Medium',
        estimatedTime: '2 min',
        historicalPeriod: 'Various',
        keyFigures: [],
        relatedEvents: [],
        options: [
          `${topic} played an important role in shaping human history.`,
          'This is not historically accurate',
          'This event never happened',
          'This is from a different era'
        ],
        topic: topic,
        createdAt: new Date().toISOString()
      };

      fallbackCards.push(card);
    }

    return fallbackCards;
  }
}

// Initialize the generator
const claudeGenerator = new ClaudeHistoryCardGenerator();

// Export the main function for compatibility with existing code
async function generateKnowledgeCards(topic, count = 6) {
  return await claudeGenerator.generateHistoryCards(topic, count);
}

// Export the class for advanced usage
export { ClaudeHistoryCardGenerator, generateKnowledgeCards };