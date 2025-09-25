function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  try {
    const [isLoginMode, setIsLoginMode] = React.useState(true);
    const [formData, setFormData] = React.useState({
      username: '',
      email: '',
      password: ''
    });
    const [loading, setLoading] = React.useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (isLoginMode) {
          await onLogin(formData.username, formData.password);
        } else {
          await onRegister(formData.username, formData.email, formData.password);
        }
        onClose();
      } catch (error) {
        console.error('Authentication error:', error);
        alert(error.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    const resetForm = () => {
      setFormData({ username: '', email: '', password: '' });
      setIsLoginMode(!isLoginMode);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-name="auth-modal">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {isLoginMode ? '欢迎回来' : '加入历史卡片'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                密码
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[var(--primary-color)] text-white hover:bg-blue-700'
              }`}
            >
              {loading ? '请稍候...' : (isLoginMode ? '登录' : '创建账户')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {isLoginMode ? "还没有账户？" : "已有账户？"}
              <button
                onClick={resetForm}
                className="ml-1 text-[var(--primary-color)] hover:underline font-medium"
              >
                {isLoginMode ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>

          {isLoginMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>演示账户：</strong> 使用任意用户名/密码来试用应用
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthModal component error:', error);
    return null;
  }
}