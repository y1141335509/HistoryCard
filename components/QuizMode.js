function QuizMode({ cards, onComplete }) {
  try {
    const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState('');
    const [showResult, setShowResult] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [quizCards, setQuizCards] = React.useState([]);

    React.useEffect(() => {
      const shuffled = [...cards].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuizCards(shuffled);
    }, [cards]);

    const currentCard = quizCards[currentCardIndex];

    const handleAnswerSelect = (answer) => {
      setSelectedAnswer(answer);
      setShowResult(true);
      
      if (answer === currentCard?.answer) {
        setScore(score + 1);
        onComplete(currentCard.id);
      }
    };

    const handleNext = () => {
      if (currentCardIndex < quizCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setSelectedAnswer('');
        setShowResult(false);
      }
    };

    const resetQuiz = () => {
      setCurrentCardIndex(0);
      setSelectedAnswer('');
      setShowResult(false);
      setScore(0);
      const shuffled = [...cards].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuizCards(shuffled);
    };

    if (quizCards.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12" data-name="quiz-mode" data-file="components/QuizMode.js">
          <div className="icon-brain text-6xl text-[var(--text-secondary)] mb-4"></div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            No Quiz Available
          </h2>
          <p className="text-[var(--text-secondary)]">
            Search for topics to generate knowledge cards first!
          </p>
        </div>
      );
    }

    if (currentCardIndex >= quizCards.length) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12" data-name="quiz-complete" data-file="components/QuizMode.js">
          <div className="icon-trophy text-6xl text-[var(--warning-color)] mb-4"></div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Quiz Complete!
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-6">
            Your score: {score} out of {quizCards.length}
          </p>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-[var(--success-color)] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(score / quizCards.length) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={resetQuiz}
              className="btn btn-primary"
            >
              <div className="icon-refresh-cw text-sm mr-2"></div>
              Take Another Quiz
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto" data-name="quiz-mode" data-file="components/QuizMode.js">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Quiz Mode</h2>
            <span className="text-sm text-[var(--text-secondary)]">
              {currentCardIndex + 1} of {quizCards.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / quizCards.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-6">
            <span className="text-xs font-medium text-[var(--secondary-color)] bg-purple-50 px-2 py-1 rounded-full">
              {currentCard?.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            {currentCard?.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentCard?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showResult
                    ? option === currentCard.answer
                      ? 'border-[var(--success-color)] bg-green-50 text-[var(--success-color)]'
                      : option === selectedAnswer
                        ? 'border-[var(--error-color)] bg-red-50 text-[var(--error-color)]'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    : 'border-[var(--border-color)] hover:border-[var(--primary-color)] hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                selectedAnswer === currentCard.answer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <div className={`text-lg mr-2 ${
                    selectedAnswer === currentCard.answer
                      ? 'icon-check-circle text-[var(--success-color)]'
                      : 'icon-x-circle text-[var(--error-color)]'
                  }`}></div>
                  <span className="font-medium">
                    {selectedAnswer === currentCard.answer ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                {currentCard.explanation && (
                  <p className="text-sm text-[var(--text-primary)]">
                    {currentCard.explanation}
                  </p>
                )}
              </div>

              <button
                onClick={handleNext}
                className="btn btn-primary w-full"
              >
                {currentCardIndex < quizCards.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <div className="icon-arrow-right text-sm ml-2"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('QuizMode component error:', error);
    return null;
  }
}