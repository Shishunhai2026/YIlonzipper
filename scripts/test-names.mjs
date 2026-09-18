import { readdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('../doc/dgyilon产品资料库/07_产品图片');

const GLOSSARY = [
  ['脖套', 'neck-seal'], ['袖套', 'sleeve-seal'], ['主图', 'main'],
  ['产品图', 'product'], ['应用场景', 'application'],
];

const PINYIN = {
  一: 'yi', 二: 'er', 三: 'san', 四: 'si', 五: 'wu', 六: 'liu', 七: 'qi', 八: 'ba',
  九: 'jiu', 十: 'shi', 号: 'size', 双: 'double', 闭: 'closed', 单: 'single',
  拉头: 'slider', 拉链: 'zipper', 牌: 'puller', 橙: 'orange', 色: 'color',
  内: 'inner', 外: 'outer', 宽: 'wide', 黑: 'black', 白: 'white', 红: 'red',
  蓝: 'blue', 绿: 'green', 灰: 'grey', 黄: 'yellow', 米: 'beige',
  密: 'sealed', 封: 'seal', 开: 'open', 尾: 'end', 头: 'head',
  注塑: 'molded', 金: 'metal', 属: 'metal', 胶: 'plastic', 牙: 'tooth',
  织: 'woven', 带: 'tape', 反: 'reverse', 装: 'reverse', 长: 'long',
  短: 'short', 大: 'large', 小: 'small', 加: 'plus', 特: 'special',
};

function destName(file) {
  const base = path.basename(file, path.extname(file));
  const prefix = (base.match(/^(\d+)_/) || [])[1];
  let rest = base.replace(/^\d+_/, '');
  for (const [zh, en] of GLOSSARY) rest = rest.split(zh).join(en);
  const shot = (rest.match(/_(\d+)$/) || [])[1] ?? '';
  rest = rest.replace(/_\d+$/, '');
  let latin = rest.replace(/[A-Za-z0-9]+/g, ' ').trim();
  if (!/[A-Za-z]/.test(latin)) {
    latin = [...rest].map((ch) => PINYIN[ch] ?? (/[a-z0-9]/i.test(ch) ? ch : '')).join(' ');
  }
  let slug = latin.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  if (!slug) slug = 'detail';
  const parts = [prefix, slug, shot].filter(Boolean);
  return `${parts.join('-')}.webp`;
}

const all = [];
for (const pd of await readdir(SRC, { withFileTypes: true })) {
  if (!pd.isDirectory()) continue;
  for (const kind of await readdir(path.join(SRC, pd.name), { withFileTypes: true })) {
    if (!kind.isDirectory()) continue;
    const dir = path.join(SRC, pd.name, kind.name);
    for (const f of await readdir(dir)) {
      all.push({ key: `${pd.name}/${kind.name}`, file: f, out: destName(f) });
    }
  }
}

// collision check within each folder
const byFolder = {};
for (const a of all) (byFolder[a.key] ??= []).push(a.out);
let collisions = 0;
for (const [k, names] of Object.entries(byFolder)) {
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length) {
    collisions += dupes.length;
    console.log(`COLLISION in ${k}:`, [...new Set(dupes)].slice(0, 5));
  }
}
console.log('total files:', all.length, 'collisions:', collisions);
console.log('\n--- samples ---');
for (const a of all.filter((x) => x.key.includes('细分型号')).slice(0, 6)) console.log(`  ${a.file}  ->  ${a.out}`);
for (const a of all.filter((x) => x.key.includes('规格图')).slice(0, 3)) console.log(`  ${a.file}  ->  ${a.out}`);
for (const a of all.filter((x) => x.key.includes('产品图')).slice(0, 4)) console.log(`  ${a.file}  ->  ${a.out}`);
