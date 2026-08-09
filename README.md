# Gerador de Questões — Direito Administrativo (IDECAN + CEBRASPE)

Aplicativo web simples, no estilo visual do Qconcursos/TecConcursos, com
dois bancos fixos de conteúdo de Direito Administrativo para o concurso de
**Auditor Fiscal da Receita Municipal — Prefeitura de Campina Grande/PB**
(Edital nº 01/2026, prova em 30/08/2026):

- **Questões (estilo IDECAN)** — 600 questões de múltipla escolha (30 por
  tópico × 20 tópicos), dificuldade média/difícil.
- **Flashcards (estilo CEBRASPE)** — 320 itens Certo/Errado em dois níveis:
  **difícil** (10 por tópico, nos 20 tópicos) e **extremo** (10 por tópico,
  em 12 tópicos), este último no patamar de provas de Auditor Fiscal e de
  Delegado, calibrado em 28 provas reais de 5 bancas.

O app tem duas abas para alternar entre os dois modos.

Não há chamadas a nenhuma API de IA em tempo de execução: todo o conteúdo já
está escrito e salvo em arquivos JSON no repositório. O app apenas sorteia
um item do banco correspondente, respeitando os filtros de tópico
(e dificuldade, no modo Questões) escolhidos, e evita repetir itens já
vistos na sessão. **Não é necessária nenhuma chave de API, nem instalação,
para usar o app** — é só abrir o arquivo `gerador-questoes-idecan.html` no
navegador (veja abaixo).

## Como funciona

- **Backend** (`server.js`, Express): carrega os arquivos JSON de
  `data/questoes/<topicoId>.json` e `data/flashcards/<topicoId>.json` na
  memória ao iniciar e expõe:
  - `GET /api/topicos` — lista de tópicos com a contagem de questões e de
    flashcards de cada um;
  - `POST /api/questao` — recebe `{ topicoIds, dificuldade, excluirIds }` e
    devolve uma questão sorteada dentre as que casam com o filtro e ainda
    não foram vistas (quando todas já foram vistas, reinicia o ciclo);
  - `POST /api/flashcard` — mesma lógica, para o banco de flashcards, que
    mescla `data/flashcards/` (nível difícil) e `data/flashcards-extremo/`
    (nível extremo); o campo `dificuldade` aceita `"dificil"`, `"extremo"`
    ou `"todos"`.
- **Frontend** (`public/`): página única, sem framework, com abas para
  trocar de modo, sidebar de filtros (tópico e, no modo Questões,
  dificuldade), cartão de questão (alternativas clicáveis) ou de flashcard
  (botões CERTO/ERRADO), correção instantânea e estatísticas de
  acertos/erros salvas no `localStorage` do navegador — separadas por modo
  — que também guardam quais itens já foram vistos, para não repetir.

## Sobre os padrões de banca usados (transparência)

O arquivo [`lib/idecanStyleGuide.js`](lib/idecanStyleGuide.js) descreve o
padrão de redação seguido ao escrever as questões de múltipla escolha: 5
alternativas (A–E), comandos de enunciado típicos da banca ("Assinale a
alternativa correta", situações hipotéticas curtas, etc.), literalidade da
lei como base das questões, técnicas de "pegadinha" recorrentes (troca de
institutos parecidos, inversão de regra/exceção, prazos e competências
trocados) e dificuldade média/difícil, compatível com o nível de um cargo
de Auditor Fiscal.

O arquivo [`lib/cebraspeStyleGuide.js`](lib/cebraspeStyleGuide.js) descreve
o padrão usado nos flashcards: item único declarativo, julgado como CERTO
ou ERRADO (nunca múltipla escolha), frases que combinam mais de uma regra
jurídica na mesma oração, e as mesmas técnicas de erro sutil características
da banca (troca de termo próximo, inversão regra/exceção, erro de conexão
lógica, dispositivo revogado), sempre em dificuldade difícil.

Esses guias foram construídos a partir das características **consolidadas e
bem documentadas** do estilo de redação de cada banca em concursos de nível
superior. Durante a criação deste projeto, o PDF oficial do edital 01/2026
de Campina Grande/PB (hospedado em `concurso.idecan.org.br`) bloqueou o
download automatizado (HTTP 403), então **não há provas reais de nenhuma
das duas bancas embutidas ou copiadas no app** — todo o conteúdo (600
questões + 200 flashcards) é inédito, escrito com base em legislação,
jurisprudência e doutrina reais, mas não são itens de provas aplicadas. Se
você tiver PDFs de provas reais e quiser calibrar ainda mais o padrão, use
os guias de estilo como referência de tom ao revisar/reescrever itens em
`data/questoes/` ou `data/flashcards/`.

O conteúdo programático de Direito Administrativo em
[`lib/topicos.js`](lib/topicos.js) segue os tópicos clássicos dessa
disciplina para carreiras de auditoria fiscal municipal (Direito
Administrativo é uma das disciplinas de conhecimentos específicos
confirmadas no edital de Campina Grande, ao lado de Direito Tributário,
Direito Constitucional, Contabilidade, Auditoria, AFO, Direito Empresarial,
Administração Geral, Estatística e LGPD aplicada). Ajuste a lista de tópicos
livremente caso o anexo oficial do edital detalhe itens diferentes.

## Como usar (opção mais simples: arquivo HTML único, sem instalar nada)

Basta abrir **[`gerador-questoes-idecan.html`](gerador-questoes-idecan.html)**
diretamente no navegador (duplo clique no arquivo) — não precisa de Node,
npm, internet nem servidor. As 600 questões e os 200 flashcards já estão
embutidos no próprio arquivo (~1,4 MB).

Esse arquivo é gerado a partir dos dados do projeto. Se você editar os
tópicos ou o banco de questões, regenere-o com:

```bash
npm install
npm run build:html
```

## Como usar via servidor Node (alternativa)

Pré-requisito: Node.js 18+.

```bash
npm install
npm start
```

Acesse `http://localhost:3000`. Funciona de forma idêntica à versão HTML,
mas serve os dados por um endpoint (`/api/questao`), útil caso você queira
hospedar o app em um servidor.

## Uso

1. Escolha a aba **Questões (IDECAN)** ou **Flashcards (CEBRASPE)** no topo.
2. No modo Questões, escolha a dificuldade (média, difícil, ou sorteada
   entre as duas). No modo Flashcards, escolha o nível: **Extremo**
   (padrão), **Difícil** ou **Todos os níveis** — tópicos sem itens no
   nível escolhido aparecem com `(0)` e ficam fora do sorteio.
3. Marque os tópicos de Direito Administrativo desejados (todos vêm
   marcados por padrão, com a contagem de itens do modo atual entre
   parênteses).
4. Clique em **Sortear questão** / **Sortear flashcard**.
5. No modo Questões, selecione uma alternativa e clique em **Responder**
   para ver o gabarito, o comentário explicativo e a fundamentação legal.
   No modo Flashcards, clique em **CERTO** ou **ERRADO** para julgar o
   item e ver a justificativa.
6. Clique em **Próxima questão** / **Próximo flashcard** para continuar
   treinando. As estatísticas de acertos/erros ficam salvas no navegador,
   separadas por modo (botão **Zerar** limpa o histórico do modo atual).
   Quando todos os itens de um filtro já tiverem sido vistos, o app avisa
   com o rótulo "Ciclo reiniciado" e volta a sorteá-los.

## Estrutura do projeto

```
gerador-questoes-idecan.html    arquivo único autocontido (gerado) — abrir direto no navegador, sem servidor
scripts/build-html.js           gera o HTML autocontido a partir de lib/ + data/ + public/
server.js                       servidor Express + endpoints /api/questao e /api/flashcard (sorteio nos bancos estáticos)
lib/topicos.js                  conteúdo programático de Direito Administrativo (20 tópicos)
lib/idecanStyleGuide.js         guia de estilo da banca IDECAN usado na redação das questões
lib/cebraspeStyleGuide.js       guia de estilo da banca CEBRASPE usado na redação dos flashcards
lib/nivelExtremoStyleGuide.js   calibração do nível Extremo, extraída de 28 provas reais
data/questoes/<topicoId>.json   banco de 30 questões por tópico (20 arquivos, 600 questões)
data/flashcards/<topicoId>.json banco de 10 flashcards nível difícil por tópico (20 arquivos, 200)
data/flashcards-extremo/<id>.json  banco de 10 flashcards nível extremo (12 arquivos, 120)
data/corpus-provas/             texto das 28 provas reais usadas para calibrar o nível Extremo
docs/provas-analisadas.md       inventário das provas, limitações e padrões extraídos
public/index.html               página única do app (versão servidor), com abas Questões/Flashcards
public/styles.css               estilo visual (inspirado em Qconcursos/TecConcursos)
public/app.js                    lógica do frontend da versão servidor (fetch nas rotas /api/...)
public/app-standalone.js         mesma lógica, adaptada para ler os dados embutidos (usada no build do HTML único)
```

## Ampliando os bancos

Para adicionar mais questões a um tópico, edite o array JSON correspondente
em `data/questoes/<topicoId>.json`, seguindo o schema abaixo, e depois rode
`npm run build:html` para atualizar o arquivo HTML único (se você o usa):

```json
{
  "id": "ato-administrativo-31",
  "topicoId": "ato-administrativo",
  "topico": "Ato administrativo",
  "dificuldade": "media",
  "enunciado": "...",
  "alternativas": [
    { "letra": "A", "texto": "..." },
    { "letra": "B", "texto": "..." },
    { "letra": "C", "texto": "..." },
    { "letra": "D", "texto": "..." },
    { "letra": "E", "texto": "..." }
  ],
  "gabarito": "C",
  "comentario": "...",
  "fundamentacaoLegal": "..."
}
```

Para adicionar mais flashcards, edite `data/flashcards/<topicoId>.json`
(nível difícil) ou `data/flashcards-extremo/<topicoId>.json` (nível
extremo — crie o arquivo se o tópico ainda não tiver esse nível), seguindo
este schema (sem alternativas — item único Certo/Errado):

```json
{
  "id": "ato-administrativo-fc-11",
  "topicoId": "ato-administrativo",
  "topico": "Ato administrativo",
  "dificuldade": "dificil",
  "enunciado": "afirmação única a ser julgada como certa ou errada",
  "gabarito": "C",
  "justificativa": "...",
  "fundamentacaoLegal": "..."
}
```

## Aviso legal

As questões e os flashcards foram elaborados com apoio de inteligência
artificial para fins de estudo e treino de estilo. Não têm vínculo oficial
com a IDECAN, com a CEBRASPE, com a Prefeitura de Campina Grande ou com o
edital 01/2026, e não substituem a leitura do edital oficial e do material
didático especializado.
