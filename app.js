class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('home');
    const [cards, setCards] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [user, setUser] = React.useState(() => {
      // Initialize from localStorage or use guest user
      return getCurrentUser() || {
        username: 'Guest',
        learnedCards: 0,
        streak: 0,
        favorites: []
      };
    });

    React.useEffect(() => {
      loadInitialCards();
    }, []);

    const loadInitialCards = async () => {
      setLoading(true);
      try {
        const initialCards = await generateKnowledgeCards('Ancient Roman Empire');
        setCards(initialCards);
      } catch (error) {
        console.error('Failed to load initial cards:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = async (query) => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const newCards = await generateKnowledgeCards(query);
        setCards(newCards);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    // User authentication handlers
    const handleLogin = async (username, password) => {
      try {
        const loggedInUser = await loginUser(username, password);
        setUser(loggedInUser);
        setShowAuthModal(false);
      } catch (error) {
        throw error; // Re-throw to be handled by AuthModal
      }
    };

    const handleRegister = async (username, email, password) => {
      try {
        const newUser = await registerUser(username, email, password);
        setUser(newUser);
        setShowAuthModal(false);
      } catch (error) {
        throw error; // Re-throw to be handled by AuthModal
      }
    };

    const handleLogout = () => {
      logoutUser();
      setUser({
        username: 'Guest',
        learnedCards: 0,
        streak: 0,
        favorites: []
      });
      setCurrentView('home');
    };

    const handleCardComplete = (cardId) => {
      if (isUserLoggedIn()) {
        markCardAsLearned(cardId);
        const updatedUser = getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
      } else {
        // For guest users, just update local state
        setUser(prev => ({
          ...prev,
          learnedCards: prev.learnedCards + 1
        }));
      }
    };

    const handleFavorite = (cardId) => {
      if (isUserLoggedIn()) {
        toggleFavoriteCard(cardId);
        const updatedUser = getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
      } else {
        // For guest users, just update local state
        setUser(prev => ({
          ...prev,
          favorites: prev.favorites.includes(cardId)
            ? prev.favorites.filter(id => id !== cardId)
            : [...prev.favorites, cardId]
        }));
      }
    };

    return (
      <div className="min-h-screen bg-[var(--surface-color)]" data-name="app" data-file="app.js">
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-6">
          {currentView === 'home' && (
            <div className="space-y-8">
              <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-gradient mb-4">
                  通过互动卡片探索历史
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                  通过AI生成的互动学习卡片探索历史事件、文明和传奇人物。从古代帝国到现代革命。
                </p>
              </div>

              <SearchBar onSearch={handleSearch} />

              <DailyDigest cards={cards.slice(0, 3)} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  cards.map(card => (
                    <KnowledgeCard
                      key={card.id}
                      card={card}
                      isFavorite={user.favorites.includes(card.id)}
                      onComplete={() => handleCardComplete(card.id)}
                      onFavorite={() => handleFavorite(card.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {currentView === 'quiz' && (
            <QuizMode 
              cards={cards} 
              onComplete={handleCardComplete}
            />
          )}

          {currentView === 'profile' && (
            <UserProfile 
              user={user}
              favoriteCards={cards.filter(card => user.favorites.includes(card.id))}
            />
          )}
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);