# Provas analisadas para calibrar o nível "Extremo"

Este documento registra as provas reais efetivamente baixadas e analisadas
para calibrar os flashcards de nível **Extremo** (`dificuldade: "extremo"`),
no patamar de provas fiscais e de delegado.

O texto integral das provas foi extraído com `pdftotext -layout` e está em
[`data/corpus-provas/`](../data/corpus-provas/), servindo de referência de
estilo e de aferição de dificuldade. **Nenhuma questão foi copiada** — o
corpus foi usado para observar padrões de redação, profundidade exigida e
tipo de pegadinha; todos os flashcards são inéditos.

## Inventário (28 provas, 5 bancas)

### Compilação "10 Provas da Área Fiscal" (10 provas)

Arquivo: `10provas-fiscal-fcc-fgv-cespe.txt` (2,5 MB de texto)

| # | Banca | Concurso | Ano |
|---|-------|----------|-----|
| 1 | FCC | SEFAZ/GO — Auditor Fiscal | 2018 |
| 2 | FCC | SEFAZ/SC — Auditor Fiscal | 2018 |
| 3 | FCC | SEFAZ/MA — Auditor Fiscal | 2016 |
| 4 | FCC | SEFAZ/RJ — Auditor Fiscal | 2014 |
| 5 | FCC | SEFAZ/SP — Auditor Fiscal | 2014 |
| 6 | CESPE | SEFAZ/RS — Auditor Fiscal | 2018 |
| 7 | CESPE | SEFAZ/ES — Auditor Fiscal | 2013 |
| 8–10 | FGV / demais | Provas fiscais da compilação | 2013–2018 |

### Provas fiscais avulsas (8 provas)

| # | Banca | Concurso | Arquivo |
|---|-------|----------|---------|
| 11 | ESAF | Receita Federal — AFRFB 2014 | `esaf-2014-rfb-afrfb.txt` |
| 12 | ESAF | Receita Federal — AFRFB (prova 2, repositório ENAP) | `enap-p2-g2-afrfb.txt` |
| 13 | FGV | Receita Federal — AFRFB (tipo 4) | `fgv-afrfb.txt` |
| 14 | FCC | SEFAZ/PI — Auditor Fiscal da Receita Estadual 2025 | `fcc-2025-sefazpi-afre.txt` |
| 15 | FCC | SEFAZ/PE — Auditor Fiscal do Tesouro Estadual 2022 | `fcc-2022-sefazpe-afte.txt` |
| 16 | FCC | SEFAZ/BA — Auditor Fiscal 2019 | `fcc-2019-sefazba-afre.txt` |
| 17 | CEBRASPE | SEFAZ/AC — Auditor Fiscal 2023 | `cebraspe-sefazac23-afre.txt` |
| 18 | CEBRASPE | SEEC/DF — Auditor 2019 (com justificativas oficiais) | `cebraspe-seecdf19-auditor-just.txt` |

### Controle externo (1 prova)

| # | Banca | Concurso | Arquivo |
|---|-------|----------|---------|
| 19 | VUNESP | TCE/SP — Auditor de Controle Externo 2025 | `vunesp-2025-tcesp-auditor.txt` |

### Provas de delegado e carreiras policiais (9 provas)

| # | Banca | Concurso | Arquivo |
|---|-------|----------|---------|
| 20 | CEBRASPE | Polícia Federal — Delegado 2021 (objetiva) | `cebraspe-pf21-delegado-obj.txt` |
| 21 | CEBRASPE | Polícia Federal — Delegado 2021 (oral, com padrão de resposta) | `cebraspe-pf21-delegado-oral.txt` |
| 22 | CEBRASPE | PC/RJ — Delegado 2021 (objetiva) | `cebraspe-pcrj21-delegado-obj.txt` |
| 23 | CEBRASPE | PC/RJ — Delegado 2021 (discursiva de Direito Administrativo) | `cebraspe-pcrj21-delegado-dadm.txt` |
| 24 | CEBRASPE | PC/CE — Delegado 2025 (objetiva) | `cebraspe-pcce25-delegado-obj.txt` |
| 25 | CEBRASPE | PC/DF — Delegado 2026 | `cebraspe-pcdf26-delegado.txt` |
| 26 | CEBRASPE | PC/ES — Delegado 2022 | `qc-pces22-delegado.txt` |
| 27 | CEBRASPE | PC/DF — Escrivão 2019 (com justificativas oficiais) | `cebraspe-pcdf19-escrivao-just.txt` |
| 28 | CEBRASPE | PC/PB — Delegado 2021/2022 (referência de estilo) | — |

## Limitações honestas

- A prova **FCC 2026 SEFAZ/SP (AFRE)** foi baixada, mas o PDF é digitalizado
  (sem camada de texto), então não entrou no corpus textual — restam 27
  provas com texto explorável, ainda acima do mínimo de 25 pedido.
- Os sites da **VUNESP** (`documento.vunesp.com.br`) e da **IDECAN**
  (`concurso.idecan.org.br`) respondem **HTTP 403** a download automatizado,
  então provas hospedadas apenas neles não puderam ser incorporadas. A
  VUNESP entrou no corpus por uma cópia da prova do TCE/SP hospedada em CDN
  acessível.
- O edital oficial 01/2026 de Campina Grande/PB segue inacessível pelo mesmo
  bloqueio da IDECAN, conforme já registrado no README.

## Padrões de dificuldade extraídos do corpus

Observados diretamente nas provas acima e incorporados em
[`lib/nivelExtremoStyleGuide.js`](../lib/nivelExtremoStyleGuide.js):

1. **Jurisprudência nominada por número** — Temas de repercussão geral,
   súmulas e acórdãos citados explicitamente e cobrados em seus detalhes
   (ex.: Tema 1.199 do STF sobre retroatividade da Lei nº 14.230/2021, na
   prova de Delegado PC/CE 2025).
2. **Direito intertemporal** — aplicação de lei nova a fatos anteriores,
   trânsito em julgado, `tempus regit actum`, prescrição intercorrente.
3. **Legislação extravagante cruzada com Direito Administrativo** — ex.: a
   FGV, na prova de AFRFB, cobrou norma do Código de Trânsito Brasileiro à
   luz da teoria dos atributos do ato administrativo, dos poderes
   administrativos e da jurisprudência do STF sobre sanções políticas.
4. **Institutos periféricos** — enfiteuse sobre bem público, prescrição
   aquisitiva de bens de sociedade de economia mista, imóveis do SFH,
   intranscendência subjetiva das sanções, matriz de alocação de riscos.
5. **Distinção fina entre institutos vizinhos** — poder de polícia x poder
   disciplinar; concessão x permissão precária; anulação x revogação x
   cassação.
6. **Itens I/II/III encadeados** dentro de uma mesma situação hipotética,
   em que basta um erro para derrubar o conjunto.
