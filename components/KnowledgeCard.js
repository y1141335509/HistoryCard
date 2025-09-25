function KnowledgeCard({ card, isFavorite, onComplete, onFavorite }) {
  try {
    const [showAnswer, setShowAnswer] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const handleComplete = () => {
      setCompleted(true);
      onComplete(card.id);
    };

    return (
      <div className="card card-hover" data-name="knowledge-card" data-file="components/KnowledgeCard.js">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--primary-color)] bg-blue-50 px-2 py-1 rounded-full">
              {card.category}
            </span>
            {card.historicalPeriod && card.historicalPeriod !== 'Unknown' && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {card.historicalPeriod}
              </span>
            )}
          </div>
          <button
            onClick={onFavorite}
            className={`transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <div className="icon-heart text-lg"></div>
          </button>
        </div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
          {card.question}
        </h3>

        {!showAnswer ? (
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] text-sm">
              想想看，然后揭晓答案！
            </p>
            <button
              onClick={() => setShowAnswer(true)}
              className="btn btn-outline w-full"
            >
              <div className="icon-eye text-sm mr-2">👁️</div>
              查看答案
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-[var(--text-primary)]">{card.answer}</p>
            </div>
            
            {card.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-[var(--primary-color)] mb-2">
                  <div className="icon-info text-sm mr-2 inline">ℹ️</div>
                  你知道吗？
                </h4>
                <p className="text-sm text-[var(--text-primary)]">{card.explanation}</p>
              </div>
            )}

            {/* Historical Context Section */}
            {(card.keyFigures?.length > 0 || card.relatedEvents?.length > 0) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">
                  <div className="icon-users text-sm mr-2 inline">👥</div>
                  历史背景
                </h4>

                {card.keyFigures?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-amber-700">关键人物：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.keyFigures.slice(0, 3).map((figure, index) => (
                        <span key={index} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {card.relatedEvents?.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-amber-700">相关事件：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.relatedEvents.slice(0, 2).map((event, index) => (
                        <span key={index} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!completed && (
              <button
                onClick={handleComplete}
                className="btn btn-primary w-full"
              >
                <div className="icon-check text-sm mr-2">✅</div>
                标记为已学
              </button>
            )}

            {completed && (
              <div className="flex items-center justify-center text-[var(--success-color)] font-medium">
                <div className="icon-check-circle text-sm mr-2">✅</div>
                已完成！
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-secondary)]">
            难度：{card.difficulty}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {card.estimatedTime}
          </span>
        </div>
      </div>
    );
  } catch (error) {
    console.error('KnowledgeCard component error:', error);
    return null;
  }
}