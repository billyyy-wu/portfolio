#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(currentDirectory, "..");
const fontkitModule = await import(
  "../node_modules/next/dist/compiled/@next/font/dist/fontkit/index.js"
);
const fontkitDefault = fontkitModule.default?.default ?? fontkitModule.default;
const fontFromBuffer = fontkitDefault.default || fontkitDefault;

// 源字体仅用于生成子集，放在非 public 目录，避免把 13MB 原始字体部署到线上。
const sourceFont = path.join(root, "assets", "fonts", "source", "oppo-sans-4.0.woff2");
const outputFont = path.join(root, "public", "fonts", "oppo-sans-subset.ttf");
const scanDirectories = ["app", "components", "content"].map((directory) =>
  path.join(root, directory),
);
const scanExtensions = new Set([".css", ".mdx", ".ts", ".tsx"]);

// 保留常用中文 UI 标点和备用字符，避免内容轻微变化后马上缺字。
const safeText = `
，。！？、；：“”‘’（）《》—·￥
`;
const skippedCharacters = new Set(["\u00ad", "…"]);

function shouldKeepCharacter(character) {
  return character.codePointAt(0) > 0x7f && !skippedCharacters.has(character);
}

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (scanExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectSiteText() {
  const characters = new Set(Array.from(safeText).filter(shouldKeepCharacter));

  for (const directory of scanDirectories) {
    for (const filePath of walkFiles(directory)) {
      for (const character of fs.readFileSync(filePath, "utf8")) {
        if (!shouldKeepCharacter(character)) {
          continue;
        }

        characters.add(character);
      }
    }
  }

  return Array.from(characters).sort().join("");
}

function buildSubset() {
  if (!fs.existsSync(sourceFont)) {
    throw new Error(`找不到源字体：${sourceFont}`);
  }

  const sourceBuffer = fs.readFileSync(sourceFont);
  const font = fontFromBuffer(sourceBuffer);
  const subset = font.createSubset();
  const text = collectSiteText();
  const glyphIds = new Set();

  // 仅子集化非 ASCII 字符；这份 CJK 源字体的部分 ASCII glyph 经 fontkit 子集化会异常膨胀。
  // fontkit 输出的是 TrueType 子集；文件扩展名保持为 .ttf，避免浏览器按 woff2 误判。
  for (const glyph of font.glyphsForString(text)) {
    if (glyphIds.has(glyph.id)) {
      continue;
    }

    glyphIds.add(glyph.id);
    subset.includeGlyph(glyph);
  }

  const outputBuffer = Buffer.from(subset.encode());

  if (outputBuffer.subarray(0, 4).toString("latin1") === "true") {
    // Next 字体解析器期望标准 TrueType sfnt 版本号，而不是旧式 Apple "true" 标记。
    outputBuffer.writeUInt32BE(0x00010000, 0);
  }

  fs.writeFileSync(outputFont, outputBuffer);

  const reduction = 100 - (outputBuffer.byteLength / sourceBuffer.byteLength) * 100;
  console.log(
    `已生成 ${path.relative(root, outputFont)}：${(outputBuffer.byteLength / 1024).toFixed(
      1,
    )}KB，较源字体减少 ${reduction.toFixed(1)}%。`,
  );
}

try {
  buildSubset();
} catch (error) {
  console.error(`字体子集生成失败：${error.message}`);
  process.exit(1);
}
