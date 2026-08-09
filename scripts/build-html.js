// Gera um único arquivo HTML autocontido (sem servidor, sem npm install)
// a partir dos mesmos dados usados pelo app Node: lib/topicos.js +
// data/questoes/*.json + data/flashcards/*.json + public/index.html +
// public/styles.css + public/app-standalone.js.
//
// Uso: node scripts/build-html.js
// Saída: gerador-questoes-idecan.html (na raiz do repositório)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICOS } from "../lib/topicos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function montarBanco(subpastas) {
  const banco = {};
  for (const topico of TOPICOS) {
    banco[topico.id] = [];
    for (const subpasta of subpastas) {
      const arquivo = path.join(ROOT, "data", subpasta, `${topico.id}.json`);
      if (!fs.existsSync(arquivo)) {
        console.warn(`AVISO: banco de "${subpasta}" ausente para "${topico.id}"`);
        continue;
      }
      banco[topico.id].push(...JSON.parse(fs.readFileSync(arquivo, "utf8")));
    }
  }
  return banco;
}

function build() {
  const banco = montarBanco(["questoes"]);
  const flashcards = montarBanco(["flashcards", "flashcards-extremo"]);
  const totalQuestoes = Object.values(banco).reduce((acc, arr) => acc + arr.length, 0);
  const totalFlashcards = Object.values(flashcards).reduce((acc, arr) => acc + arr.length, 0);

  const indexHtml = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  const stylesCss = fs.readFileSync(path.join(ROOT, "public", "styles.css"), "utf8");
  const appJs = fs.readFileSync(path.join(ROOT, "public", "app-standalone.js"), "utf8");

  const dadosJs =
    `const TOPICOS = ${JSON.stringify(TOPICOS)};\n` +
    `const BANCO = ${JSON.stringify(banco)};\n` +
    `const FLASHCARDS = ${JSON.stringify(flashcards)};\n`;

  let html = indexHtml
    .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${stylesCss}\n</style>`)
    .replace(
      '<script src="app.js"></script>',
      `<script>\n${dadosJs}\n${appJs}\n</script>`
    )
    .replace(
      "<title>Gerador de Questões IDECAN — Direito Administrativo | Auditor Fiscal Campina Grande 2026</title>",
      "<title>Gerador de Questões IDECAN — Direito Administrativo | Auditor Fiscal Campina Grande 2026 (offline)</title>"
    );

  const saida = path.join(ROOT, "gerador-questoes-idecan.html");
  fs.writeFileSync(saida, html, "utf8");
  console.log(`Gerado: ${saida}`);
  console.log(
    `Tópicos: ${TOPICOS.length} | Questões: ${totalQuestoes} | Flashcards: ${totalFlashcards} | Tamanho: ${(html.length / 1024).toFixed(0)} KB`
  );
}

build();
