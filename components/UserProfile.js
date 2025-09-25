function UserProfile({ user, favoriteCards }) {
  try {
    return (
      <div className="max-w-4xl mx-auto space-y-6" data-name="user-profile" data-file="components/UserProfile.js">
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
              <div className="icon-user text-2xl text-white"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h2>
              <p className="text-[var(--text-secondary)]">Lifelong Learner</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="icon-brain text-3xl text-[var(--primary-color)] mb-2"></div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{user.learnedCards}</div>
              <div className="text-sm text-[var(--text-secondary)]">Cards Learned</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="icon-flame text-3xl text-[var(--warning-color)] mb-2"></div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{user.streak}</div>
              <div className="text-sm text-[var(--text-secondary)]">Day Streak</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="icon-heart text-3xl text-red-500 mb-2"></div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{user.favorites.length}</div>
              <div className="text-sm text-[var(--text-secondary)]">Favorites</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Learning Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Weekly Goal</span>
                <span className="text-[var(--text-primary)]">{user.learnedCards}/20 cards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-[var(--success-color)] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((user.learnedCards / 20) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Learning Consistency</span>
                <span className="text-[var(--text-primary)]">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[var(--secondary-color)] h-3 rounded-full w-[85%] transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {favoriteCards.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Favorite Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteCards.map(card => (
                <div key={card.id} className="bg-gray-50 rounded-lg p-4">
                  <span className="text-xs font-medium text-[var(--primary-color)] bg-blue-50 px-2 py-1 rounded-full">
                    {card.category}
                  </span>
                  <h4 className="font-medium text-[var(--text-primary)] mt-2">{card.question}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('UserProfile component error:', error);
    return null;
  }
}
