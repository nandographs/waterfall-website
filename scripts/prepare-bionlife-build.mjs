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
    "<title>BionLife | Conforto, sustentação e massagem</title>",
  ],
  [
    /<meta name="description" content=".*?" \/>/,
    '<meta name="description" content="Colchões BionLife com densidade progressiva, ActiveCool e opções de massagem integradas." />',
  ],
  [
    /<meta name="keywords" content=".*?" \/>/,
    '<meta name="keywords" content="bionlife, colchão de espuma, colchão com massagem, activecool, densidade progressiva" />',
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
    '<meta property="og:title" content="BionLife | Conforto, sustentação e massagem" />',
  ],
  [
    /<meta property="og:description" content=".*?" \/>/,
    '<meta property="og:description" content="Tecnologia aplicada ao conforto, à sustentação e ao relaxamento." />',
  ],
  [
    /<meta property="og:image" content=".*?" \/>/,
    '<meta property="og:image" content="/images/bionlife-hero.webp" />',
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
