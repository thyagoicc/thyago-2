import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICOS } from "./lib/topicos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTOES_DIR = path.join(__dirname, "data", "questoes");
const FLASHCARDS_DIR = path.join(__dirname, "data", "flashcards");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static("public"));

const bancoQuestoes = carregarBanco(QUESTOES_DIR, "questões");
const bancoFlashcards = carregarBanco(FLASHCARDS_DIR, "flashcards");

function carregarBanco(dir, rotulo) {
  const banco = {};
  for (const topico of TOPICOS) {
    const arquivo = path.join(dir, `${topico.id}.json`);
    if (!fs.existsSync(arquivo)) {
      console.warn(`AVISO: banco de ${rotulo} ausente para o tópico "${topico.id}" (${arquivo})`);
      banco[topico.id] = [];
      continue;
    }
    banco[topico.id] = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  }
  return banco;
}

function sortear(banco, { topicoIds, dificuldade, excluirIds }) {
  const idsAlvo =
    Array.isArray(topicoIds) && topicoIds.length > 0
      ? topicoIds
      : TOPICOS.map((t) => t.id);

  const excluir = new Set(Array.isArray(excluirIds) ? excluirIds : []);

  let candidatas = idsAlvo.flatMap((id) => banco[id] || []);

  if (dificuldade === "media" || dificuldade === "dificil") {
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
    totalQuestoes: (bancoQuestoes[t.id] || []).length,
    totalFlashcards: (bancoFlashcards[t.id] || []).length,
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
  const resultado = sortear(bancoFlashcards, { ...(req.body || {}), dificuldade: "dificil" });
  if (!resultado) {
    return res.status(404).json({
      erro: "Não há flashcards cadastrados para os filtros selecionados.",
    });
  }
  res.json(resultado);
});

app.listen(PORT, () => {
  const totalQuestoes = Object.values(bancoQuestoes).reduce((acc, arr) => acc + arr.length, 0);
  const totalFlashcards = Object.values(bancoFlashcards).reduce((acc, arr) => acc + arr.length, 0);
  console.log(`Gerador de questões IDECAN rodando em http://localhost:${PORT}`);
  console.log(`Banco de questões: ${totalQuestoes} em ${TOPICOS.length} tópicos.`);
  console.log(`Banco de flashcards: ${totalFlashcards} em ${TOPICOS.length} tópicos.`);
});
