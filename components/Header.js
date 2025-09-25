function Header({ currentView, setCurrentView, user, onAuthClick, onLogout }) {
  try {
    const isLoggedIn = user && user.username;

    return (
      <header className="bg-white border-b border-[var(--border-color)] sticky top-0 z-50" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-history text-lg text-white">🏛️</div>
              </div>
              <span className="text-xl font-bold text-gradient">HistoryCard</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('home')}
                className={`font-medium transition-colors ${
                  currentView === 'home'
                    ? 'text-[var(--primary-color)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-color)]'
                }`}
              >
                首页
              </button>
              <button
                onClick={() => setCurrentView('quiz')}
                className={`font-medium transition-colors ${
                  currentView === 'quiz'
                    ? 'text-[var(--primary-color)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-color)]'
                }`}
              >
                测验模式
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'text-[var(--primary-color)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-color)]'
                }`}
              >
                个人资料
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                    <div className="icon-flame text-[var(--warning-color)]">🔥</div>
                    <span>连续学习 {user.streak || 0} 天</span>
                  </div>

                  <div className="relative group">
                    <div className="w-8 h-8 bg-[var(--secondary-color)] rounded-full flex items-center justify-center cursor-pointer">
                      <div className="icon-user text-sm text-white">👤</div>
                    </div>

                    {/* User dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-medium text-[var(--text-primary)]">{user.username}</p>
                        <p className="text-sm text-[var(--text-secondary)]">已学习 {user.learnedCards || 0} 张卡片</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => setCurrentView('profile')}
                          className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 rounded"
                        >
                          查看资料
                        </button>
                        <button
                          onClick={onLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          退出登录
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="btn btn-primary"
                >
                  登录
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}