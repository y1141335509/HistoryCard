// Simple user management system using localStorage
class UserManager {
  constructor() {
    this.currentUser = this.loadCurrentUser();
    this.users = this.loadUsers();
  }

  // Load current user from localStorage
  loadCurrentUser() {
    try {
      const userData = localStorage.getItem('historycard_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to load current user:', error);
      return null;
    }
  }

  // Load all users from localStorage
  loadUsers() {
    try {
      const usersData = localStorage.getItem('historycard_users');
      return usersData ? JSON.parse(usersData) : {};
    } catch (error) {
      console.error('Failed to load users:', error);
      return {};
    }
  }

  // Save users to localStorage
  saveUsers() {
    try {
      localStorage.setItem('historycard_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  // Save current user to localStorage
  saveCurrentUser(user) {
    try {
      localStorage.setItem('historycard_current_user', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Failed to save current user:', error);
    }
  }

  // Register a new user
  async register(username, email, password) {
    return new Promise((resolve, reject) => {
      // Check if username already exists
      if (this.users[username]) {
        reject(new Error('Username already exists'));
        return;
      }

      // Check if email is already used (simple check)
      const existingUser = Object.values(this.users).find(user => user.email === email);
      if (existingUser) {
        reject(new Error('Email already registered'));
        return;
      }

      // Create new user
      const newUser = {
        username,
        email,
        password: this.hashPassword(password), // Simple hash for demo
        createdAt: new Date().toISOString(),
        learnedCards: 0,
        streak: 0,
        favorites: [],
        completedCards: [],
        totalStudyTime: 0,
        lastLoginAt: new Date().toISOString()
      };

      this.users[username] = newUser;
      this.saveUsers();

      // Auto-login after registration
      const userForStorage = { ...newUser };
      delete userForStorage.password; // Don't store password in current user
      this.saveCurrentUser(userForStorage);

      resolve(userForStorage);
    });
  }

  // Login user
  async login(username, password) {
    return new Promise((resolve, reject) => {
      const user = this.users[username];

      if (!user) {
        reject(new Error('Username not found'));
        return;
      }

      if (user.password !== this.hashPassword(password)) {
        reject(new Error('Invalid password'));
        return;
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.saveUsers();

      // Save current user (without password)
      const userForStorage = { ...user };
      delete userForStorage.password;
      this.saveCurrentUser(userForStorage);

      resolve(userForStorage);
    });
  }

  // Logout user
  logout() {
    localStorage.removeItem('historycard_current_user');
    this.currentUser = null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Update user progress
  updateUserProgress(updates) {
    if (!this.currentUser) return false;

    try {
      // Update in users storage
      const user = this.users[this.currentUser.username];
      if (user) {
        Object.assign(user, updates);
        this.saveUsers();

        // Update current user
        Object.assign(this.currentUser, updates);
        this.saveCurrentUser(this.currentUser);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update user progress:', error);
      return false;
    }
  }

  // Add card to learned cards
  markCardAsLearned(cardId) {
    if (!this.currentUser) return false;

    const updates = {
      learnedCards: this.currentUser.learnedCards + 1,
      completedCards: [...(this.currentUser.completedCards || []), cardId],
      lastStudyAt: new Date().toISOString()
    };

    return this.updateUserProgress(updates);
  }

  // Toggle favorite card
  toggleFavoriteCard(cardId) {
    if (!this.currentUser) return false;

    const favorites = this.currentUser.favorites || [];
    let newFavorites;

    if (favorites.includes(cardId)) {
      newFavorites = favorites.filter(id => id !== cardId);
    } else {
      newFavorites = [...favorites, cardId];
    }

    return this.updateUserProgress({ favorites: newFavorites });
  }

  // Simple password hashing for demo (NOT secure for production)
  hashPassword(password) {
    // This is just for demo purposes - use proper hashing in production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Get user statistics
  getUserStats() {
    if (!this.currentUser) return null;

    return {
      learnedCards: this.currentUser.learnedCards || 0,
      favorites: (this.currentUser.favorites || []).length,
      streak: this.currentUser.streak || 0,
      memberSince: this.formatDate(this.currentUser.createdAt),
      lastLogin: this.formatDate(this.currentUser.lastLoginAt)
    };
  }

  // Format date for display
  formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  }
}

// Export singleton instance
const userManager = new UserManager();

// Export functions for use in components
async function registerUser(username, email, password) {
  return await userManager.register(username, email, password);
}

async function loginUser(username, password) {
  return await userManager.login(username, password);
}

function logoutUser() {
  userManager.logout();
}

function getCurrentUser() {
  return userManager.getCurrentUser();
}

function isUserLoggedIn() {
  return userManager.isLoggedIn();
}

function markCardAsLearned(cardId) {
  return userManager.markCardAsLearned(cardId);
}

function toggleFavoriteCard(cardId) {
  return userManager.toggleFavoriteCard(cardId);
}

function getUserStats() {
  return userManager.getUserStats();
}