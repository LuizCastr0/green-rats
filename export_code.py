import os

# Arquivos a incluir no export — na ordem lógica
ARQUIVOS = [
    "App.js",
    "src/context/UserContext.js",
    "src/navigation/index.js",
    "src/data/atividades.js",
    "src/data/categorias.js",
    "src/data/conquistas.js",
    "src/data/missoes.js",
    "src/data/loja.js",
    "src/services/Armazenamento.js",
    "src/services/LogicaApp.js",
    "src/services/atividades.js",
    "src/services/estatisticas.js",
    "src/services/missao_service.js",
    "src/screens/SetupScreen.js",
    "src/screens/HomeScreen.js",
    "src/screens/ConquistasScreen.js",
    "src/screens/Loja_Screen.js",
    "src/screens/PerfilScreen.js",
    "src/components/PontosHeader.js",
    "package.json",
]

def gerar_arvore(pasta, prefixo=""):
    linhas = []
    itens = sorted([
        i for i in os.listdir(pasta)
        if i not in ("node_modules", ".git", ".expo", "__pycache__", "dist", "build")
    ])
    for i, item in enumerate(itens):
        caminho = os.path.join(pasta, item)
        conector = "└── " if i == len(itens) - 1 else "├── "
        linhas.append(prefixo + conector + item)
        if os.path.isdir(caminho):
            extensao = "    " if i == len(itens) - 1 else "│   "
            linhas.extend(gerar_arvore(caminho, prefixo + extensao))
    return linhas

def exportar():
    saida = []

    # Cabeçalho
    saida.append("=" * 70)
    saida.append("EXPORT DO PROJETO GREENRATS")
    saida.append("Gerado automaticamente por exportar_projeto.py")
    saida.append("=" * 70)
    saida.append("")

    # Árvore de diretórios
    saida.append("## ESTRUTURA DE PASTAS")
    saida.append("")
    saida.append(".")
    saida.extend(gerar_arvore("."))
    saida.append("")
    saida.append("=" * 70)
    saida.append("")

    # Código de cada arquivo
    saida.append("## ARQUIVOS DE CÓDIGO")
    saida.append("")

    for caminho in ARQUIVOS:
        saida.append("-" * 70)
        saida.append(f"ARQUIVO: {caminho}")
        saida.append("-" * 70)

        if os.path.exists(caminho):
            with open(caminho, "r", encoding="utf-8") as f:
                conteudo = f.read()
            saida.append(conteudo)
        else:
            saida.append(f"[ARQUIVO NÃO ENCONTRADO — ainda não foi criado]")

        saida.append("")

    # Salva o arquivo
    nome_saida = "projeto_greenrats_export.txt"
    with open(nome_saida, "w", encoding="utf-8") as f:
        f.write("\n".join(saida))

    print(f"Exportado com sucesso: {nome_saida}")
    print(f"Tamanho: {os.path.getsize(nome_saida) / 1024:.1f} KB")

if __name__ == "__main__":
    exportar()