import { User } from '@/types';

export class UserManager {
  private currentUser: User | null = null;
  private users: Record<string, User & { password: string }> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentUser = this.loadCurrentUser();
      this.users = this.loadUsers();
    }
  }

  // 从localStorage加载当前用户
  private loadCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('historycard_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('加载当前用户失败:', error);
      return null;
    }
  }

  // 从localStorage加载所有用户
  private loadUsers(): Record<string, User & { password: string }> {
    try {
      const usersData = localStorage.getItem('historycard_users');
      return usersData ? JSON.parse(usersData) : {};
    } catch (error) {
      console.error('加载用户数据失败:', error);
      return {};
    }
  }

  // 保存用户到localStorage
  private saveUsers(): void {
    try {
      localStorage.setItem('historycard_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  }

  // 保存当前用户到localStorage
  private saveCurrentUser(user: User): void {
    try {
      localStorage.setItem('historycard_current_user', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('保存当前用户失败:', error);
    }
  }

  // 注册新用户
  async register(username: string, email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // 检查用户名是否已存在
      if (this.users[username]) {
        reject(new Error('用户名已存在'));
        return;
      }

      // 检查邮箱是否已被使用
      const existingUser = Object.values(this.users).find(user => user.email === email);
      if (existingUser) {
        reject(new Error('邮箱已被注册'));
        return;
      }

      // 创建新用户
      const newUser = {
        username,
        email,
        password: this.hashPassword(password),
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

      // 注册后自动登录
      const userForStorage: User = { ...newUser };
      delete (userForStorage as any).password;
      this.saveCurrentUser(userForStorage);

      resolve(userForStorage);
    });
  }

  // 用户登录
  async login(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = this.users[username];

      if (!user) {
        reject(new Error('用户名不存在'));
        return;
      }

      if (user.password !== this.hashPassword(password)) {
        reject(new Error('密码错误'));
        return;
      }

      // 更新最后登录时间
      user.lastLoginAt = new Date().toISOString();
      this.saveUsers();

      // 保存当前用户（不包含密码）
      const userForStorage: User = { ...user };
      delete (userForStorage as any).password;
      this.saveCurrentUser(userForStorage);

      resolve(userForStorage);
    });
  }

  // 用户登出
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('historycard_current_user');
    }
    this.currentUser = null;
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 更新用户进度
  updateUserProgress(updates: Partial<User>): boolean {
    if (!this.currentUser) return false;

    try {
      // 更新用户存储中的数据
      const user = this.users[this.currentUser.username];
      if (user) {
        Object.assign(user, updates);
        this.saveUsers();

        // 更新当前用户
        Object.assign(this.currentUser, updates);
        this.saveCurrentUser(this.currentUser);

        return true;
      }
      return false;
    } catch (error) {
      console.error('更新用户进度失败:', error);
      return false;
    }
  }

  // 标记卡片为已学习
  markCardAsLearned(cardId: string): boolean {
    if (!this.currentUser) return false;

    const updates: Partial<User> = {
      learnedCards: this.currentUser.learnedCards + 1,
      completedCards: [...(this.currentUser.completedCards || []), cardId],
      lastLoginAt: new Date().toISOString()
    };

    return this.updateUserProgress(updates);
  }

  // 切换收藏卡片
  toggleFavoriteCard(cardId: string): boolean {
    if (!this.currentUser) return false;

    const favorites = this.currentUser.favorites || [];
    let newFavorites: string[];

    if (favorites.includes(cardId)) {
      newFavorites = favorites.filter(id => id !== cardId);
    } else {
      newFavorites = [...favorites, cardId];
    }

    return this.updateUserProgress({ favorites: newFavorites });
  }

  // 简单的密码哈希（仅用于演示，生产环境请使用更安全的方法）
  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString();
  }

  // 获取用户统计信息
  getUserStats(): {
    learnedCards: number;
    favorites: number;
    streak: number;
    memberSince: string;
    lastLogin: string;
  } | null {
    if (!this.currentUser) return null;

    return {
      learnedCards: this.currentUser.learnedCards || 0,
      favorites: (this.currentUser.favorites || []).length,
      streak: this.currentUser.streak || 0,
      memberSince: this.formatDate(this.currentUser.createdAt),
      lastLogin: this.formatDate(this.currentUser.lastLoginAt)
    };
  }

  // 格式化日期显示
  private formatDate(dateString?: string): string {
    if (!dateString) return '未知';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN');
    } catch {
      return '未知';
    }
  }
}

// 导出单例实例
export const userManager = new UserManager();

// 导出便捷函数
export async function registerUser(username: string, email: string, password: string): Promise<User> {
  return await userManager.register(username, email, password);
}

export async function loginUser(username: string, password: string): Promise<User> {
  return await userManager.login(username, password);
}

export function logoutUser(): void {
  userManager.logout();
}

export function getCurrentUser(): User | null {
  return userManager.getCurrentUser();
}

export function isUserLoggedIn(): boolean {
  return userManager.isLoggedIn();
}

export function markCardAsLearned(cardId: string): boolean {
  return userManager.markCardAsLearned(cardId);
}

export function toggleFavoriteCard(cardId: string): boolean {
  return userManager.toggleFavoriteCard(cardId);
}

export function getUserStats() {
  return userManager.getUserStats();
}