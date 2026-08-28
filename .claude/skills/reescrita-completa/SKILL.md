---
name: reescrita-completa
description: Reescreve a parte teórica de um material de estudo para concurso (PDF de aula do Estratégia, Direção, Gran, apostila, PDF de curso) de forma mais compreensível, coesa e intuitiva, calibrada pelas questões cobradas no próprio material. Use sempre que o usuário pedir "reescrita completa", "reescreva a teoria", "reescreva esse material", "deixe esse material mais claro/intuitivo/coeso", ou anexar um PDF de aula pedindo qualquer forma de reorganização, resumo estruturado ou esquematização do conteúdo — mesmo que ele não use a palavra "reescrita". Entrega um PDF novo no diretório material/ do repositório, gerado a partir de fonte HTML, com commit e push.
---

# Reescrita completa de material de estudo

## O que esta skill entrega

Um material novo — não um resumo do antigo. O PDF de origem quase sempre tem o conteúdo
normativo certo e a *organização* errada: tópicos em blocos independentes, regras
apresentadas como coisas a decorar, teoria interrompida por baterias de questões, e
extensão distribuída por tradição editorial em vez de por incidência em prova.

A reescrita corrige a organização mantendo o conteúdo. O usuário estuda para passar em
concurso: o critério de qualidade é **quantas questões o material faz ele acertar**, não
quantas páginas ele cobre.

Entrega padrão: **fonte HTML + PDF** em `material/`, README atualizado, commit e push na
branch designada da sessão. Não publique artifact por padrão — mas se o usuário disser que
não consegue baixar ou abrir o PDF, ofereça a versão em página web (veja "Quando o PDF não
serve", no fim).

## O processo

### 1. Extrair o texto do PDF

Use o script incluído — ele já resolve os dois problemas recorrentes (o `pypdf` quebra por
conflito de `cffi`/`cryptography` no ambiente, e a extração sai com uma palavra por linha):

```bash
python3 .claude/skills/reescrita-completa/scripts/extrair-pdf.py <arquivo.pdf> <dir-saida>
```

Ele grava `clean.txt` (texto normalizado, com marcação de página) e fatias `parte1.txt`,
`parte2.txt`… de tamanho legível. Leia **todas** — inclusive as páginas de questões.

### 2. Ler o material inteiro antes de escrever qualquer coisa

Isso não é opcional e não dá para terceirizar. A qualidade da reescrita vem inteira de duas
coisas que só aparecem na leitura completa: **qual é o eixo que unifica os blocos** e **o
que a banca realmente faz com o conteúdo**. Nenhuma das duas está enunciada no material.

### 3. Classificar todas as questões e montar a tabela de incidência

Percorra as questões comentadas e as intercaladas na teoria. Classifique cada uma por tema
principal, e conte. O resultado é uma tabela que vai para dentro do material, logo no começo:

| Tema | Questões | % | Concentração interna |
|---|---:|---:|---|

A tabela tem duas funções. Para o usuário, é orientação de estudo. Para você, é a régua que
**dimensiona cada seção**: um tema com 66% das questões recebe uma Parte inteira; um tema
que ocupa dez páginas do original e rendeu uma questão vira meia página. A extensão do
material original não é evidência de nada.

Desça um nível dentro do tema dominante. Saber que "Restos a Pagar = 66%" ajuda pouco;
saber que "a distinção processado × não processado é 11 das 33" diz exatamente onde
concentrar a explicação.

Quando um tema tem baixa incidência **mas é alteração legislativa recente**, registre isso —
é o perfil do que as bancas cobram em seguida, e comprimir sem avisar seria um desserviço.

### 4. Achar o eixo organizador

Esta é a parte que faz a reescrita valer a pena. Procure a pergunta única da qual os tópicos
do material são respostas diferentes. Ela quase sempre existe e quase nunca está escrita.

Exemplo real (Aula 10 de Finanças Públicas): o material tratava Restos a Pagar, Despesas de
Exercícios Anteriores e Suprimento de Fundos como três assuntos. São três respostas à tensão
entre um orçamento anual e um processo de despesa em três estágios que não cabe no ano civil
— e de uma única regra ("o que define o exercício de uma despesa é o empenho, não o
pagamento") deduz-se quase tudo que o material mandava decorar.

Sinais de que você achou o eixo certo:

- Uma frase curta resolve um bloco inteiro de questões de fronteira entre institutos.
- Regras que o original lista lado a lado passam a ter uma **ordem necessária** entre si.
- Você consegue prever a resposta de uma questão sem consultar a seção correspondente.

Se não achar, não invente um: uma organização honesta por incidência já é uma melhoria
grande. Um eixo forçado é pior que nenhum.

### 5. Escrever

**Deduza, não decrete.** Onde o original manda decorar, mostre de onde vem. A mecânica
extraorçamentária dos restos a pagar, por exemplo, vira quatro passos de "siga o dinheiro"
em vez de duas regras a memorizar. O que se deduz não se esquece e sobrevive a uma questão
com redação nova; o que se decora falha assim que a banca muda uma palavra.

**Explique o porquê das regras substantivas.** "RP processado não pode ser cancelado" é uma
regra a decorar. "Cancelar seria enriquecimento ilícito, porque o fornecedor já cumpriu a
obrigação de fazer" é uma razão — e ela também explica por que a mecânica de cancelamento
alcança só os não processados.

**Ancore cada ponto teórico nas questões que o cobram.** Use marcas curtas (`Q7`, `Q12`)
remetendo à numeração do material original, para o usuário poder voltar à fonte. Uma
afirmação teórica sem questão atrás dela é candidata a corte.

**Exponha os pares contraditórios.** O achado mais valioso da leitura completa são questões
com conteúdo quase idêntico e gabaritos opostos, que no original estão a dezenas de páginas
de distância. Lado a lado, elas ensinam o critério real da banca:

- mesmo conteúdo, verbos diferentes ("são" exclui, "englobam" inclui);
- erros espelhados (uma cria exceção onde não há, outra elimina a exceção que existe);
- descrição correta com rótulo trocado.

**Fórmulas explicadas.** Não basta enunciar `RPP = liquidado − pago`. Diga por que: o que foi
liquidado e não pago está parado entre o 2º e o 3º estágio. Aí o usuário reconstrói a fórmula
se esquecer, e sabe o que fazer quando a tabela traz uma linha a mais (empenho cancelado).

**Mnemônicas e gatilhos**, quando forem honestos e curtos: "2 · 2 · 3" para uma linha do
tempo, "A-G-2-P" para uma lista de vedações, "entrega atestada = liquidação" para um gatilho
de leitura de enunciado. Mnemônica que exige decorar a mnemônica não serve.

**Um diagrama para o que não cabe na cabeça.** Tipicamente uma linha do tempo com bifurcação,
ou um fluxo de decisão. Use SVG inline. Um diagrama bom é melhor que três parágrafos; três
diagramas decorativos são piores que nenhum.

**Quadro comparativo direto** entre os institutos que a banca troca entre si, e um **mapa de
armadilhas** no fim, listando as trocas típicas com o motivo do erro.

**Sinalize erros do material original.** Artigo citado errado, gabarito duvidoso, enunciado
com erro da banca. O usuário vai responder prova com isso; precisão importa mais que
deferência à fonte. Registre em seção própria no fim, sem alarde — o conteúdo do comentário
costuma estar certo mesmo quando o número do artigo saiu trocado.

**Não acrescente conteúdo normativo de fora do material.** O escopo é o que o curso cobra.
Reorganizar, deduzir, explicar e conectar: sim. Trazer jurisprudência ou dispositivos novos:
não, salvo se o usuário pedir.

### 6. Gerar o PDF

Escreva a fonte em HTML seguindo o padrão visual já estabelecido no repositório — copie a
estrutura de `<style>` de `material/fonte-material.html` ou de
`material/fonte-restos-a-pagar-dea-suprimento-de-fundos.html`. Ambos têm capa, cabeçalhos de
parte, caixas semânticas (lei, alerta, mnemônica), blocos de questão e tabelas prontos para
impressão A4.

Escreva o HTML em pedaços num diretório de scratch e concatene — arquivos de 100 KB numa
tacada só são frágeis. Depois:

```bash
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --disable-gpu --no-sandbox \
  --no-pdf-header-footer --print-to-pdf="<Nome do Material>.pdf" "file://$PWD/<fonte>.html"
```

O binário `chromium` não está no PATH; use o caminho do Playwright acima (confira com
`find /opt/pw-browsers -maxdepth 3 -name chrome` se a versão mudar).

Confira o resultado antes de commitar: número de páginas e presença dos trechos-chave,
especialmente o texto dentro dos SVGs, que é onde a renderização costuma falhar em silêncio.

```bash
python3 -c "
from pypdf import PdfReader
r=PdfReader('<arquivo>.pdf'); print('páginas:', len(r.pages))
t=''.join(p.extract_text() or '' for p in r.pages)
for k in ['<trecho do diagrama>','<mnemônica>']: print('OK' if k in t else 'FALTA', k)
"
```

### 7. Publicar

Atualize `material/README.md` com uma seção para o novo material: o que muda em relação ao
original, a tabela de calibragem, os arquivos e as observações (incluindo os erros
sinalizados). Depois commit e push na branch designada da sessão.

A mensagem de commit descreve o **critério editorial**, não só o arquivo: qual eixo foi
adotado, como a extensão foi calibrada, o que foi acrescentado em relação ao original.

## O que não fazer

**Não preserve a ordem do original por respeito.** Se o material trata em três blocos o que é
um assunto só, junte. Se enterra na página 40 a regra que explica as páginas 3 a 39, promova
ela para a abertura.

**Não transcreva questões inteiras com comentário completo.** O pedido é reescrever a
*teoria*. As questões entram como âncora e prova de que o ponto cai — enunciado condensado ao
que importa, gabarito, e a razão do erro em uma ou duas frases.

**Não infle.** O material da Aula 10 saiu de ~54 páginas de teoria para 25. Isso é resultado,
não perda: saiu repetição, entrou densidade. Se a reescrita ficar maior que o original,
provavelmente você está resumindo em vez de reorganizar.

**Não use subagentes para a leitura.** O valor está em ter o material inteiro na cabeça ao
mesmo tempo; um relatório de terceiro perde exatamente os pares contraditórios que fazem a
diferença.

## Quando o PDF não serve

Se o usuário não conseguir baixar ou abrir o PDF (acontece no celular), ofereça a mesma
reescrita como página web publicada. Carregue a skill `artifact-design` antes de escrever, e
adapte a fonte para tela: coluna de leitura de ~68ch, barra de navegação fixa com as partes,
tabelas em contêiner com `overflow-x: auto`, e paleta em tokens que funcione nos dois temas.
O conteúdo é o mesmo; só a folha de estilo muda.
