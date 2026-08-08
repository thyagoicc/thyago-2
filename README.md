# Gerador de Questões — Direito Administrativo (estilo IDECAN)

Aplicativo web simples, no estilo visual do Qconcursos/TecConcursos, com um
**banco fixo de 600 questões** (30 por tópico × 20 tópicos) de Direito
Administrativo, escritas para reproduzir o padrão de redação da banca
**IDECAN**, voltado ao concurso de **Auditor Fiscal da Receita Municipal —
Prefeitura de Campina Grande/PB** (Edital nº 01/2026, prova em 30/08/2026).

Não há chamadas a nenhuma API de IA em tempo de execução: as questões já
estão escritas e salvas em arquivos JSON no repositório. O app apenas
sorteia uma questão do banco, respeitando os filtros de tópico/dificuldade
escolhidos e evitando repetir questões já vistas na sessão. **Não é
necessária nenhuma chave de API, nem instalação, para usar o app** — é só
abrir o arquivo `gerador-questoes-idecan.html` no navegador (veja abaixo).

## Como funciona

- **Backend** (`server.js`, Express): carrega os arquivos JSON de
  `data/questoes/<topicoId>.json` na memória ao iniciar e expõe:
  - `GET /api/topicos` — lista de tópicos com a contagem de questões de cada
    um;
  - `POST /api/questao` — recebe `{ topicoIds, dificuldade, excluirIds }` e
    devolve uma questão sorteada dentre as que casam com o filtro e ainda
    não foram vistas (quando todas já foram vistas, reinicia o ciclo).
- **Frontend** (`public/`): página única, sem framework, com sidebar de
  filtros (tópico e dificuldade), cartão de questão com alternativas
  clicáveis, correção instantânea e estatísticas de acertos/erros salvas no
  `localStorage` do navegador (que também guarda quais questões já foram
  vistas, para não repetir).

## Sobre o padrão IDECAN usado (transparência)

O arquivo [`lib/idecanStyleGuide.js`](lib/idecanStyleGuide.js) descreve o
padrão de redação seguido ao escrever as questões: 5 alternativas (A–E),
comandos de enunciado típicos da banca ("Assinale a alternativa correta",
situações hipotéticas curtas, etc.), literalidade da lei como base das
questões, técnicas de "pegadinha" recorrentes (troca de institutos
parecidos, inversão de regra/exceção, prazos e competências trocados) e
dificuldade média/difícil, compatível com o nível de um cargo de Auditor
Fiscal.

Esse guia foi construído a partir das características **consolidadas e bem
documentadas** do estilo de redação da IDECAN em concursos de nível
superior. Durante a criação deste projeto, o PDF oficial do edital 01/2026
de Campina Grande/PB (hospedado em `concurso.idecan.org.br`) bloqueou o
download automatizado (HTTP 403), então **não há provas reais da banca
embutidas ou copiadas no app** — todas as 600 questões são inéditas, no
estilo da banca, escritas com base em legislação, jurisprudência e doutrina
reais, mas não são itens de provas aplicadas. Se você tiver PDFs de provas
reais da IDECAN e quiser calibrar ainda mais o padrão, use
`lib/idecanStyleGuide.js` como referência de tom ao revisar/reescrever
questões em `data/questoes/`.

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
npm, internet nem servidor. As 600 questões já estão embutidas no próprio
arquivo.

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

1. Escolha a dificuldade (média, difícil, ou sorteada entre as duas).
2. Marque os tópicos de Direito Administrativo desejados (todos vêm marcados
   por padrão, com a contagem de questões de cada um entre parênteses).
3. Clique em **Sortear questão**.
4. Selecione uma alternativa e clique em **Responder** para ver o gabarito,
   o comentário explicativo e a fundamentação legal.
5. Clique em **Próxima questão** para continuar treinando. As estatísticas
   de acertos/erros ficam salvas no navegador (botão **Zerar** limpa o
   histórico). Quando todas as questões de um filtro já tiverem sido vistas,
   o app avisa com o rótulo "Ciclo reiniciado" e volta a sorteá-las.

## Estrutura do projeto

```
gerador-questoes-idecan.html  arquivo único autocontido (gerado) — abrir direto no navegador, sem servidor
scripts/build-html.js         gera o HTML autocontido a partir de lib/ + data/ + public/
server.js                     servidor Express + endpoint /api/questao (sorteio no banco estático)
lib/topicos.js                conteúdo programático de Direito Administrativo (20 tópicos)
lib/idecanStyleGuide.js       guia de estilo da banca IDECAN usado na redação das questões
data/questoes/<topicoId>.json banco de 30 questões por tópico (20 arquivos, 600 questões)
public/index.html             página única do app (versão servidor)
public/styles.css             estilo visual (inspirado em Qconcursos/TecConcursos)
public/app.js                  lógica do frontend da versão servidor (fetch nas rotas /api/...)
public/app-standalone.js       mesma lógica, adaptada para ler os dados embutidos (usada no build do HTML único)
```

## Ampliando o banco

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

## Aviso legal

As questões foram elaboradas com apoio de inteligência artificial para fins
de estudo e treino de estilo. Não têm vínculo oficial com a IDECAN, com a
Prefeitura de Campina Grande ou com o edital 01/2026, e não substituem a
leitura do edital oficial e do material didático especializado.
