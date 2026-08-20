# Direito Administrativo — ISS Campina Grande/PB 2026

Material de estudo esquematizado de Direito Administrativo do conteúdo programático do cargo de
**Auditor Fiscal da Receita Municipal** (Edital nº 01/2026, de 09/05/2026 — Prefeitura Municipal
de Campina Grande/PB, banca IDECAN), em **dois volumes** que, juntos, cobrem os nove tópicos do
edital.

## Volume I — Tópicos 1 a 3

1. Administração Pública direta e indireta
2. Princípios da Administração Pública
3. Atos administrativos

### Base empírica

O conteúdo foi calibrado a partir da leitura de **34 cadernos oficiais de prova** de nível
superior, com os respectivos gabaritos, das três bancas de referência. Foram identificadas e
analisadas **109 questões** dos três tópicos:

| Banca    | Questões | Provas |
|----------|---------:|-------:|
| IDECAN   |       47 |     13 |
| FCC      |       31 |     11 |
| CEBRASPE |       31 |     10 |

## Volume II — Tópicos 4 a 9

4. Poderes administrativos
5. Serviços públicos
6. Controle da Administração Pública
7. Responsabilidade civil do Estado
8. Processo administrativo
9. Lei nº 14.133/2021 — noções gerais de licitações e contratos administrativos

### Base do conteúdo

Diferentemente do Volume I, o Volume II é construído sobre a **legislação em vigor** e a
**jurisprudência consolidada** do STF e do STJ, com as referências identificadas pelo número ao
longo do texto (artigos de lei, súmulas, súmulas vinculantes e temas de repercussão geral). Os
cinco diplomas que decidem esses tópicos são a Lei nº 9.784/1999, a Lei nº 14.133/2021, a Lei
nº 8.987/1995, os arts. 37, § 6º, e 70 a 75 da CF, e o art. 78 do CTN.

**As questões do Volume II são inéditas.** No Volume I, cada questão ao final do tópico era
transcrita de caderno oficial, com banca, órgão, ano e gabarito publicado. No Volume II não há
transcrição de prova real: as seções "Treino no padrão da banca" trazem itens escritos
especificamente para o material, imitando o formato de redação de IDECAN, FCC e CEBRASPE, e as
caixas de pegadinha apresentam formulações típicas de erro construídas a partir dos dispositivos
legais — não citações atribuídas a provas determinadas. A distinção está declarada no item 0.3 e
na nota metodológica final do próprio PDF.

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `Direito Administrativo - ISS Campina Grande 2026 - Topicos 1 a 3.pdf` | Volume I (26 páginas) |
| `fonte-material.html` | Fonte do PDF do Volume I |
| `Direito Administrativo - ISS Campina Grande 2026 - Topicos 4 a 9.pdf` | Volume II (44 páginas) |
| `fonte-material-topicos-4-a-9.html` | Fonte do PDF do Volume II |

Os dois volumes compartilham o mesmo sistema visual (tipografia, cores, caixas de destaque e
formato dos quadros comparativos), de modo que podem ser lidos e impressos em sequência.

## Como regenerar os PDFs

Os PDFs são renderizados a partir dos arquivos HTML com Chromium headless:

```bash
chromium --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="material/Direito Administrativo - ISS Campina Grande 2026 - Topicos 4 a 9.pdf" \
  "file://$PWD/material/fonte-material-topicos-4-a-9.html"
```

O tamanho da página (A4), as margens e as quebras de página estão definidos nas regras `@page`
e `page-break-*` dentro do próprio HTML.

## Observações

- Provas IDECAN com gabarito único para vários cargos/tipos não permitem casar item↔letra com
  segurança; nesses casos adotou-se a doutrina majoritária, com sinalização no comentário.
- Questões anuladas estão marcadas como tal e foram aproveitadas como material didático.
- Os valores de dispensa de licitação da Lei nº 14.133/2021 citados no Volume II são os
  **originais do texto legal**; o art. 182 determina sua atualização anual por decreto, de modo
  que os valores praticados são superiores. Confira o decreto vigente antes da prova.
