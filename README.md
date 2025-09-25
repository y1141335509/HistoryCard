# 历史卡片 - AI驱动的历史学习平台

基于Claude API的AI历史教育平台，生成关于历史事件、文明和人物的互动知识卡片。

## ✨ 功能特色

- 🏛️ **AI生成历史卡片** - 基于Claude API生成准确的历史内容
- 📚 **互动式学习** - 问答格式，包含解释和背景信息
- 🗓️ **历史时期分类** - 按时代分类（古代、中世纪、文艺复兴、现代等）
- 👥 **关键人物与事件** - 历史人物和事件之间的联系
- 📱 **响应式设计** - 适配桌面端和移动端
- ⭐ **收藏系统** - 保存和追踪喜爱的历史话题
- 🔥 **学习进度** - 追踪学习天数和完成卡片数

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Claude API密钥（来自Anthropic）
- 现代浏览器

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd HistoryCard
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 为 `.env.local`
   - 添加你的Claude API密钥：
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 打开浏览器访问 `http://localhost:3000`

### Vercel部署

1. **推送到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 连接你的GitHub仓库
   - 配置环境变量 `ANTHROPIC_API_KEY`

3. **自动部署**
   - Vercel会自动检测Next.js项目并部署
   - 每次推送代码都会自动重新部署

## 💡 使用方法

1. **浏览默认卡片**: 从古罗马帝国卡片开始
2. **搜索历史主题**: 使用搜索栏探索特定历史话题
3. **互动学习**: 点击"查看答案"查看解释
4. **追踪进度**: 标记卡片为已学以追踪进度
5. **收藏卡片**: 使用心形图标收藏感兴趣的卡片

### 推荐搜索主题

- "第二次世界大战"
- "古埃及金字塔"
- "文艺复兴艺术"
- "拿破仑·波拿巴"
- "中世纪骑士"
- "中国朝代"

## 🏗️ 项目结构

```
HistoryCard/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 主页面
│   ├── components/        # React组件
│   │   └── Header.tsx     # 导航头部
│   ├── lib/              # 工具库
│   │   ├── claude-api.ts  # Claude API集成
│   │   └── user-manager.ts # 用户管理
│   └── types/            # TypeScript类型定义
│       └── index.ts
├── package.json          # 项目配置
├── tailwind.config.js    # Tailwind配置
├── next.config.js        # Next.js配置
└── vercel.json           # Vercel部署配置
```

## 🔌 API集成

应用使用Claude API（Haiku模型）生成历史内容，具有：

- **准确的历史事实和日期**
- **引人入胜的问题和解释**
- **历史背景和联系**
- **多选测验选项**
- **关键人物和相关事件**

## 🛣️ 开发路线图

### 第一阶段 ✅ 已完成
- [x] Claude API集成
- [x] 历史专业分类
- [x] 增强的卡片内容和历史背景
- [x] 中文界面
- [x] 现代技术栈（Next.js + Tailwind）
- [x] 用户认证系统
- [x] Vercel部署配置

### 第二阶段 🚧 进行中
- [ ] 历史时间线组件
- [ ] 人物关系网络图
- [ ] 结构化知识库
- [ ] 高级搜索功能

### 第三阶段 📋 计划中
- [ ] 高级可视化
- [ ] 离线模式
- [ ] 移动端APP
- [ ] 社区功能

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Heroicons
- **部署**: Vercel
- **AI**: Claude API (Anthropic)

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 💬 支持

如遇问题或疑问：

1. 查看现有的GitHub Issues
2. 创建新的Issue并提供详细信息
3. 包含错误信息和浏览器控制台日志

---

**注意**: 此应用需要来自Anthropic的有效Claude API密钥。API使用将根据Anthropic的定价收费。

## 🌐 在线体验

- **演示地址**: [https://history-card.vercel.app](https://history-card.vercel.app)
- **状态页面**: [https://vercel.com/status](https://vercel.com/status)