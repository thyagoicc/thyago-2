# Materiais de estudo

Materiais esquematizados, gerados a partir de fonte HTML renderizada em PDF via Chromium headless.

---

## 1. Direito Administrativo — ISS Campina Grande/PB 2026

Material de estudo esquematizado dos **três primeiros tópicos** de Direito Administrativo
do conteúdo programático do cargo de **Auditor Fiscal da Receita Municipal**
(Edital nº 01/2026, de 09/05/2026 — Prefeitura Municipal de Campina Grande/PB, banca IDECAN).

### Tópicos cobertos

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

### Arquivos

- `Direito Administrativo - ISS Campina Grande 2026 - Topicos 1 a 3.pdf` — material final (26 páginas)
- `fonte-material.html` — fonte do PDF

### Observações

- Provas IDECAN com gabarito único para vários cargos/tipos não permitem casar item↔letra com
  segurança; nesses casos adotou-se a doutrina majoritária, com sinalização no comentário.
- Questões anuladas estão marcadas como tal e foram aproveitadas como material didático.

---

## 2. Restos a Pagar, DEA e Suprimento de Fundos — SEFAZ-AL 2026

Reescrita da **parte teórica** da Aula 10 de Finanças Públicas (Orçamento Público + LRF) do
curso para **Auditor Fiscal da Administração Tributária Estadual — SEFAZ-AL**, pós-edital.

### O que muda em relação ao original

O material de origem apresenta os três institutos em blocos independentes, com a teoria
interrompida por baterias de questões. A reescrita reorganiza tudo em torno de **um único eixo
lógico** — a tensão entre um orçamento anual e um processo de despesa em três estágios que não
cabe no ano civil — do qual os três institutos são derivados como respostas a três problemas
distintos:

| Situação em 31/12 | Instituto | Ideia de uma linha |
|---|---|---|
| Empenho feito, pagamento não saiu | Restos a Pagar | O empenho sobrevive ao ano |
| Dívida real, sem empenho vivo | DEA | A dívida sobrevive ao empenho |
| Despesa que não pode esperar o rito | Suprimento de Fundos | O gasto vem antes da comprovação |

Também foram acrescentados: fórmulas de cálculo explicadas (e não apenas enunciadas),
mnemônicas, um diagrama da linha do tempo de bloqueio/cancelamento de RP não processados,
um quadro comparativo RP × DEA e um mapa das dez trocas típicas de banca.

### Base de calibragem

A extensão de cada seção foi dimensionada pela incidência real nas **50 questões comentadas**
da aula, somadas às ~40 questões intercaladas na teoria (CEBRASPE/CESPE, FCC, FGV, VUNESP e
IADES, de 2016 a 2025):

| Tema | Questões | % |
|------|---------:|--:|
| Restos a Pagar | 33 | 66% |
| Suprimento de Fundos | 10 | 20% |
| Fronteira RP × DEA | 4 | 8% |
| DEA isoladamente | 3 | 6% |

Cada afirmação teórica é ancorada nas questões que a cobram, com marcação do número da questão
no material original.

### Arquivos

- `Restos a Pagar, DEA e Suprimento de Fundos - SEFAZ-AL 2026 - Teoria Reescrita.pdf` — material final (25 páginas)
- `fonte-restos-a-pagar-dea-suprimento-de-fundos.html` — fonte do PDF

### Observações

- Não há conteúdo normativo novo: todas as fontes (Lei nº 4.320/1964, Decreto nº 93.872/1986,
  LRF, MCASP, CF/1988, decretos e portarias) vêm do próprio material de origem.
- A seção 4.4 registra duas imprecisões do material original: a regra "pertencem ao exercício
  financeiro as despesas nele legalmente empenhadas" está no **art. 35** da Lei nº 4.320/1964
  (o original a atribui ora ao art. 34, ora ao art. 36), e o enunciado do CEBRASPE/CGDF 2023 traz
  "despesas empenhadas e líquidas" onde se lê "liquidadas".

---

## Como regerar os PDFs

```
chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="<saida>.pdf" "file://$PWD/<fonte>.html"
```
