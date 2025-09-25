// History knowledge card generator using Claude API
const CLAUDE_API_KEY = 'your-claude-api-key-here'; // Replace with your actual API key

async function generateKnowledgeCards(topic, count = 6) {
  try {
    console.log(`Generating ${count} history cards for topic: ${topic}`);

    const historyCards = await generateHistoryCardsWithClaude(topic, count);
    return historyCards;

  } catch (error) {
    console.error('Failed to generate history cards:', error);
    return generateFallbackHistoryCards(topic, count);
  }
}

// Generate history cards using Claude API
async function generateHistoryCardsWithClaude(topic, count) {
  try {
    const prompt = createHistoryPrompt(topic, count);
    const response = await callClaudeAPI(prompt);

    if (!response) {
      throw new Error('No response from Claude API');
    }

    return parseHistoryCardsFromResponse(response, topic);

  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// Create history-focused prompt for Claude API
function createHistoryPrompt(topic, count) {
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

// Call Claude API
async function callClaudeAPI(prompt) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
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

// Parse cards from Claude API response
function parseHistoryCardsFromResponse(response, topic) {
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
      category: card.category || categorizeHistoryTopic(topic),
      difficulty: card.difficulty || 'Medium',
      estimatedTime: card.estimatedTime || '2 min',
      historicalPeriod: card.historicalPeriod || 'Unknown',
      keyFigures: card.keyFigures || [],
      relatedEvents: card.relatedEvents || [],
      options: card.options || generateDefaultOptions(card.answer),
      topic: topic,
      createdAt: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    console.log('Raw response:', response);
    throw error;
  }
}

// Categorize history topics into specific historical periods/themes
function categorizeHistoryTopic(topic) {
  const historyCategories = {
    'Ancient History': ['ancient', 'egypt', 'greece', 'rome', 'mesopotamia', 'civilization', 'bronze age', 'stone age', 'pharaoh', 'pyramid', 'sparta', 'athens'],
    'Medieval History': ['medieval', 'middle ages', 'crusades', 'feudal', 'viking', 'byzantine', 'knights', 'castle', 'monastery', 'plague'],
    'Renaissance': ['renaissance', 'reformation', 'leonardo', 'michelangelo', '15th century', '16th century', 'humanism', 'printing press'],
    'Modern History': ['industrial', 'revolution', 'napoleon', 'world war', '19th century', '20th century', 'enlightenment', 'democracy'],
    'Asian History': ['china', 'japan', 'india', 'dynasty', 'emperor', 'samurai', 'silk road', 'mongol', 'buddha', 'confucius'],
    'Military History': ['war', 'battle', 'army', 'strategy', 'warrior', 'weapon', 'conflict', 'siege', 'navy', 'tactics'],
    'Political History': ['king', 'queen', 'emperor', 'government', 'empire', 'republic', 'democracy', 'revolution', 'treaty', 'constitution'],
    'Cultural History': ['art', 'literature', 'philosophy', 'religion', 'culture', 'society', 'tradition', 'festival', 'ceremony'],
    'Economic History': ['trade', 'merchant', 'economy', 'currency', 'commerce', 'guild', 'market', 'banking', 'taxation'],
    'Scientific History': ['discovery', 'invention', 'science', 'astronomy', 'medicine', 'technology', 'mathematics', 'scholar']
  };

  const topicLower = topic.toLowerCase();

  for (const [category, keywords] of Object.entries(historyCategories)) {
    if (keywords.some(keyword => topicLower.includes(keyword))) {
      return category;
    }
  }

  return 'General History';
}

// Keep the old function for backward compatibility
function categorizeTopc(topic) {
  return categorizeHistoryTopic(topic);
}

// Generate default multiple choice options
function generateDefaultOptions(correctAnswer) {
  const defaultOptions = [
    'This is not the correct answer',
    'This option is incorrect',
    'This choice is wrong',
    'This answer is false'
  ];
  
  const options = [correctAnswer];
  const shuffled = defaultOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
  options.push(...shuffled);
  
  return options.sort(() => 0.5 - Math.random());
}

// Generate fallback history cards when Claude API fails
function generateFallbackHistoryCards(topic, count) {
  console.log('Generating fallback history cards...');

  const fallbackCards = [];
  const category = categorizeHistoryTopic(topic);

  const historyQuestions = [
    `What is a key historical fact about ${topic}?`,
    `When did ${topic} take place in history?`,
    `Who were the important figures in ${topic}?`,
    `What was the historical significance of ${topic}?`,
    `How did ${topic} influence later historical events?`,
    `What archaeological evidence exists for ${topic}?`
  ];

  for (let i = 0; i < count; i++) {
    const question = historyQuestions[i % historyQuestions.length];

    const card = {
      id: `fallback_history_${Date.now()}_${i}`,
      question: question,
      answer: `${topic} played an important role in shaping human history and civilization.`,
      explanation: `Understanding ${topic} helps us learn about historical patterns, cultural development, and human progress throughout time.`,
      category: category,
      difficulty: 'Medium',
      estimatedTime: '2 min',
      historicalPeriod: 'Various',
      keyFigures: [],
      relatedEvents: [],
      options: [
        `${topic} played an important role in shaping human history and civilization.`,
        'This is not historically accurate',
        'This event never occurred in history',
        'This is from a different historical era'
      ],
      topic: topic,
      createdAt: new Date().toISOString()
    };

    fallbackCards.push(card);
  }

  return fallbackCards;
}