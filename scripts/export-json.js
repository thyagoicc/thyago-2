// Consolida todo o banco (tópicos + questões + flashcards) em um único
// arquivo JSON, para importação em outras ferramentas.
//
// Uso: node scripts/export-json.js
// Saída: gerador-questoes-idecan.json (na raiz do repositório)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICOS } from "../lib/topicos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function lerBanco(subpastas) {
  const itens = [];
  for (const topico of TOPICOS) {
    for (const subpasta of subpastas) {
      const arquivo = path.join(ROOT, "data", subpasta, `${topico.id}.json`);
      if (!fs.existsSync(arquivo)) continue;
      itens.push(...JSON.parse(fs.readFileSync(arquivo, "utf8")));
    }
  }
  return itens;
}

function contarPor(itens, campo) {
  return itens.reduce((acc, i) => {
    acc[i[campo]] = (acc[i[campo]] || 0) + 1;
    return acc;
  }, {});
}

const questoes = lerBanco(["questoes"]);
const flashcards = lerBanco(["flashcards", "flashcards-extremo"]);

const exportacao = {
  meta: {
    titulo: "Banco de estudo — Direito Administrativo",
    concurso: "Auditor Fiscal da Receita Municipal — Prefeitura de Campina Grande/PB",
    edital: "Edital nº 01/2026",
    disciplina: "Direito Administrativo",
    geradoEm: new Date().toISOString().slice(0, 10),
    totais: {
      topicos: TOPICOS.length,
      questoes: questoes.length,
      flashcards: flashcards.length,
      questoesPorDificuldade: contarPor(questoes, "dificuldade"),
      flashcardsPorDificuldade: contarPor(flashcards, "dificuldade"),
    },
    formatos: {
      questoes:
        "Múltipla escolha no estilo da banca IDECAN: 5 alternativas (A–E), uma correta. Campo 'gabarito' guarda a letra.",
      flashcards:
        "Item único Certo/Errado no estilo da banca CEBRASPE, sem alternativas. Campo 'gabarito' guarda 'C' ou 'E'.",
    },
    aviso:
      "Conteúdo elaborado com apoio de inteligência artificial para fins de estudo. Não são itens reais de provas aplicadas e não há vínculo oficial com IDECAN, CEBRASPE ou com a Prefeitura de Campina Grande.",
  },
  topicos: TOPICOS,
  questoes,
  flashcards,
};

const saida = path.join(ROOT, "gerador-questoes-idecan.json");
fs.writeFileSync(saida, JSON.stringify(exportacao, null, 2), "utf8");

const tamanho = (fs.statSync(saida).size / 1024).toFixed(0);
console.log(`Gerado: ${saida}`);
console.log(
  `Tópicos: ${TOPICOS.length} | Questões: ${questoes.length} | Flashcards: ${flashcards.length} | Tamanho: ${tamanho} KB`
);
