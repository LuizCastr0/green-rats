# Guia interno da equipe — EcoRank

>  Este arquivo é para uso interno da equipe de desenvolvimento.
> Ele será removido antes de tornar o repositório público.

---

## O que é este arquivo

Este é o manual de bordo do projeto para quem vai codar. Explica como o projeto está organizado, onde cada coisa fica, como trabalhar sem quebrar o que os outros fizeram, e as regras que todo mundo precisa seguir.

**Leia do início ao fim antes de mexer em qualquer arquivo.**

---

## Estrutura geral do projeto

```
ecorank-app/
│
├── src/                    ← TODO o código do app vive aqui
│   ├── screens/            ← cada tela do app
│   ├── components/         ← pedaços reutilizáveis de tela
│   ├── data/               ← conteúdo do jogo (metas, textos, pontos)
│   ├── services/           ← lógica e funções sem visual
│   ├── navigation/         ← como as telas se conectam
│   └── styles/             ← cores, fontes e espaçamentos globais
│
├── assets/                 ← imagens, ícones e sons
├── App.js                  ← ponto de entrada — NÃO MEXER
├── app.json                ← configurações do Expo — NÃO MEXER sem combinar
├── package.json            ← dependências — NÃO MEXER sem combinar com o grupo
├── .gitignore              ← arquivos que o Git ignora — NÃO MEXER
├── CONTRIBUTING.md         ← este arquivo
└── README.md               ← descrição pública do projeto
```

Cada pasta tem um `README.md` interno explicando as regras específicas daquela pasta. Leia o README da pasta onde você vai trabalhar antes de criar qualquer arquivo.

---

## A regra mais importante

**Cada pessoa trabalha na sua pasta. Ninguém edita o arquivo do outro sem avisar.**

Se você precisa de algo que está no arquivo de outra pessoa (um componente, uma função, um dado), você *importa* — não copia e não edita o arquivo dela. Se precisar que o arquivo dela mude, conversa com a pessoa.

---

## Como o código se comunica entre as pastas

O fluxo de dependência segue sempre esta direção:

```
screens  →  components
screens  →  services
screens  →  data
screens  →  styles
components  →  styles
services  →  data
navigation  →  screens
```

Isso significa:
- Uma `screen` pode importar de `components`, `services`, `data` e `styles`.
- Um `component` pode importar de `styles`. Não importa de `screens`.
- Um `service` pode importar de `data`. Não importa de `screens` nem de `components`.
- `data` não importa nada — é a base, só exporta.

**Se você está prestes a fazer um import que vai "na direção contrária" dessa lista, para e avisa o líder. Algo está errado no design.**

---

## Regras de nomenclatura — como nomear arquivos e funções

Seguir um padrão de nomes evita confusão sobre o que é o quê.

### Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Tela (screen) | PascalCase + Screen | `HomeScreen.js` |
| Componente | PascalCase | `CartaoMeta.js` |
| Serviço | camelCase + Service ou camelCase | `storageService.js` |
| Dado / conteúdo | camelCase | `metas.js`, `categorias.js` |
| Estilo global | camelCase | `theme.js` |

**PascalCase** = cada palavra começa com maiúscula: `CartaoMeta`, `HomeScreen`.  
**camelCase** = primeira palavra minúscula, demais com maiúscula: `storageService`, `calcularPontos`.

### Variáveis e funções dentro dos arquivos

```js
//  Correto
const pontuacaoTotal = 150;
function calcularPontos(meta) { ... }
const [metasConcluidas, setMetasConcluidas] = useState([]);

//  Errado
const PontuacaoTotal = 150;     // PascalCase é só para componentes
const pontuacao_total = 150;    // underscore não é padrão em JS
function CalcularPontos() { }   // função comum não é PascalCase
```

### Componentes React

```js
//  Correto — componente usa PascalCase
function CartaoMeta({ titulo, pontos }) {
  return (
    <View>
      <Text>{titulo}</Text>
    </View>
  );
}

export default CartaoMeta;
```

---

## Como trabalhar com o Git — o fluxo obrigatório

### Nunca trabalhe direto na `main`

A `main` é a versão que funciona. Ninguém empurra código diretamente nela.

### O fluxo correto todo dia

```bash
# 1. Antes de começar: puxar as novidades da equipe
git pull origin main

# 2. Criar sua branch com nome descritivo
git checkout -b feature/nome-do-que-voce-vai-fazer

# Exemplos de nomes bons:
# feature/tela-home
# feature/componente-cartao-meta
# feature/dados-categorias
# fix/bug-pontuacao-errada

# 3. Trabalhe, salve, teste no Expo Go

# 4. Quando terminar, commitar
git add .
git commit -m "descrição clara do que foi feito"

# 5. Enviar para o GitHub
git push origin feature/nome-do-que-voce-vai-fazer

# 6. Abrir Pull Request no GitHub e marcar o líder para revisar
```

### Como escrever uma mensagem de commit

A mensagem deve completar a frase: *"Este commit vai..."*

```bash
#  Mensagens boas
git commit -m "adicionar tela de metas diárias"
git commit -m "criar componente de barra de progresso"
git commit -m "corrigir cálculo de pontos da categoria transporte"
git commit -m "adicionar dados das metas de energia"

#  Mensagens ruins
git commit -m "alterações"
git commit -m "fix"
git commit -m "wip"
git commit -m "testando"
```

### Pull Request — o que escrever

Quando abrir o PR no GitHub, preencha:
- **Título:** o que foi feito em uma linha
- **Descrição:** o que mudou, por que mudous, e como testar

---

## Como rodar o projeto localmente

```bash
# Instalar dependências (só na primeira vez, ou quando package.json mudar)
npm install

# Iniciar o projeto
npx expo start

# Apontar o Expo Go do celular para o QR code que aparecer
```

O app vai recarregar automaticamente no celular toda vez que você salvar um arquivo.

---

## Erros comuns e o que fazer

| Erro | Causa provável | Solução |
|------|---------------|---------|
| `Unable to find expo` | Dependências não instaladas | Rodar `npm install` |
| `Unable to connect` no celular | Celular e PC em redes diferentes | Conectar ambos no mesmo Wi-Fi |
| Tela branca no celular | Erro de JavaScript | Ver o terminal — o erro aparece lá |
| `Cannot find module './X'` | Import com caminho errado | Verificar o caminho do arquivo importado |
| Conflito no `git pull` | Dois commits no mesmo arquivo | Avisar o líder — não tente resolver sozinho |

---

## O que fazer quando travar

1. Leia a mensagem de erro com calma. A maioria das mensagens diz exatamente o que está errado.
2. Copie o erro e busque no Google. Stack Overflow resolve 80% dos casos.
3. Se travou por mais de 15 minutos, manda o print do erro no grupo. Não fique horas sozinho.
4. Nunca delete arquivos do projeto para tentar resolver um erro. Sempre avise o líder primeiro.

---

## Perguntas frequentes

**Posso instalar uma biblioteca nova?**  
Não sem combinar com o líder. Novas bibliotecas mudam o `package.json` e podem quebrar o ambiente dos outros. Proponha no grupo, o líder instala e avisa todo mundo.

**Posso editar o `App.js`?**  
Não. O `App.js` é controlado pelo líder. Se precisar de algo que passa por ele, conversa antes.

**Onde coloco uma imagem nova?**  
Na pasta `assets/`. Veja o README dela para saber o formato e tamanho corretos.

**Minha tela ficou pronta. O que faço?**  
Testa bem no Expo Go, faz o commit, abre o Pull Request e marca o líder. Enquanto espera a revisão, pode começar a próxima tarefa numa branch nova.

**Posso usar IA (ChatGPT, Claude) para escrever código?**  
Sim, mas você é responsável pelo código que commitar. Se colou algo que não entende e quebrou outra coisa, é seu problema resolver. Entenda o que está colocando no projeto.
