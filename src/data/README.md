# data/

Esta pasta contém **o conteúdo do jogo** — as metas, categorias, textos explicativos, pontuações e qualquer outro dado fixo do app.

"Dado fixo" significa: coisas que não mudam enquanto o app está rodando, que fazem parte do jogo em si. O progresso do usuário (o que ele já fez, quantos pontos tem) fica em `services/`, não aqui.

---

## Por que separar o conteúdo do código

Porque pessoas diferentes cuidam de coisas diferentes. Quem escreve as metas e os textos explicativos não precisa saber programar — só precisa editar os arquivos desta pasta seguindo o formato correto. Quem programa as telas não precisa inventar conteúdo — importa daqui.

---

## Formato obrigatório dos dados

Todo arquivo desta pasta exporta um array ou objeto JavaScript. Nada mais.

### Exemplo — metas.js

```js
// src/data/metas.js

const metas = [
  {
    id: 'meta_001',               // identificador único — nunca repetir
    titulo: 'Usar transporte público',
    descricao: 'Substitua o carro ou moto por ônibus, metrô ou trem hoje.',
    explicacaoEcologica: 'Um ônibus cheio emite cerca de 6x menos CO₂ por passageiro do que um carro individual. Cada viagem de ônibus que você faz evita em média 2,6 kg de CO₂.',
    categoria: 'transporte',      // deve existir em categorias.js
    pontos: 50,
    dificuldade: 'facil',         // 'facil' | 'medio' | 'dificil'
    frequencia: 'diaria',         // 'diaria' | 'semanal'
    icone: 'bus',                 // nome do ícone (definido com o líder)
  },
  {
    id: 'meta_002',
    titulo: 'Refeição sem carne',
    descricao: 'Faça pelo menos uma refeição do dia sem carne vermelha ou frango.',
    explicacaoEcologica: 'A produção de 1 kg de carne bovina emite até 27 kg de CO₂. Uma refeição plant-based economiza em média 1,5 kg de CO₂.',
    categoria: 'alimentacao',
    pontos: 40,
    dificuldade: 'facil',
    frequencia: 'diaria',
    icone: 'leaf',
  },
];

export default metas;
```

### Exemplo — categorias.js

```js
// src/data/categorias.js

const categorias = [
  {
    id: 'transporte',
    nome: 'Transporte',
    cor: '#1D6B4E',     // cor do tema — confirmar com quem cuida de styles/
    icone: 'car-off',
  },
  {
    id: 'alimentacao',
    nome: 'Alimentação',
    cor: '#854F0B',
    icone: 'food-apple',
  },
  {
    id: 'energia',
    nome: 'Energia',
    cor: '#185FA5',
    icone: 'lightning-bolt',
  },
  {
    id: 'residuos',
    nome: 'Resíduos',
    cor: '#3C3489',
    icone: 'recycle',
  },
];

export default categorias;
```

---

## Arquivos desta pasta

> Atualize quando adicionar um arquivo novo.

| Arquivo | O que contém |
|---------|-------------|
| `metas.js` | Todas as metas do jogo com pontuação e explicação |
| `categorias.js` | Categorias de metas com nome, cor e ícone |
| *(adicione aqui)* | |

---

## Regras desta pasta

- ✅ Cada arquivo exporta um array ou objeto — sem lógica, sem funções
- ✅ Todo item tem um `id` único no formato `tipo_001`, `tipo_002`...
- ✅ Todo campo de texto em português, sem abreviações
- ✅ A `explicacaoEcologica` deve ter sempre um dado numérico concreto (ex: "2,6 kg de CO₂")
- ❌ Não salvar progresso do usuário aqui — isso vai em `services/`
- ❌ Não importar nada de outras pastas — `data/` não depende de ninguém
- ❌ Não inventar campos novos sem combinar — se precisar de um campo novo, proponha no grupo

---

## Como adicionar uma meta nova

1. Abra `metas.js`
2. Copie um objeto existente
3. Troque o `id` por um novo (sequencial: `meta_003`, `meta_004`...)
4. Preencha todos os campos
5. Certifique-se de que a `categoria` existe em `categorias.js`
6. Salve e teste — a meta deve aparecer no app automaticamente

---

## Como adicionar uma categoria nova

1. Abra `categorias.js`
2. Copie um objeto existente
3. Defina `id`, `nome`, `cor` e `icone`
4. Avise o líder — uma nova categoria pode precisar de ajustes nas telas
