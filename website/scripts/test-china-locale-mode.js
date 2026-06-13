const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const layout = fs.readFileSync(path.join(root, 'components/Layout.js'), 'utf8');
const localizer = fs.readFileSync(path.join(root, 'components/ChineseLocalizer.js'), 'utf8');
const buildCn = fs.readFileSync(path.join(root, 'scripts/build-cn.ps1'), 'utf8');
const deployCn = fs.readFileSync(path.join(root, 'scripts/deploy-cn-server.sh'), 'utf8');

assert(layout.includes('ChineseLocalizer'), 'Layout mounts ChineseLocalizer');
assert(localizer.includes("NEXT_PUBLIC_SITE_LOCALE === 'zh-CN'"), 'Chinese locale env switch exists');
assert(localizer.includes('世界杯 AI 概率研究平台'), 'Chinese product name exists');
assert(localizer.includes('比赛预测'), 'Chinese navigation exists');
assert(localizer.includes('仅用于足球数据分析'), 'Chinese compliance copy exists');
assert(localizer.includes('自动实时数据'), 'Chinese live automation copy exists');
assert(buildCn.includes('NEXT_PUBLIC_SITE_LOCALE'), 'Windows CN build script sets locale');
assert(deployCn.includes('NEXT_PUBLIC_SITE_LOCALE=zh-CN npm run build'), 'server deploy script builds Chinese bundle');

console.log('PASS China locale mode is wired and Vercel remains English by default.');
