// 把原图处理成网站用的头图：缩到 1600px 宽，右下角加半透明署名水印，
// 写到 src/assets/hero-oc.jpg。原图留在自己电脑上，不要放进仓库。
//
// 用法：npm run hero -- <原图路径>

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import sharp from 'sharp';

const WIDTH = 1600;
const TEXT = '© Altina';
const OUTPUT = 'src/assets/hero-oc.jpg';
// 和站名用同一个字体
const FONT_WOFF = 'node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff';
const FONT_NAME = 'Cormorant Garamond Semi-Bold Italic';

const input = process.argv[2];
if (!input) {
  console.error('用法：npm run hero -- <原图路径>');
  process.exit(1);
}

/** Pango 只认 TTF/OTF，把 WOFF 解包成 TTF（每张表 zlib 解压后按原顺序排好） */
function woffToTtf(woff) {
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const entry = 44 + i * 20;
    const offset = woff.readUInt32BE(entry + 4);
    const compLength = woff.readUInt32BE(entry + 8);
    const origLength = woff.readUInt32BE(entry + 12);
    const raw = woff.subarray(offset, offset + compLength);
    tables.push({
      tag: woff.readUInt32BE(entry),
      checksum: woff.readUInt32BE(entry + 16),
      data: compLength < origLength ? inflateSync(raw) : raw,
    });
  }

  const pad4 = (n) => (n + 3) & ~3;
  const headerSize = 12 + numTables * 16;
  const ttf = Buffer.alloc(headerSize + tables.reduce((sum, t) => sum + pad4(t.data.length), 0));
  const entrySelector = Math.floor(Math.log2(numTables));
  const searchRange = 2 ** entrySelector * 16;
  ttf.writeUInt32BE(flavor, 0);
  ttf.writeUInt16BE(numTables, 4);
  ttf.writeUInt16BE(searchRange, 6);
  ttf.writeUInt16BE(entrySelector, 8);
  ttf.writeUInt16BE(numTables * 16 - searchRange, 10);

  let offset = headerSize;
  tables.forEach((table, i) => {
    const record = 12 + i * 16;
    ttf.writeUInt32BE(table.tag, record);
    ttf.writeUInt32BE(table.checksum, record + 4);
    ttf.writeUInt32BE(offset, record + 8);
    ttf.writeUInt32BE(table.data.length, record + 12);
    table.data.copy(ttf, offset);
    offset += pad4(table.data.length);
  });
  return ttf;
}

const fontfile = join(mkdtempSync(join(tmpdir(), 'hero-font-')), 'cormorant.ttf');
writeFileSync(fontfile, woffToTtf(readFileSync(FONT_WOFF)));

const renderText = (color, alpha, size) =>
  sharp({
    text: {
      text: `<span foreground="${color}" fgalpha="${alpha}">${TEXT}</span>`,
      font: `${FONT_NAME} ${size}`,
      fontfile,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });

const meta = await sharp(input).metadata();
const width = Math.min(WIDTH, meta.width);
const height = Math.round((meta.height * width) / meta.width);

// 字号和边距随图片宽度缩放
const size = Math.round(width * 0.026);
const margin = Math.round(width * 0.025);

const text = await renderText('#ffffff', '62%', size);
// 下面垫一层模糊的深色，在亮的地方也看得清
const shadow = await sharp((await renderText('#0a0819', '55%', size)).data)
  .blur(2)
  .toBuffer();

const left = width - margin - text.info.width;
const top = height - margin - text.info.height;

await sharp(input)
  .resize({ width })
  .composite([
    { input: shadow, left: left + 1, top: top + 2 },
    { input: text.data, left, top },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`已生成 ${OUTPUT}（${width}×${height}，水印「${TEXT}」）`);
