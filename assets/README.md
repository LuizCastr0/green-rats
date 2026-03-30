# assets/

Esta pasta contém **todos os arquivos estáticos** do app — imagens, ícones, fontes e sons. Nenhum arquivo de código vive aqui.

---

## Estrutura interna

```
assets/
├── images/       ← ilustrações e imagens de fundo
├── icons/        ← ícones do app (ícone do app nas lojas, splash screen)
└── sounds/       ← efeitos sonoros de recompensa
```

---

## Regras de formato e tamanho

### Imagens (`images/`)

| Uso | Formato | Tamanho máximo |
|-----|---------|---------------|
| Ilustrações | PNG (fundo transparente) | 500 KB |
| Fundos de tela | JPG | 300 KB |
| Splash screen | PNG | 200 KB |

Sempre salve imagens em resolução **3x** (para telas de alta densidade). Exemplo: se a imagem aparece com 100x100px na tela, o arquivo deve ser 300x300px.

### Ícones (`icons/`)

| Arquivo | Tamanho | Para quê |
|---------|---------|---------|
| `icon.png` | 1024x1024px | Ícone do app nas lojas |
| `splash.png` | 1284x2778px | Tela de carregamento |
| `adaptive-icon.png` | 1024x1024px | Ícone adaptativo Android |

Estes arquivos são referenciados no `app.json` — não renomeie sem combinar com o líder.

### Sons (`sounds/`)

| Formato | Por quê |
|---------|---------|
| MP3 | Compatível com Android e iOS |
| Tamanho máximo | 100 KB por arquivo |

Sons devem ser curtos (menos de 3 segundos) e não muito altos.

---

## Como nomear arquivos

Use `kebab-case` — tudo minúsculo, palavras separadas por hífen:

```
 meta-concluida.mp3
 fundo-home.jpg
 ilustracao-planta.png

 MetaConcluida.mp3
 fundo home.jpg      ← espaços no nome causam problemas
 ilustração.png      ← sem acentos no nome de arquivos
```

---

## Como usar nas telas e componentes

```js
// Imagem
import { Image } from 'react-native';

<Image
  source={require('../../assets/images/ilustracao-planta.png')}
  style={{ width: 100, height: 100 }}
/>

// Som (usando expo-av)
import { Audio } from 'expo-av';

const { sound } = await Audio.Sound.createAsync(
  require('../../assets/sounds/meta-concluida.mp3')
);
await sound.playAsync();
```

---

## Arquivos existentes

> Atualize quando adicionar um arquivo novo.

| Arquivo | Onde fica | Para quê |
|---------|-----------|---------|
| *(vazio por enquanto)* | | |

---

## Regras desta pasta

-  Nomes em kebab-case, sem espaços, sem acentos
-  Imagens otimizadas antes de adicionar (use squoosh.app para comprimir)
-  Sempre atualizar a tabela acima ao adicionar um arquivo
-  Não colocar arquivos `.js` aqui
-  Não colocar arquivos maiores que 1 MB sem combinar com o líder
-  Não usar imagens baixadas da internet sem verificar a licença — use somente imagens de uso livre (Unsplash, Pexels, Flaticon com atribuição)
