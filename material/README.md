# Materiais de estudo

Materiais esquematizados para concursos, calibrados empiricamente a partir de provas oficiais
e gabaritos definitivos das bancas de referência.

---

## 1. Estatística e Probabilidade — SEFAZ/AL 2026

Material esquematizado de **todo o conteúdo programático** da disciplina para o cargo de
**Auditor Fiscal da Administração Tributária Estadual** (Edital nº 1 – SEFAZ/AL, de 24/08/2026,
banca CEBRASPE). A disciplina vale **10 dos 60 itens** da prova objetiva P1, no formato
**certo/errado**.

### Tópicos cobertos

As seções do material mapeiam um a um os itens numerados do programa (item 14.2.3 do edital):

| Item do edital | Seções |
|---|---|
| 1 · Estatística descritiva | 1.1 a 1.3 |
| 2 · Análise exploratória de dados | 1.1, 1.4 e 1.11 |
| 2.1 · Gráficos, diagramas, tabelas | 1.3 e 1.4 |
| 2.1 · Medidas de posição | 1.6 e 1.7 |
| 2.1 · Medidas de dispersão | 1.8 |
| 2.1 · Assimetria e curtose | 1.9 e 1.10 |
| 3 e 3.1 · Probabilidade, definições e axiomas | 2.1 a 2.4 |
| 3.2 · Condicional e independência | 2.4 a 2.9 |
| 4 e 4.1 · Amostragem (as quatro técnicas) | 3.1 a 3.11 |

Cada subtópico traz teoria detalhada, quadros comparativos e **exemplos resolvidos passo a passo**.
Toda a estatística descritiva é desenvolvida sobre uma **tabela mestre única** — média, mediana,
moda de Czuber, quartis, percentis, variância, CV, três coeficientes de assimetria e curtose
percentílica nascem do mesmo conjunto de dados. Há ainda um exemplo completo em **dados brutos**
(rol, sem agrupamento) e uma **tabela de dupla entrada** para probabilidade condicional.

Cada tópico termina com um **teste rápido** de oito itens certo/errado, com gabarito comentado,
antes das questões reais.

### Figuras

O material traz **8 diagramas** desenhados em SVG, todos derivados dos dados do próprio texto:

| Figura | Onde |
|---|---|
| Histograma + polígono de frequências da tabela mestre | 1.4.1 |
| Ogiva, com a leitura gráfica de Q₁, mediana e Q₃ | 1.4.1 |
| As três formas de assimetria, com a ordem de média, mediana e moda | 1.9 |
| As três curvas de curtose | 1.10 |
| Boxplot anotado, com os cinco números e o limite de outlier | 1.11 |
| Diagramas de Venn: união, interseção, complementar e exclusivos | 2.1 |
| Árvore de probabilidade da malha fina (Bayes) | 2.6 |
| Esquema das quatro técnicas de amostragem sobre a mesma população | 3.9 |

A paleta categórica das figuras foi validada com o verificador de contraste e daltonismo
(pior par sob CVD ΔE 10,6; visão normal ΔE 19,8); toda forma colorida recebe rótulo direto, de modo
que nenhuma identidade depende só da cor.

### Base empírica

Foram baixados do repositório oficial do CEBRASPE e processados **582 arquivos** — 291 cadernos de
provas objetivas e 291 gabaritos definitivos — de **46 concursos**, varridos automaticamente em
busca dos blocos de Estatística e Probabilidade. Os **11 blocos** localizados foram analisados item
a item, totalizando **62 questões** (50 no formato certo/errado e 12 de múltipla escolha).

| Eixo do programa      | Questões | % |
|-----------------------|---------:|---:|
| Estatística descritiva |      27 | 44% |
| Probabilidade          |      17 | 27% |
| Amostragem             |      17 | 27% |
| Inferência (fora do edital de AL) | 1 | 2% |

Blocos analisados: BCB 2024, SUSEP 2025, SEFAZ/RJ 2025, CGE/RJ 2023, ANA 2024, TCE/RN 2025,
SEFAZ/RN 2025, TC/DF 2024, SEEC/DF 2019, ANEEL 2025 e TC/DF 2020.

### Arquivos

- `Estatistica e Probabilidade - SEFAZ AL 2026.pdf` — material final (49 páginas)
- `fonte-estatistica-sefaz-al-2026.html` — fonte do PDF (renderizado via Chromium headless)

### Observações

- Cada gabarito citado foi conferido contra o gabarito **definitivo** do respectivo concurso, e todo
  resultado numérico foi recalculado de forma independente.
- As justificativas identificadas como "justificativa oficial" são transcrições dos documentos de
  gabarito comentado publicados pela própria banca (SEEC/DF 2019 e TC/DF 2024).
- Um item da SEFAZ/RN 2025 sobre ANOVA foi mantido no levantamento, mas sinalizado como **fora** do
  conteúdo programático de Alagoas.
- A questão 54 da SEFAZ/RN 2025 (contagem de medidas de dispersão) é comentada com o gabarito oficial
  e com a ressalva de que a contagem comporta leitura divergente. O mesmo vale para o item 19 do
  ANA 2024, cujo gabarito depende da interpretação do enunciado e não do conceito.
- A Parte 0 documenta as regras de pontuação a partir do próprio edital (itens 8.2, 8.11.2 e 8.11.4):
  na P1, **cada item errado subtrai exatamente o que um item certo acrescenta**, o branco vale zero e a
  nota mínima é 12 pontos líquidos — o que sustenta a estratégia de marcação recomendada.

---

## 2. Direito Administrativo — ISS Campina Grande/PB 2026

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
- `fonte-material.html` — fonte do PDF (renderizado via Chromium headless)

### Observações

- Provas IDECAN com gabarito único para vários cargos/tipos não permitem casar item↔letra com
  segurança; nesses casos adotou-se a doutrina majoritária, com sinalização no comentário.
- Questões anuladas estão marcadas como tal e foram aproveitadas como material didático.
