# 快速命令参考

## 🚀 前端部署命令

### 主网站部署
```bash
# 进入目录
cd D:\worldcup-predictor\website

# 安装依赖
npm install

# 构建项目
npm run build

# 部署到生产环境
vercel --prod --force --yes
```

### 新网站部署
```bash
# 进入目录
cd D:\worldcup-predictor-new

# 安装依赖
npm install

# 构建项目
npm run build

# 部署到生产环境
vercel --prod --force --yes
```

---

## 🌐 网站地址

### 当前可用的网站：
| 名称 | 地址 | 用途 |
|------|------|------|
| **主网站** | https://website-tau-eosin-18.vercel.app | 主要使用 |
| **新网站** | https://worldcup-predictor-new.vercel.app | 备用测试 |

---

## 📂 重要文件路径

### 修改球队数据
```
D:\worldcup-predictor\website\lib\predictor.js
```

### 修改页面
```
D:\worldcup-predictor\website\pages\
├── index.js         # 首页
├── predict.js       # 预测页面
├── champion.js      # 冠军预测
├── groupstage.js    # 小组赛程
├── settings.js      # API配置
├── login.js         # 登录
└── register.js      # 注册
```

### 修改API路由
```
D:\worldcup-predictor\website\pages\api\
├── predict\
│   ├── match.js     # 比赛预测
│   └── champion.js  # 冠军预测
└── teams.js
```

---

## 🔧 本地开发

### 启动开发服务器
```bash
cd D:\worldcup-predictor\website
npm run dev
# 访问 http://localhost:3000
```

---

## ⚡ 快速修改流程

### 修改代码 → 部署
1. 修改需要的文件
2. 运行部署命令
3. 等待20-30秒
4. 访问网站验证

---

## 🔑 获取API Key的地址

| API | 获取地址 |
|-----|---------|
| Odds-API | https://the-odds-api.com/ |
| Google Gemini | https://ai.google.dev/ |
| ChatGPT | https://platform.openai.com/ |
| DeepSeek | https://platform.deepseek.com/ |

---

## 📊 核心配置文件

### package.json
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

---

**最后更新**: 2026年6月6日
