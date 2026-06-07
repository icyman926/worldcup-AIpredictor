# 世界杯预测系统 - 完整部署指南

## 📋 项目概述

这是一个完整的2026年世界杯预测系统，包含48支球队数据、比赛预测、冠军预测等功能。

---

## 📁 项目结构

### 前端项目（主项目）
```
D:\worldcup-predictor\website\
├── pages/                    # 页面文件
│   ├── index.js             # 首页
│   ├── predict.js           # 比赛预测页面
│   ├── champion.js          # 冠军预测页面
│   ├── groupstage.js        # 小组赛程页面
│   ├── login.js             # 登录页面
│   ├── register.js          # 注册页面
│   ├── settings.js          # API配置页面
│   ├── about.js             # 关于页面
│   └── howto.js             # 使用指南
├── components/              # 组件
│   └── Layout.js            # 布局组件
├── lib/                     # 工具函数
│   └── predictor.js         # 预测模型和数据
├── pages/api/               # API路由
│   ├── predict/
│   │   ├── match.js         # 比赛预测API
│   │   └── champion.js      # 冠军预测API
│   └── teams.js             # 球队数据API
├── styles/                  # 样式
│   └── globals.css
├── public/                  # 静态资源
├── next.config.js           # Next.js配置
├── package.json             # 依赖配置
├── tailwind.config.js       # Tailwind配置
└── postcss.config.js        # PostCSS配置
```

### 新网站项目
```
D:\worldcup-predictor-new\
├── pages/
├── components/
├── lib/
└── ... (与上面结构相同)
```

### 后端项目
```
D:\worldcup-predictor\backend\
├── app/
│   ├── main.py              # FastAPI主文件
│   └── services/
│       └── odds_analyzer.py # 赔率分析服务
└── ...
```

---

## 🚀 部署流程

### 1. 前端部署（Vercel）

#### 步骤1：进入项目目录
```bash
cd D:\worldcup-predictor\website
```

#### 步骤2：安装依赖
```bash
npm install
```

#### 步骤3：构建项目
```bash
npm run build
```

#### 步骤4：部署到Vercel
```bash
# 首次部署需要登录
vercel login

# 开发环境部署
vercel

# 生产环境部署
vercel --prod --force --yes
```

### 2. 新网站部署
```bash
cd D:\worldcup-predictor-new
npm install
npm run build
vercel --prod --force --yes
```

---

## 🌐 当前部署的网站

| 项目 | 访问地址 | 状态 |
|------|---------|------|
| **主网站** | https://website-tau-eosin-18.vercel.app | ✅ 正常 |
| **新网站** | https://worldcup-predictor-new.vercel.app | ✅ 正常 |

---

## 🔑 API配置说明

### 在Settings页面配置的API：

1. **Google Gemini** - 高级比赛分析
   - 获取地址：https://ai.google.dev/

2. **OpenAI ChatGPT** - 增强预测分析
   - 获取地址：https://platform.openai.com/

3. **DeepSeek** - 专业赔率分析
   - 获取地址：https://platform.deepseek.com/

4. **Odds-API** ⭐ 最重要 - 实时赔率数据
   - 获取地址：https://the-odds-api.com/
   - 免费版：10次请求/月
   - 付费版：$9-$149/月

---

## 📊 预测模型说明

### 模型权重分配
- **赔率隐含概率**: 35% (最重要)
- **泊松分布模型**: 30%
- **Elo评级系统**: 25%
- **定性因素**: 10%

### 核心文件
- [predictor.js](file:///D:/worldcup-predictor/website/lib/predictor.js) - 预测算法和数据
- [match.js](file:///D:/worldcup-predictor/website/pages/api/predict/match.js) - 比赛预测API
- [champion.js](file:///D:/worldcup-predictor/website/pages/api/predict/champion.js) - 冠军预测API

---

## 🎯 核心功能

### 1. 用户系统
- ✅ 登录/注册
- ✅ 本地存储用户信息

### 2. 预测功能
- ✅ 比赛胜负预测
- ✅ 比分概率分析
- ✅ 冠军预测
- ✅ 主场优势自动判断

### 3. 数据展示
- ✅ 48支球队信息（含国旗）
- ✅ 12个小组分组
- ✅ 真实比赛赛程
- ✅ 比赛场地显示

### 4. API集成
- ✅ 可配置多个AI API
- ✅ 本地模型无需API也能预测

---

## 📝 重要数据文件

### 球队数据
- **文件**: [predictor.js](file:///D:/worldcup-predictor/website/lib/predictor.js)
- **变量**: `WORLD_CUP_2026_TEAMS`
- **说明**: 48支球队的ELO评分、分组、国旗等

### 赛程数据
- **文件**: [predictor.js](file:///D:/worldcup-predictor/website/lib/predictor.js)
- **变量**: `GROUP_STAGES`
- **说明**: 小组赛程、时间、场地

### 国家/场地对应关系
- **说明**: 用于判断主场优势
- **场地分布**: 
  - 美国: 11座场地
  - 墨西哥: 3座场地
  - 加拿大: 2座场地

---

## 🔧 本地开发

### 启动开发服务器
```bash
cd D:\worldcup-predictor\website
npm run dev
# 访问 http://localhost:3000
```

### 修改后重新部署
```bash
# 1. 修改代码
# 2. 重新构建
npm run build
# 3. 部署
vercel --prod --force --yes
```

---

## 💡 常见问题

### Q: 网站显示404错误？
A: 强制刷新浏览器缓存或重新部署

### Q: 国旗不显示？
A: 
- 确保数据文件中包含flag字段
- 检查浏览器是否支持emoji
- 强制刷新页面

### Q: 预测结果不准确？
A: 
- 配置Odds-API Key获取真实赔率数据
- 调整模型权重（在predictor.js中）

### Q: 如何修改ELO评分？
A: 在[predictor.js](file:///D:/worldcup-predictor/website/lib/predictor.js)中修改`WORLD_CUP_2026_TEAMS`数组的elo字段

---

## 📅 明天继续调整的提示

1. **检查部署状态**: 先访问现有网站确认功能正常
2. **修改代码**: 在本地修改后重新构建和部署
3. **测试功能**: 逐一测试所有页面功能
4. **API配置**: 在Settings页面测试API集成
5. **数据调整**: 根据需要修改球队数据和赛程

---

## 📞 技术栈

- **前端**: Next.js 14.0.4 + React 18 + Tailwind CSS
- **部署**: Vercel
- **后端**: FastAPI (Python)
- **数据**: 本地JSON数据
- **AI集成**: Gemini, ChatGPT, DeepSeek, Odds-API

---

## ✅ 当前状态

- [x] 网站正常部署
- [x] 所有页面可访问
- [x] 国旗显示正常
- [x] 预测功能正常
- [x] API配置页面可用
- [x] 真实48支球队数据
- [x] 真实赛程和场地数据

---

**最后更新**: 2026年6月6日
