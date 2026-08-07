import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { TOPICOS } from "./lib/topicos.js";
import { buildSystemPrompt, buildUserPrompt } from "./lib/promptBuilder.js";

const PORT = process.env.PORT || 3000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

app.get("/api/topicos", (req, res) => {
  res.json(TOPICOS);
});

app.post("/api/questao", async (req, res) => {
  if (!anthropic) {
    return res.status(500).json({
      erro:
        "ANTHROPIC_API_KEY não configurada no servidor. Defina a variável de ambiente (veja .env.example) para habilitar a geração de questões em tempo real.",
    });
  }

  const { topicoIds, dificuldade, temasRecentes } = req.body || {};

  try {
    const system = buildSystemPrompt();
    const user = buildUserPrompt({
      topicoIds: Array.isArray(topicoIds) ? topicoIds : [],
      dificuldade: dificuldade || "aleatoria",
      temasRecentes: Array.isArray(temasRecentes)
        ? temasRecentes.slice(-8)
        : [],
    });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      temperature: 1,
      system,
      messages: [{ role: "user", content: user }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const questao = parseQuestaoJson(rawText);

    if (!isQuestaoValida(questao)) {
      throw new Error("Resposta do modelo não seguiu o formato esperado.");
    }

    res.json(questao);
  } catch (err) {
    console.error("Erro ao gerar questão:", err);
    res.status(502).json({
      erro:
        "Não foi possível gerar a questão agora. Tente novamente em instantes.",
      detalhe: err.message,
    });
  }
});

function parseQuestaoJson(rawText) {
  const semMarkdown = rawText
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const inicio = semMarkdown.indexOf("{");
  const fim = semMarkdown.lastIndexOf("}");
  const jsonStr =
    inicio !== -1 && fim !== -1 ? semMarkdown.slice(inicio, fim + 1) : semMarkdown;

  return JSON.parse(jsonStr);
}

function isQuestaoValida(q) {
  return (
    q &&
    typeof q.enunciado === "string" &&
    Array.isArray(q.alternativas) &&
    q.alternativas.length === 5 &&
    q.alternativas.every(
      (a) => a && typeof a.letra === "string" && typeof a.texto === "string"
    ) &&
    ["A", "B", "C", "D", "E"].includes(q.gabarito) &&
    typeof q.comentario === "string"
  );
}

app.listen(PORT, () => {
  console.log(`Gerador de questões IDECAN rodando em http://localhost:${PORT}`);
  if (!anthropic) {
    console.warn(
      "AVISO: ANTHROPIC_API_KEY não configurada — a geração de questões não funcionará até que a variável seja definida."
    );
  }
});
