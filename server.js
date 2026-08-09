import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICOS } from "./lib/topicos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTOES_DIR = path.join(__dirname, "data", "questoes");
const FLASHCARDS_DIRS = [
  path.join(__dirname, "data", "flashcards"),
  path.join(__dirname, "data", "flashcards-extremo"),
];
const PORT = process.env.PORT || 3000;
const DIFICULDADES = ["media", "dificil", "extremo"];

const app = express();
app.use(express.json());
app.use(express.static("public"));

const bancoQuestoes = carregarBanco([QUESTOES_DIR], "questões");
const bancoFlashcards = carregarBanco(FLASHCARDS_DIRS, "flashcards");

function carregarBanco(dirs, rotulo) {
  const banco = {};
  for (const topico of TOPICOS) {
    banco[topico.id] = [];
    for (const dir of dirs) {
      const arquivo = path.join(dir, `${topico.id}.json`);
      if (!fs.existsSync(arquivo)) {
        console.warn(`AVISO: banco de ${rotulo} ausente para "${topico.id}" em ${dir}`);
        continue;
      }
      banco[topico.id].push(...JSON.parse(fs.readFileSync(arquivo, "utf8")));
    }
  }
  return banco;
}

function contarPorDificuldade(itens) {
  const contagem = { total: itens.length };
  for (const nivel of DIFICULDADES) {
    contagem[nivel] = itens.filter((i) => i.dificuldade === nivel).length;
  }
  return contagem;
}

function sortear(banco, { topicoIds, dificuldade, excluirIds }) {
  const idsAlvo =
    Array.isArray(topicoIds) && topicoIds.length > 0
      ? topicoIds
      : TOPICOS.map((t) => t.id);

  const excluir = new Set(Array.isArray(excluirIds) ? excluirIds : []);

  let candidatas = idsAlvo.flatMap((id) => banco[id] || []);

  if (DIFICULDADES.includes(dificuldade)) {
    candidatas = candidatas.filter((q) => q.dificuldade === dificuldade);
  }

  if (candidatas.length === 0) return null;

  let disponiveis = candidatas.filter((q) => !excluir.has(q.id));
  let reiniciado = false;
  if (disponiveis.length === 0) {
    disponiveis = candidatas;
    reiniciado = true;
  }

  const escolhida = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  return { ...escolhida, reiniciado };
}

app.get("/api/topicos", (req, res) => {
  const topicosComContagem = TOPICOS.map((t) => ({
    ...t,
    questoes: contarPorDificuldade(bancoQuestoes[t.id] || []),
    flashcards: contarPorDificuldade(bancoFlashcards[t.id] || []),
  }));
  res.json(topicosComContagem);
});

app.post("/api/questao", (req, res) => {
  const resultado = sortear(bancoQuestoes, req.body || {});
  if (!resultado) {
    return res.status(404).json({
      erro: "Não há questões cadastradas para os filtros selecionados.",
    });
  }
  res.json(resultado);
});

app.post("/api/flashcard", (req, res) => {
  const resultado = sortear(bancoFlashcards, req.body || {});
  if (!resultado) {
    return res.status(404).json({
      erro: "Não há flashcards cadastrados para os filtros selecionados.",
    });
  }
  res.json(resultado);
});

app.listen(PORT, () => {
  const soma = (banco) => Object.values(banco).reduce((acc, arr) => acc + arr.length, 0);
  const porNivel = (banco) =>
    DIFICULDADES.map((n) => {
      const qtd = Object.values(banco).flat().filter((i) => i.dificuldade === n).length;
      return qtd ? `${n}: ${qtd}` : null;
    })
      .filter(Boolean)
      .join(", ");

  console.log(`Gerador de questões IDECAN rodando em http://localhost:${PORT}`);
  console.log(`Banco de questões: ${soma(bancoQuestoes)} (${porNivel(bancoQuestoes)})`);
  console.log(`Banco de flashcards: ${soma(bancoFlashcards)} (${porNivel(bancoFlashcards)})`);
});
