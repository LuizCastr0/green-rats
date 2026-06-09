import os
from pathlib import Path

def gerar_arvore(diretorio, pastas_ignoradas, prefixo=""):
    path = Path(diretorio)
    
    try:
        itens = sorted([
            item for item in path.iterdir() 
            if item.name not in pastas_ignoradas and not item.name.startswith('.')
        ])
    except PermissionError:
        return

    for i, item in enumerate(itens):
        # 🟢 Trocado para caracteres simples que não quebram o Code Runner
        extensao = "|__ " if i == len(itens) - 1 else "|-- "
        print(f"{prefixo}{extensao}{item.name}")

        if item.is_dir():
            # 🟢 Ajustado o espaçamento simples
            proximo_prefixo = prefixo + ("    " if i == len(itens) - 1 else "|   ")
            gerar_arvore(item, pastas_ignoradas, proximo_prefixo)

if __name__ == "__main__":
    raiz = os.getcwd()
    print(f"Estrutura de: {raiz}")
    
    bloqueados = ["node_modules", ".git", "__pycache__", ".next", "dist", ".expo", ".vscode"]
    
    print(".")
    gerar_arvore(raiz, pastas_ignoradas=bloqueados)