const STORAGE_STATS_KEY = "idecan-gerador-stats";
const STORAGE_VISTAS_KEY = "idecan-gerador-vistas";
const MAX_VISTAS = 600;

const el = {
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
  statTotal: document.getElementById("statTotal"),
  statAcertos: document.getElementById("statAcertos"),
  statErros: document.getElementById("statErros"),
  statPercentual: document.getElementById("statPercentual"),
};

let questaoAtual = null;
let alternativaSelecionada = null;
let respondida = false;

function carregarStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_STATS_KEY)) || { total: 0, acertos: 0, erros: 0 };
  } catch {
    return { total: 0, acertos: 0, erros: 0 };
  }
}

function salvarStats(stats) {
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
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
    return JSON.parse(localStorage.getItem(STORAGE_VISTAS_KEY)) || [];
  } catch {
    return [];
  }
}

function registrarVista(id) {
  const vistas = carregarVistas();
  if (!vistas.includes(id)) vistas.push(id);
  while (vistas.length > MAX_VISTAS) vistas.shift();
  localStorage.setItem(STORAGE_VISTAS_KEY, JSON.stringify(vistas));
}

async function carregarTopicos() {
  const res = await fetch("/api/topicos");
  const topicos = await res.json();
  el.topicosList.innerHTML = "";
  topicos.forEach((t) => {
    const label = document.createElement("label");
    label.className = "topico-item";
    label.title = t.descricao;
    label.innerHTML = `<input type="checkbox" value="${t.id}" checked /> <span>${t.nome} <small>(${t.totalQuestoes ?? 0})</small></span>`;
    el.topicosList.appendChild(label);
  });
}

function getTopicosSelecionados() {
  return Array.from(el.topicosList.querySelectorAll("input[type=checkbox]:checked")).map((i) => i.value);
}

function getDificuldadeSelecionada() {
  return document.querySelector('input[name="dificuldade"]:checked').value;
}

function setState(state) {
  el.empty.classList.toggle("hidden", state !== "empty");
  el.loading.classList.toggle("hidden", state !== "loading");
  el.erro.classList.toggle("hidden", state !== "erro");
  el.card.classList.toggle("hidden", state !== "questao");
}

async function gerarQuestao() {
  setState("loading");
  el.btnGerar.disabled = true;

  const topicoIds = getTopicosSelecionados();
  const dificuldade = getDificuldadeSelecionada();
  const excluirIds = carregarVistas();

  try {
    const res = await fetch("/api/questao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicoIds, dificuldade, excluirIds }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.erro || "Erro ao buscar questão.");
    }

    questaoAtual = data;
    respondida = false;
    alternativaSelecionada = null;
    renderQuestao(data);
    registrarVista(data.id);
    setState("questao");
  } catch (err) {
    el.erro.textContent = err.message || "Não foi possível gerar a questão. Tente novamente.";
    setState("erro");
  } finally {
    el.btnGerar.disabled = false;
  }
}

function renderQuestao(q) {
  el.badgeTopico.textContent = q.topico || "Direito Administrativo";
  el.badgeDificuldade.textContent = q.dificuldade === "dificil" ? "Difícil" : "Média";
  el.enunciado.textContent = q.enunciado;

  const badgeReiniciado = document.getElementById("badgeReiniciado");
  if (badgeReiniciado) {
    badgeReiniciado.classList.toggle("hidden", !q.reiniciado);
  }

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

el.btnTodos.addEventListener("click", () => {
  el.topicosList.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = true));
});
el.btnNenhum.addEventListener("click", () => {
  el.topicosList.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = false));
});
el.btnGerar.addEventListener("click", gerarQuestao);
el.btnResponder.addEventListener("click", responder);
el.btnProxima.addEventListener("click", gerarQuestao);
el.btnZerar.addEventListener("click", () => {
  salvarStats({ total: 0, acertos: 0, erros: 0 });
  atualizarStatsUI();
});

atualizarStatsUI();
carregarTopicos();
