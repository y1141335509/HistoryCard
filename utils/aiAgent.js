// AI Agent utility for generating educational content
async function aiAgent(systemPrompt, userPrompt) {
  try {
    return await invokeAIAgent(systemPrompt, userPrompt);
  } catch (error) {
    console.error('AI Agent error:', error);
    throw error;
  }
}

// Generate knowledge card content using AI
async function generateCardContent(topic) {
  const systemPrompt = `You are an educational content creator. Generate a knowledge card about the given topic in JSON format with the following fields:
  - question: A thought-provoking question about the topic
  - answer: The correct answer to the question
  - explanation: An interesting "Did you know?" fact related to the topic
  - category: The subject category (e.g., Science, History, Technology)
  - difficulty: Easy, Medium, or Hard
  - estimatedTime: Estimated reading time (e.g., "2 min")
  - options: Array of 4 multiple choice options including the correct answer
  
  Make it engaging and educational. Do not add markdown formatting or code blocks.`;
  
  const userPrompt = `Generate a knowledge card about: ${topic}`;
  
  try {
    let response = await aiAgent(systemPrompt, userPrompt);
    response = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to generate card content:', error);
    // Return fallback content
    return {
      question: `What is an interesting fact about ${topic}?`,
      answer: `${topic} has many fascinating aspects worth exploring.`,
      explanation: `Learning about ${topic} can broaden your understanding of the world.`,
      category: 'General Knowledge',
      difficulty: 'Medium',
      estimatedTime: '2 min',
      options: [
        `${topic} has many fascinating aspects worth exploring.`,
        'This is not correct',
        'This is also incorrect',
        'This option is wrong too'
      ]
    };
  }
}

// Generate quiz questions from existing cards
async function generateQuizQuestion(card) {
  const systemPrompt = `Convert the given knowledge card into a multiple choice quiz question with 4 options. Return JSON format with:
  - question: The quiz question
  - options: Array of 4 options
  - answer: The correct answer (must be one of the options)
  - explanation: Brief explanation of why the answer is correct
  
  Do not add markdown formatting or code blocks.`;
  
  const userPrompt = `Card: ${JSON.stringify(card)}`;
  
  try {
    let response = await aiAgent(systemPrompt, userPrompt);
    response = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to generate quiz question:', error);
    return {
      question: card.question,
      options: card.options || [card.answer, 'Option B', 'Option C', 'Option D'],
      answer: card.answer,
      explanation: card.explanation || 'This is the correct answer.'
    };
  }
}