const MAX_VISTAS = 1200;

const ROTULO_DIFICULDADE = {
  media: "Média",
  dificil: "Difícil",
  extremo: "Extremo",
};

const el = {
  tabQuestoes: document.getElementById("tabQuestoes"),
  tabFlashcards: document.getElementById("tabFlashcards"),
  campoDificuldade: document.getElementById("campoDificuldade"),
  campoNivel: document.getElementById("campoNivel"),
  disclaimerQuestoes: document.getElementById("disclaimerQuestoes"),
  disclaimerFlashcards: document.getElementById("disclaimerFlashcards"),
  topicosList: document.getElementById("topicosList"),
  btnTodos: document.getElementById("btnTodos"),
  btnNenhum: document.getElementById("btnNenhum"),
  btnGerar: document.getElementById("btnGerar"),
  btnZerar: document.getElementById("btnZerar"),
  empty: document.getElementById("empty"),
  loading: document.getElementById("loading"),
  erro: document.getElementById("erro"),
  card: document.getElementById("questaoCard"),
  badgeTopico: document.getElementById("badgeTopico"),
  badgeDificuldade: document.getElementById("badgeDificuldade"),
  enunciado: document.getElementById("enunciado"),
  alternativas: document.getElementById("alternativas"),
  btnResponder: document.getElementById("btnResponder"),
  btnProxima: document.getElementById("btnProxima"),
  resultado: document.getElementById("resultado"),
  resultadoTitulo: document.getElementById("resultadoTitulo"),
  comentario: document.getElementById("comentario"),
  fundamentacao: document.getElementById("fundamentacao"),
  fcCard: document.getElementById("flashcardCard"),
  fcBadgeTopico: document.getElementById("fcBadgeTopico"),
  fcBadgeDificuldade: document.getElementById("fcBadgeDificuldade"),
  fcBadgeReiniciado: document.getElementById("fcBadgeReiniciado"),
  fcEnunciado: document.getElementById("fcEnunciado"),
  btnCerto: document.getElementById("btnCerto"),
  btnErrado: document.getElementById("btnErrado"),
  fcBtnProxima: document.getElementById("fcBtnProxima"),
  fcResultado: document.getElementById("fcResultado"),
  fcResultadoTitulo: document.getElementById("fcResultadoTitulo"),
  fcJustificativa: document.getElementById("fcJustificativa"),
  fcFundamentacao: document.getElementById("fcFundamentacao"),
  statTotal: document.getElementById("statTotal"),
  statAcertos: document.getElementById("statAcertos"),
  statErros: document.getElementById("statErros"),
  statPercentual: document.getElementById("statPercentual"),
};

let modo = "questoes"; // "questoes" | "flashcards"
let topicosCache = [];
let questaoAtual = null;
let alternativaSelecionada = null;
let respondida = false;
let flashcardAtual = null;
let flashcardRespondido = false;

function chaveStats() {
  return modo === "flashcards" ? "idecan-gerador-stats-flashcards" : "idecan-gerador-stats-questoes";
}
function chaveVistas() {
  return modo === "flashcards" ? "idecan-gerador-vistas-flashcards" : "idecan-gerador-vistas-questoes";
}

function carregarStats() {
  try {
    return JSON.parse(localStorage.getItem(chaveStats())) || { total: 0, acertos: 0, erros: 0 };
  } catch {
    return { total: 0, acertos: 0, erros: 0 };
  }
}

function salvarStats(stats) {
  localStorage.setItem(chaveStats(), JSON.stringify(stats));
}

function atualizarStatsUI() {
  const stats = carregarStats();
  el.statTotal.textContent = stats.total;
  el.statAcertos.textContent = stats.acertos;
  el.statErros.textContent = stats.erros;
  const pct = stats.total > 0 ? Math.round((stats.acertos / stats.total) * 100) : 0;
  el.statPercentual.textContent = `${pct}%`;
}

function carregarVistas() {
  try {
    return JSON.parse(localStorage.getItem(chaveVistas())) || [];
  } catch {
    return [];
  }
}

function registrarVista(id) {
  const vistas = carregarVistas();
  if (!vistas.includes(id)) vistas.push(id);
  while (vistas.length > MAX_VISTAS) vistas.shift();
  localStorage.setItem(chaveVistas(), JSON.stringify(vistas));
}

function getNivelSelecionado() {
  return document.querySelector('input[name="nivel"]:checked').value;
}

function getDificuldadeSelecionada() {
  return document.querySelector('input[name="dificuldade"]:checked').value;
}

/** Quantos itens o tópico oferece no modo e no filtro de nível atuais. */
function contarTopico(topico) {
  if (modo === "flashcards") {
    const nivel = getNivelSelecionado();
    return nivel === "todos" ? topico.flashcards.total : topico.flashcards[nivel] || 0;
  }
  const dificuldade = getDificuldadeSelecionada();
  return dificuldade === "aleatoria" ? topico.questoes.total : topico.questoes[dificuldade] || 0;
}

async function carregarTopicos() {
  const res = await fetch("/api/topicos");
  topicosCache = await res.json();
  el.topicosList.innerHTML = "";
  topicosCache.forEach((t) => {
    const label = document.createElement("label");
    label.className = "topico-item";
    label.title = t.descricao;
    label.innerHTML = `<input type="checkbox" value="${t.id}" checked /> <span class="topico-item__nome">${t.nome}</span> <small class="topico-item__total">(${contarTopico(t)})</small>`;
    el.topicosList.appendChild(label);
  });
}

function atualizarContagemTopicos() {
  el.topicosList.querySelectorAll(".topico-item").forEach((label, i) => {
    const topico = topicosCache[i];
    if (!topico) return;
    label.querySelector(".topico-item__total").textContent = `(${contarTopico(topico)})`;
  });
}

function getTopicosSelecionados() {
  return Array.from(el.topicosList.querySelectorAll("input[type=checkbox]:checked")).map((i) => i.value);
}

function setState(state) {
  el.empty.classList.toggle("hidden", state !== "empty");
  el.loading.classList.toggle("hidden", state !== "loading");
  el.erro.classList.toggle("hidden", state !== "erro");
  el.card.classList.toggle("hidden", !(state === "questao" && modo === "questoes"));
  el.fcCard.classList.toggle("hidden", !(state === "questao" && modo === "flashcards"));
}

function trocarModo(novoModo) {
  if (novoModo === modo) return;
  modo = novoModo;

  el.tabQuestoes.classList.toggle("active", modo === "questoes");
  el.tabFlashcards.classList.toggle("active", modo === "flashcards");
  el.campoDificuldade.classList.toggle("hidden", modo === "flashcards");
  el.campoNivel.classList.toggle("hidden", modo !== "flashcards");
  el.disclaimerQuestoes.classList.toggle("hidden", modo !== "questoes");
  el.disclaimerFlashcards.classList.toggle("hidden", modo !== "flashcards");
  el.btnGerar.textContent = modo === "flashcards" ? "Sortear flashcard" : "Sortear questão";

  atualizarContagemTopicos();
  atualizarStatsUI();
  setState("empty");
}

async function gerar() {
  setState("loading");
  el.btnGerar.disabled = true;

  const topicoIds = getTopicosSelecionados();
  const excluirIds = carregarVistas();
  const endpoint = modo === "flashcards" ? "/api/flashcard" : "/api/questao";
  const dificuldade = modo === "flashcards" ? getNivelSelecionado() : getDificuldadeSelecionada();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicoIds, dificuldade, excluirIds }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.erro || "Erro ao buscar item.");
    }

    if (modo === "flashcards") {
      flashcardAtual = data;
      flashcardRespondido = false;
      renderFlashcard(data);
    } else {
      questaoAtual = data;
      respondida = false;
      alternativaSelecionada = null;
      renderQuestao(data);
    }

    registrarVista(data.id);
    setState("questao");
  } catch (err) {
    el.erro.textContent = err.message || "Não foi possível buscar o item. Tente novamente.";
    setState("erro");
  } finally {
    el.btnGerar.disabled = false;
  }
}

function renderQuestao(q) {
  el.badgeTopico.textContent = q.topico || "Direito Administrativo";
  el.badgeDificuldade.textContent = ROTULO_DIFICULDADE[q.dificuldade] || q.dificuldade;
  el.badgeDificuldade.classList.toggle("badge--extremo", q.dificuldade === "extremo");
  el.enunciado.textContent = q.enunciado;

  document.getElementById("badgeReiniciado").classList.toggle("hidden", !q.reiniciado);

  el.alternativas.innerHTML = "";
  q.alternativas.forEach((alt) => {
    const div = document.createElement("div");
    div.className = "alternativa";
    div.dataset.letra = alt.letra;
    div.innerHTML = `<span class="alternativa__letra">${alt.letra})</span><span>${alt.texto}</span>`;
    div.addEventListener("click", () => selecionarAlternativa(alt.letra));
    el.alternativas.appendChild(div);
  });

  el.btnResponder.disabled = true;
  el.btnResponder.classList.remove("hidden");
  el.btnProxima.classList.add("hidden");
  el.resultado.classList.add("hidden");
}

function selecionarAlternativa(letra) {
  if (respondida) return;
  alternativaSelecionada = letra;
  el.btnResponder.disabled = false;
  Array.from(el.alternativas.children).forEach((div) => {
    div.classList.toggle("selecionada", div.dataset.letra === letra);
  });
}

function responder() {
  if (!alternativaSelecionada || respondida) return;
  respondida = true;

  const acertou = alternativaSelecionada === questaoAtual.gabarito;
  const stats = carregarStats();
  stats.total += 1;
  if (acertou) stats.acertos += 1;
  else stats.erros += 1;
  salvarStats(stats);
  atualizarStatsUI();

  Array.from(el.alternativas.children).forEach((div) => {
    const letra = div.dataset.letra;
    if (letra === questaoAtual.gabarito) div.classList.add("correta");
    else if (letra === alternativaSelecionada) div.classList.add("incorreta");
  });

  el.resultadoTitulo.textContent = acertou
    ? `Você acertou! Gabarito: ${questaoAtual.gabarito}`
    : `Você errou. Gabarito: ${questaoAtual.gabarito}`;
  el.resultadoTitulo.className = "resultado__titulo " + (acertou ? "ok" : "err");
  el.comentario.textContent = questaoAtual.comentario || "";
  el.fundamentacao.textContent = questaoAtual.fundamentacaoLegal || "";
  el.resultado.classList.remove("hidden");

  el.btnResponder.classList.add("hidden");
  el.btnProxima.classList.remove("hidden");
}

function renderFlashcard(fc) {
  el.fcBadgeTopico.textContent = fc.topico || "Direito Administrativo";
  el.fcBadgeDificuldade.textContent = ROTULO_DIFICULDADE[fc.dificuldade] || fc.dificuldade;
  el.fcBadgeDificuldade.classList.toggle("badge--extremo", fc.dificuldade === "extremo");
  el.fcBadgeReiniciado.classList.toggle("hidden", !fc.reiniciado);
  el.fcEnunciado.textContent = fc.enunciado;

  el.btnCerto.disabled = false;
  el.btnErrado.disabled = false;
  el.btnCerto.classList.remove("acertou", "errou");
  el.btnErrado.classList.remove("acertou", "errou");
  el.fcBtnProxima.classList.add("hidden");
  el.fcResultado.classList.add("hidden");
}

function julgarFlashcard(julgamento) {
  if (flashcardRespondido || !flashcardAtual) return;
  flashcardRespondido = true;

  const acertou = julgamento === flashcardAtual.gabarito;
  const stats = carregarStats();
  stats.total += 1;
  if (acertou) stats.acertos += 1;
  else stats.erros += 1;
  salvarStats(stats);
  atualizarStatsUI();

  el.btnCerto.disabled = true;
  el.btnErrado.disabled = true;

  const btnEscolhido = julgamento === "C" ? el.btnCerto : el.btnErrado;
  btnEscolhido.classList.add(acertou ? "acertou" : "errou");
  if (!acertou) {
    const btnCorreto = flashcardAtual.gabarito === "C" ? el.btnCerto : el.btnErrado;
    btnCorreto.classList.add("acertou");
  }

  const rotuloGabarito = flashcardAtual.gabarito === "C" ? "CERTO" : "ERRADO";
  el.fcResultadoTitulo.textContent = acertou
    ? `Você acertou! Gabarito: ${rotuloGabarito}`
    : `Você errou. Gabarito: ${rotuloGabarito}`;
  el.fcResultadoTitulo.className = "resultado__titulo " + (acertou ? "ok" : "err");
  el.fcJustificativa.textContent = flashcardAtual.justificativa || "";
  el.fcFundamentacao.textContent = flashcardAtual.fundamentacaoLegal || "";
  el.fcResultado.classList.remove("hidden");

  el.fcBtnProxima.classList.remove("hidden");
}

el.tabQuestoes.addEventListener("click", () => trocarModo("questoes"));
el.tabFlashcards.addEventListener("click", () => trocarModo("flashcards"));
document.getElementById("nivelGroup").addEventListener("change", atualizarContagemTopicos);
document.getElementById("dificuldadeGroup").addEventListener("change", atualizarContagemTopicos);

el.btnTodos.addEventListener("click", () => {
  el.topicosList.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = true));
});
el.btnNenhum.addEventListener("click", () => {
  el.topicosList.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = false));
});
el.btnGerar.addEventListener("click", gerar);
el.btnResponder.addEventListener("click", responder);
el.btnProxima.addEventListener("click", gerar);
el.btnCerto.addEventListener("click", () => julgarFlashcard("C"));
el.btnErrado.addEventListener("click", () => julgarFlashcard("E"));
el.fcBtnProxima.addEventListener("click", gerar);
el.btnZerar.addEventListener("click", () => {
  salvarStats({ total: 0, acertos: 0, erros: 0 });
  atualizarStatsUI();
});

atualizarStatsUI();
carregarTopicos();
