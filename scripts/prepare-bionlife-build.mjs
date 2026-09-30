import { cp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve("dist");
const targetDir = path.resolve("dist-bionlife");

await rm(targetDir, { recursive: true, force: true });
await cp(sourceDir, targetDir, { recursive: true });

const indexPath = path.join(targetDir, "index.html");
let html = await readFile(indexPath, "utf8");

const replacements = [
  [
    /<title>.*?<\/title>/,
    "<title>BionLife | Conforto, bem-estar e tecnologia para o seu descanso</title>",
  ],
  [
    /<meta name="description" content=".*?" \/>/,
    '<meta name="description" content="Conheça as linhas de colchões BionLife. Diferentes sensações de conforto, tecnologia em camadas e ajuda para escolher o seu." />',
  ],
  [
    /<meta name="keywords" content=".*?" \/>/,
    '<meta name="keywords" content="bionlife, colchão ionizado, colchão com massagem, colchão magnético, colchão para bem-estar" />',
  ],
  [
    /<meta name="theme-color" content=".*?" \/>/,
    '<meta name="theme-color" content="#111411" />',
  ],
  [
    /<meta property="og:site_name" content=".*?" \/>/,
    '<meta property="og:site_name" content="BionLife" />',
  ],
  [
    /<meta property="og:title" content=".*?" \/>/,
    '<meta property="og:title" content="BionLife | Conforto, bem-estar e tecnologia para o seu descanso" />',
  ],
  [
    /<meta property="og:description" content=".*?" \/>/,
    '<meta property="og:description" content="Conheça as linhas de colchões BionLife. Diferentes sensações de conforto, tecnologia em camadas e ajuda para escolher o seu." />',
  ],
  [
    /<meta property="og:image" content=".*?" \/>/,
    '<meta property="og:image" content="/images/herobionlife.jpg" />',
  ],
];

for (const [pattern, value] of replacements) {
  html = html.replace(pattern, value);
}

await writeFile(indexPath, html, "utf8");

const manifestPath = path.join(targetDir, "site.webmanifest");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.name = "BionLife";
manifest.short_name = "BionLife";
manifest.theme_color = "#111411";
manifest.background_color = "#fbfaf8";
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Build BionLife preparado em ${targetDir}`);
