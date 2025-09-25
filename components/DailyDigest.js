function DailyDigest({ cards }) {
  try {
    if (!cards || cards.length === 0) {
      return null;
    }

    return (
      <div className="max-w-4xl mx-auto" data-name="daily-digest" data-file="components/DailyDigest.js">
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-[var(--primary-color)]">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
              <div className="icon-calendar text-lg text-white"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Today's Knowledge Digest</h2>
              <p className="text-[var(--text-secondary)] text-sm">Your daily dose of learning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.slice(0, 3).map((card, index) => (
              <div key={card.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <span className="w-6 h-6 bg-[var(--secondary-color)] text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium text-[var(--primary-color)]">{card.category}</span>
                </div>
                <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1">{card.question}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{card.estimatedTime}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              <div className="icon-lightbulb text-[var(--warning-color)] inline mr-1"></div>
              Start your learning journey with these hand-picked cards!
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DailyDigest component error:', error);
    return null;
  }
}