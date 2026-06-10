
# GreenRats

GreenRats é um aplicativo educativo e gamificado para incentivar hábitos sustentáveis no dia a dia. Foi desenvolvido com Expo/React Native e usa pontos, streaks e conquistas para mostrar o impacto das escolhas do usuário.

--

**Comece rápido (para usuários pouco experientes)**

1. Baixar o APK (opcional): o APK de produção está incluído no repositório como `GreenRatsV2.apk` ou será disponibilizado via Drive. Para instalar no Android:



```powershell
# no Windows PowerShell, no diretório do projeto
# copie o APK para o seu celular ou use ADB
adb install -r GreenRatsV2.apk
```

Passo a passo (sem ADB):
- Transfira `GreenRatsV2.apk` para o celular via USB, e-mail ou Drive.
- No celular, abra o arquivo `GreenRatsV2.apk` pelo gerenciador de arquivos.
- Se solicitado, permita a instalação de fontes desconhecidas (Configurações → Segurança → Instalar apps de fontes desconhecidas).
- Confirme a instalação e abra o app.

Nota de segurança: instale APKs apenas de fontes confiáveis. Este APK foi gerado pela equipe do projeto.

Se preferir rodar via Expo (modo desenvolvimento):

```bash
npm install
npx expo start
```

Abra o QR code com o app Expo Go (Android/iOS) ou use emulador.

--

**Guia rápido de uso (após abrir o app)**

- Na primeira execução, preencha seu nome e marque as atividades que já fazem parte da sua rotina.
- Na aba Hoje, toque nas atividades que você completou para registrar pontos e impacto de carbono.
- A aba Conquistas mostra seu histórico, pontos acumulados, streak (dias seguidos com ações) e conquistas desbloqueadas.
- Use o botão de compartilhar na tela de conquistas para gerar um story (imagem) e postar nas redes.

--

## O que o app faz (detalhado)

- Cria um perfil local com `nome`, `nível` e `atividadesHabituais`.
- Exibe uma missão do dia com recompensa em pontos.
- Lista atividades categorizadas (alimentação, energia, consumo, resíduos, etc.).
- Registra cada ação no `historico` e atualiza `pontuacao` e `streak`.
- Calcula impacto de carbono quando `carbonoKg` está presente.

--

## Telas principais

- `SetupScreen`: cadastro inicial (nome + seleção de atividades).
- `HomeScreen`: missão do dia, lista de atividades, barra de progresso e registro rápido.
- `ConquistasScreen`: resumo, estatísticas, conquistas, histórico e opção de gerar story.

--

## Estrutura do projeto (resumo técnico)

- `App.js` — ponto de entrada; carrega `UserProvider` e configura `NavigationContainer`.
- `src/navigation/index.js` — define `BottomTabNavigator` e navegação para `Dev`.
- `src/context/UserContext.js` — estado global: `pontos`, `streak`, `nivel`, `nome`.
- `src/data/atividades.js` — catálogo de atividades com `id`, `pontos`, `carbonoKg`, `descricao`.
- `src/data/conquistas.js` — regras e metas para desbloqueio de conquistas.
- `src/services/Armazenamento.js` — interface com `AsyncStorage` (progresso, pontuação, histórico, streak).
- `src/services/LogicaApp.js` — regras de registro de ações, cálculo de streak e checagem de conquistas.

--

## Como o app mede impacto e pontuações

- Cada atividade tem `pontos` (inteiro positivo ou negativo).
- Campos opcionais: `carbonoKg` (kgCO₂e); quando presente, acumulado no relatório.
- `historico` guarda entradas com `id`, `acao`, `pontos` e `data`.
- `streak` é atualizado considerando se houve atividade no dia; existe suporte a data simulada para testes.

--

## Dependências principais

- `expo` e ferramentas do ecossistema Expo
- `react-native`
- `@react-navigation/*` (navegação)
- `@react-native-async-storage/async-storage` (persistência)
- `react-native-view-shot` + `expo-sharing` (gerar e compartilhar stories)

--

## Teoria, fontes e referências (resumo)

O projeto combina princípios de gamificação com métricas de impacto ambiental:

- Gamificação: pontos, conquistas e streaks são técnicas comprovadas para aumentar engajamento e formação de hábitos.
- Pegada de carbono: `carbonoKg` é uma estimativa por ação; para documentação final, use fontes acadêmicas e bases de dados de emissões (IPCC, publicações científicas e estudos setoriais).
- Educação ambiental: relaciona-se a teorias de mudança comportamental (p. ex. Fogg Behavior Model) e aprendizado por reforço positivo.

Referências sugeridas para o documento teórico:
- IPCC reports
- Estudos acadêmicos sobre food footprint (carne x vegetal)
- Artigos sobre gamificação aplicados à mudança de comportamento

--

## Entrega e material extra

 - Repositório público no GitHub (atualizar com link antes da entrega final).
 - Arquivo APK incluído: `GreenRatsV2.apk` (ver raiz do projeto).
 - Documento teórico e demais materiais foram colocados no Drive neste link:
	 - [Drive — APK e documentos do GreenRats](https://drive.google.com/drive/folders/1IBRMPSAf3pLC94RQjyV5_nWVILPXeCXN?usp=drive_link)

--

## Observações e cuidados

- O app usa armazenamento local (`AsyncStorage`); os dados não são sincronizados por padrão.
- Ao instalar APKs manualmente, o usuário pode precisar liberar permissões de fontes desconhecidas.
- Para testes repetíveis, há suporte a data simulada em `src/services/Armazenamento.js`.

--

## Contribuindo

- Siga as regras de branches e commits descritas em `CONTRIBUTING.md`.
- Antes de enviar PR, rode `npm install` e `npx expo start` para testar localmente.

--

## Próximos passos sugeridos

- Incluir tela de perfil editável
- Adicionar metas/desafios semanais e comparativos
- Inserir gráficos de progresso e exportação de relatórios
- Validar e referenciar todas as estimativas de carbono no documento teórico

--


