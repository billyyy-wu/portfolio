#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(currentDirectory, "..");

// 源字体仅用于生成子集，放在非 public 目录，避免把 13MB 原始字体部署到线上。
const sourceFont = path.join(root, "assets", "fonts", "source", "oppo-sans-4.0.woff2");
const outputFont = path.join(root, "public", "fonts", "oppo-sans-subset.woff2");
const scanDirectories = ["astro", "content"].map((directory) => path.join(root, directory));
const scanExtensions = new Set([".astro", ".css", ".js", ".mdx", ".mjs", ".ts"]);

// 保留常用中文 UI 标点和备用字符，避免内容轻微变化后马上缺字。
const safeText = `
，。！？、；：“”‘’（）《》—·￥
`;
const skippedCharacters = new Set(["\u00ad", "…", "・"]);
const safeCharacters = new Set(Array.from(safeText).filter((character) => character.trim()));

function shouldKeepCharacter(character) {
  const codePoint = character.codePointAt(0);
  const isCjkCharacter =
    (codePoint >= 0x2e80 && codePoint <= 0x9fff) || (codePoint >= 0xf900 && codePoint <= 0xfaff);

  return !skippedCharacters.has(character) && (isCjkCharacter || safeCharacters.has(character));
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
  const text = collectSiteText();

  if (!text) {
    throw new Error("未收集到可用于字体子集化的字符。");
  }

  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "oppo-font-subset-"));
  const textFile = path.join(temporaryDirectory, "subset-text.txt");

  try {
    fs.writeFileSync(textFile, text);

    const result = spawnSync(
      "python3",
      [
        "-m",
        "fontTools.subset",
        sourceFont,
        `--output-file=${outputFont}`,
        "--flavor=woff2",
        `--text-file=${textFile}`,
        "--layout-features=*",
        "--recommended-glyphs",
      ],
      {
        encoding: "utf8",
      },
    );

    if (result.status !== 0) {
      throw new Error(
        [
          result.stderr.trim(),
          "请先安装字体工具链：python3 -m pip install --user fonttools brotli",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }

  const outputBuffer = fs.readFileSync(outputFont);

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
