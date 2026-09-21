// Gera versões .webp otimizadas das imagens usadas no site.
// Os originais ficam em assets-originais/ e não vão para o site.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Lê os masters em assets-originais/ e escreve os .webp servidos em public/images/.
const SRC_DIR = 'assets-originais/images';
const OUT_DIR = 'public/images';

// [arquivo, largura grande, largura mobile, nome de saída opcional]
const MANIFEST = [
  ['PRODUTOS.jpg', 1800, 900],
  ['herobg.jpg', 1800, 0],
  ['herobgmobile.jpg', 900, 0],
  ['ioncenterkitchen.jpeg', 1400, 800],
  ['consultor-hero.png', 1400, 800],
  ['SLIMIMG.jpg', 900, 500],
  ['SMARTIMG.jpg', 900, 500],
  ['TURBOIMG.jpg', 900, 500],
  ['FAUCET.png', 900, 500],
  ['GOURMET.png', 900, 500],
  ['CAPTACAO.png', 1100, 700],
  ['TRATAMENTO.png', 1100, 700],
  ['DISTRIBUICAO.png', 1100, 700],
  ['RESERVATORIOS.png', 1100, 700],
  ['CONSUMO.jpg', 1100, 700],
  ['MAX.png', 800, 460],
  ['CARBON.png', 800, 460],
  ['BLOCK.png', 800, 460],
  ['ALKA.png', 800, 460],
  ['white01.png', 900, 520],
  ['white02.png', 900, 520],
  ['black01.png', 900, 520],
  ['black02.png', 900, 520],
  ['GALAO_FILTRO_CAIXA.png', 1200, 700],
  ['PH.png', 840, 500],
  ['LOGO.png', 240, 0],
  ['fitpng.png', 240, 0],
  ['bionlife/colchao (1).png', 1448, 800, 'bionlife-benefits'],
  ['bionlife/colchao (2).png', 1448, 800, 'bionlife-layers'],
  ['bionlife/colchao (3).png', 1448, 800, 'bionlife-hero'],
  ['bionlife/colchao (4).png', 1100, 640, 'bionlife-dream'],
  ['bionlife/colchao (5).png', 1100, 640, 'bionlife-sense-pro'],
  ['bionlife/colchao (6).png', 1100, 640, 'bionlife-elite'],
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0;
let after = 0;

for (const [file, wideWidth, smallWidth, outputName] of MANIFEST) {
  const src = path.join(SRC_DIR, file);
  const base = outputName ?? path.basename(file).replace(/\.(png|jpe?g)$/i, '');
  const input = await readFile(src);
  before += input.length;

  const meta = await sharp(input).metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  const variants = [[`${base}.webp`, wideWidth]];
  if (smallWidth) variants.push([`${base}-sm.webp`, smallWidth]);

  for (const [name, width] of variants) {
    const out = await sharp(input)
      .resize({ width: Math.min(width, meta.width ?? width), withoutEnlargement: true })
      .webp({ quality: hasAlpha ? 82 : 78, effort: 6, alphaQuality: 90 })
      .toBuffer();
    await writeFile(path.join(OUT_DIR, name), out);
    after += out.length;
    console.log(`${name.padEnd(34)} ${kb(out.length).padStart(9)}`);
  }
  console.log(`  ← ${file} (${kb(input.length)})`);
}

console.log(`\nOriginais: ${kb(before)}  →  WebP: ${kb(after)}  (-${(100 - (after / before) * 100).toFixed(1)}%)`);
