# Gerador de Questões — Direito Administrativo (estilo IDECAN)

Aplicativo web simples que **gera questões de concurso em tempo real**, no
estilo visual do Qconcursos/TecConcursos, reproduzindo o padrão de redação da
banca **IDECAN**, focado em **Direito Administrativo** para o concurso de
**Auditor Fiscal da Receita Municipal — Prefeitura de Campina Grande/PB**
(Edital nº 01/2026, prova em 30/08/2026).

Cada questão é gerada na hora por um modelo de linguagem (Claude, via API da
Anthropic), a partir de um "guia de estilo" que descreve com detalhe como a
IDECAN costuma redigir enunciados e alternativas. Não é um banco de questões
estático: a cada clique em "Gerar questão" uma questão nova é criada.

## Como funciona

- **Backend** (`server.js`, Express): recebe o pedido do frontend, monta um
  prompt combinando o guia de estilo da IDECAN + o(s) tópico(s) escolhido(s)
  + o nível de dificuldade, chama a API da Anthropic e devolve a questão em
  JSON (enunciado, 5 alternativas, gabarito, comentário e fundamentação
  legal).
- **Frontend** (`public/`): página única, sem framework, com sidebar de
  filtros (tópico e dificuldade), cartão de questão com alternativas
  clicáveis, correção instantânea e estatísticas de acertos/erros salvas no
  `localStorage` do navegador.

## Sobre o padrão IDECAN usado (transparência)

O arquivo [`lib/idecanStyleGuide.js`](lib/idecanStyleGuide.js) descreve o
padrão de redação que o modelo deve seguir: 5 alternativas (A–E), comandos de
enunciado típicos da banca ("Assinale a alternativa correta", situações
hipotéticas curtas, etc.), literalidade da lei como base das questões,
técnicas de "pegadinha" recorrentes (troca de institutos parecidos, inversão
de regra/exceção, prazos e competências trocados) e exigência de dificuldade
média/difícil, compatível com o nível de um cargo de Auditor Fiscal.

Esse guia foi construído a partir das características **consolidadas e bem
documentadas** do estilo de redação da IDECAN em concursos de nível superior.
Durante a criação deste projeto, o PDF oficial do edital 01/2026 de Campina
Grande/PB (hospedado em `concurso.idecan.org.br`) bloqueou o download
automatizado (HTTP 403), então **não há provas reais da banca embutidas ou
copiadas no app** — as questões geradas são inéditas, no estilo da banca, não
itens de provas aplicadas. Se você tiver PDFs de provas reais da IDECAN e
quiser calibrar ainda mais o padrão, edite `lib/idecanStyleGuide.js` com
observações adicionais (ex.: colar trechos de enunciados reais como
referência de tom).

O conteúdo programático de Direito Administrativo em
[`lib/topicos.js`](lib/topicos.js) segue os tópicos clássicos dessa
disciplina para carreiras de auditoria fiscal municipal (Direito
Administrativo é uma das disciplinas de conhecimentos específicos
confirmadas no edital de Campina Grande, ao lado de Direito Tributário,
Direito Constitucional, Contabilidade, Auditoria, AFO, Direito Empresarial,
Administração Geral, Estatística e LGPD aplicada). Ajuste a lista de tópicos
livremente caso o anexo oficial do edital detalhe itens diferentes.

## Pré-requisitos

- Node.js 18+
- Uma chave de API da Anthropic (https://console.anthropic.com/)

## Instalação e execução

```bash
npm install
cp .env.example .env
# edite .env e defina ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Acesse `http://localhost:3000`.

Variáveis de ambiente (`.env`):

| Variável            | Obrigatória | Descrição                                             |
|---------------------|:-----------:|---------------------------------------------------------|
| `ANTHROPIC_API_KEY` | Sim         | Chave da API da Anthropic usada para gerar as questões. |
| `ANTHROPIC_MODEL`   | Não         | Modelo a usar (padrão: `claude-sonnet-5`).               |
| `PORT`              | Não         | Porta do servidor (padrão: `3000`).                      |

Sem `ANTHROPIC_API_KEY`, o app sobe normalmente e mostra os tópicos, mas o
botão "Gerar questão" retorna um erro explicando que a chave precisa ser
configurada.

## Uso

1. Escolha a dificuldade (média, difícil, ou sorteada entre as duas).
2. Marque os tópicos de Direito Administrativo desejados (todos vêm marcados
   por padrão).
3. Clique em **Gerar questão**.
4. Selecione uma alternativa e clique em **Responder** para ver o gabarito,
   o comentário explicativo e a fundamentação legal.
5. Clique em **Próxima questão** para continuar treinando. As estatísticas
   de acertos/erros ficam salvas no navegador (botão **Zerar** limpa o
   histórico).

## Estrutura do projeto

```
server.js                 servidor Express + endpoint /api/questao
lib/topicos.js             conteúdo programático de Direito Administrativo
lib/idecanStyleGuide.js    guia de estilo da banca IDECAN (prompt de sistema)
lib/promptBuilder.js       monta o prompt enviado ao modelo
public/index.html          página única do app
public/styles.css          estilo visual (inspirado em Qconcursos/TecConcursos)
public/app.js               lógica do frontend (fetch, estado, estatísticas)
```

## Aviso legal

As questões são geradas por inteligência artificial para fins de estudo e
treino de estilo. Não têm vínculo oficial com a IDECAN, com a Prefeitura de
Campina Grande ou com o edital 01/2026, e não substituem a leitura do edital
oficial e do material didático especializado.
