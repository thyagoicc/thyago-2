#!/usr/bin/env python3
"""Extrai e normaliza o texto de um PDF de material de estudo.

Resolve dois problemas recorrentes deste ambiente:

1. O pypdf importa `cryptography`, cuja instalação Debian quebra com
   `ModuleNotFoundError: _cffi_backend`. A correção é reinstalar cffi e
   cryptography com --ignore-installed; o script faz isso sozinho se preciso.
2. A extração desses PDFs sai com uma palavra por linha (o texto é posicionado
   glifo a glifo), o que torna a leitura inviável. O script rejunta as linhas
   por página.

Uso:
    python3 extrair-pdf.py <arquivo.pdf> <dir-saida> [--paginas-por-fatia N]

Gera em <dir-saida>:
    clean.txt   texto normalizado, com marcação "===== PÁGINA n ====="
    parteN.txt  fatias de ~15 páginas, em tamanho legível de uma vez
"""

import argparse
import pathlib
import re
import subprocess
import sys


def garantir_pypdf():
    try:
        import pypdf  # noqa: F401
        return
    except ModuleNotFoundError:
        pass
    except Exception:
        # Tipicamente o PanicException do cffi/cryptography quebrado.
        pass

    subprocess.run(
        [sys.executable, "-m", "pip", "install", "--quiet", "pypdf"],
        check=False,
    )
    try:
        import pypdf  # noqa: F401
        return
    except Exception:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "--quiet",
             "--ignore-installed", "cffi", "cryptography"],
            check=True,
        )
    import pypdf  # noqa: F401


def extrair(pdf_path, saida_dir, paginas_por_fatia):
    from pypdf import PdfReader

    saida = pathlib.Path(saida_dir)
    saida.mkdir(parents=True, exist_ok=True)

    leitor = PdfReader(str(pdf_path))
    paginas = []
    for pagina in leitor.pages:
        bruto = pagina.extract_text() or ""
        # Rejunta a extração palavra-por-linha e colapsa espaços.
        texto = " ".join(l.strip() for l in bruto.split("\n") if l.strip())
        paginas.append(re.sub(r"\s+", " ", texto))

    limpo = "".join(
        f"\n\n===== PÁGINA {i} =====\n{t}" for i, t in enumerate(paginas, 1)
    )
    (saida / "clean.txt").write_text(limpo, encoding="utf-8")

    fatias = 0
    for inicio in range(0, len(paginas), paginas_por_fatia):
        fatias += 1
        bloco = "".join(
            f"\n\n===== PÁGINA {i} =====\n{t}"
            for i, t in enumerate(
                paginas[inicio:inicio + paginas_por_fatia], inicio + 1
            )
        )
        (saida / f"parte{fatias}.txt").write_text(bloco.lstrip(), encoding="utf-8")

    print(f"páginas: {len(paginas)}")
    print(f"clean.txt: {(saida / 'clean.txt').stat().st_size} bytes")
    print(f"fatias: {fatias} (parte1.txt … parte{fatias}.txt) — leia todas")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("pdf")
    ap.add_argument("saida")
    ap.add_argument("--paginas-por-fatia", type=int, default=15)
    args = ap.parse_args()

    garantir_pypdf()
    extrair(args.pdf, args.saida, args.paginas_por_fatia)


if __name__ == "__main__":
    main()
