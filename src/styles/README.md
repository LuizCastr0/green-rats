# styles/

Esta pasta contém **o sistema de design do app** — todas as cores, tamanhos de fonte, espaçamentos e bordas usados no projeto. É a fonte única da verdade visual.

---

## Por que centralizar os estilos

Sem um lugar central, cada pessoa define cores do jeito dela:

```js
// Dev A
color: '#1D6B4E'

// Dev B  
color: '#1d6b4e'

// Dev C
color: 'green'

// Dev D
color: '#1E6B4F'  // quase igual mas levemente diferente
```

O resultado é um app visualmente inconsistente. Com o `theme.js`, todos importam a mesma cor do mesmo lugar:

```js
color: theme.cores.destaque  // sempre o mesmo verde, em todo lugar
```

---

## O arquivo principal: theme.js

```js
// src/styles/theme.js

export const theme = {

  cores: {
    // Cores principais
    destaque:    '#1D6B4E',   // verde escuro — cor da marca
    destaqueClaro: '#E1F5EE', // verde claro — fundos de cards
    
    // Textos
    texto:       '#1A1A1A',   // texto principal
    textoMutado: '#6B6B6B',   // texto secundário, legendas
    
    // Superfícies
    fundo:       '#F9F9F9',   // fundo das telas
    superficie:  '#FFFFFF',   // fundo de cards e componentes
    
    // Feedback
    sucesso:     '#1D6B4E',
    erro:        '#A32D2D',
    aviso:       '#854F0B',
    info:        '#185FA5',
    
    // Categorias (devem coincidir com data/categorias.js)
    transporte:  '#1D6B4E',
    alimentacao: '#854F0B',
    energia:     '#185FA5',
    residuos:    '#3C3489',
  },

  fontes: {
    tamanhos: {
      pequeno:  12,
      normal:   16,
      medio:    18,
      grande:   22,
      titulo:   28,
    },
    pesos: {
      normal: '400',
      medio:  '500',
      negrito: '700',
    },
  },

  espacamento: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  bordas: {
    raio:       8,    // border-radius padrão
    raioGrande: 16,   // border-radius para cards grandes
    largura:    1,    // border-width padrão
    cor:        '#E0E0E0',
  },

};
```

---

## Como usar nas telas e componentes

```js
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.cores.fundo,
    padding: theme.espacamento.md,
  },
  titulo: {
    fontSize: theme.fontes.tamanhos.titulo,
    fontWeight: theme.fontes.pesos.negrito,
    color: theme.cores.texto,
  },
  card: {
    backgroundColor: theme.cores.superficie,
    borderRadius: theme.bordas.raio,
    padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm,
  },
});
```

---

## Regras desta pasta

- ✅ Toda cor, fonte e espaçamento usado no app vem daqui
- ✅ Quer adicionar uma cor nova? Adicione em `theme.js` e avise o grupo
- ✅ Quer mudar uma cor? Muda em `theme.js` — atualiza em todo o app automaticamente
- ❌ Nunca usar valores soltos como `color: '#fff'` ou `padding: 16` nas telas
- ❌ Não criar arquivos de estilo por tela aqui — estilos de cada tela ficam no próprio arquivo da tela, usando os valores do `theme`

---

## Referência rápida de espaçamentos

| Token | Valor | Quando usar |
|-------|-------|-------------|
| `xs` | 4px | Separação mínima entre elementos internos |
| `sm` | 8px | Espaçamento entre itens de uma lista |
| `md` | 16px | Padding padrão de telas e cards |
| `lg` | 24px | Separação entre seções |
| `xl` | 32px | Margens grandes, espaço antes de títulos |
| `xxl` | 48px | Espaço generoso em telas de destaque |

---

## Arquivos desta pasta

| Arquivo | O que contém |
|---------|-------------|
| `theme.js` | Cores, fontes, espaçamentos e bordas do app |
