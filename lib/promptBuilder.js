import { IDECAN_STYLE_GUIDE } from "./idecanStyleGuide.js";
import { getTopicoPorId } from "./topicos.js";

const OUTPUT_SCHEMA = `
Responda ESTRITAMENTE com um único objeto JSON válido (sem markdown, sem
texto antes ou depois), seguindo exatamente este formato:

{
  "topico": "nome curto do tópico específico cobrado (ex.: 'Extinção do ato administrativo')",
  "dificuldade": "media" | "dificil",
  "enunciado": "texto completo do enunciado da questão",
  "alternativas": [
    { "letra": "A", "texto": "..." },
    { "letra": "B", "texto": "..." },
    { "letra": "C", "texto": "..." },
    { "letra": "D", "texto": "..." },
    { "letra": "E", "texto": "..." }
  ],
  "gabarito": "A" | "B" | "C" | "D" | "E",
  "comentario": "explicação didática de por que a alternativa correta está certa e por que cada uma das outras está errada, em 1 parágrafo por alternativa incorreta",
  "fundamentacaoLegal": "dispositivo(s) legal(is), constitucional(is), sumular(es) ou doutrinário(s) em que a questão se baseia"
}
`;

export function buildSystemPrompt() {
  return IDECAN_STYLE_GUIDE.trim() + "\n\n" + OUTPUT_SCHEMA.trim();
}

export function buildUserPrompt({ topicoIds, dificuldade, temasRecentes }) {
  const topicos =
    topicoIds && topicoIds.length > 0
      ? topicoIds.map(getTopicoPorId).filter(Boolean)
      : [];

  const escopoTopicos =
    topicos.length > 0
      ? `Escolha UM dos seguintes tópicos (sorteie um aleatoriamente entre eles) para basear a questão:\n${topicos
          .map((t) => `- ${t.nome}: ${t.descricao}`)
          .join("\n")}`
      : "Escolha livremente UM tópico de Direito Administrativo dentro do conteúdo programático típico de concursos de Auditor Fiscal municipal.";

  const escopoDificuldade =
    dificuldade === "media"
      ? "A questão deve ter dificuldade MÉDIA."
      : dificuldade === "dificil"
        ? "A questão deve ter dificuldade DIFÍCIL."
        : "Sorteie aleatoriamente entre dificuldade MÉDIA e DIFÍCIL.";

  const evitarRepeticao =
    temasRecentes && temasRecentes.length > 0
      ? `\n\nNÃO repita os seguintes temas/enunciados já gerados nesta sessão (gere algo diferente):\n${temasRecentes
          .map((t) => `- ${t}`)
          .join("\n")}`
      : "";

  return `Gere UMA nova questão de concurso, no padrão da banca IDECAN, para o
cargo de Auditor Fiscal da Receita Municipal do concurso da Prefeitura de
Campina Grande/PB (Edital nº 01/2026), disciplina Direito Administrativo.

${escopoTopicos}

${escopoDificuldade}${evitarRepeticao}

Retorne apenas o objeto JSON conforme o schema definido nas instruções do
sistema.`;
}
