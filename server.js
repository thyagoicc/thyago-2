import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICOS } from "./lib/topicos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTOES_DIR = path.join(__dirname, "data", "questoes");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static("public"));

const bancoPorTopico = carregarBanco();

function carregarBanco() {
  const banco = {};
  for (const topico of TOPICOS) {
    const arquivo = path.join(QUESTOES_DIR, `${topico.id}.json`);
    if (!fs.existsSync(arquivo)) {
      console.warn(`AVISO: banco de questões ausente para o tópico "${topico.id}" (${arquivo})`);
      banco[topico.id] = [];
      continue;
    }
    const questoes = JSON.parse(fs.readFileSync(arquivo, "utf8"));
    banco[topico.id] = questoes;
  }
  return banco;
}

app.get("/api/topicos", (req, res) => {
  const topicosComContagem = TOPICOS.map((t) => ({
    ...t,
    totalQuestoes: (bancoPorTopico[t.id] || []).length,
  }));
  res.json(topicosComContagem);
});

app.post("/api/questao", (req, res) => {
  const { topicoIds, dificuldade, excluirIds } = req.body || {};

  const idsAlvo =
    Array.isArray(topicoIds) && topicoIds.length > 0
      ? topicoIds
      : TOPICOS.map((t) => t.id);

  const excluir = new Set(Array.isArray(excluirIds) ? excluirIds : []);

  let candidatas = idsAlvo.flatMap((id) => bancoPorTopico[id] || []);

  if (dificuldade === "media" || dificuldade === "dificil") {
    candidatas = candidatas.filter((q) => q.dificuldade === dificuldade);
  }

  if (candidatas.length === 0) {
    return res.status(404).json({
      erro: "Não há questões cadastradas para os filtros selecionados.",
    });
  }

  let disponiveis = candidatas.filter((q) => !excluir.has(q.id));
  let reiniciado = false;
  if (disponiveis.length === 0) {
    disponiveis = candidatas;
    reiniciado = true;
  }

  const escolhida = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  res.json({ ...escolhida, reiniciado });
});

app.listen(PORT, () => {
  const total = Object.values(bancoPorTopico).reduce((acc, arr) => acc + arr.length, 0);
  console.log(`Gerador de questões IDECAN rodando em http://localhost:${PORT}`);
  console.log(`Banco de questões carregado: ${total} questões em ${TOPICOS.length} tópicos.`);
});
