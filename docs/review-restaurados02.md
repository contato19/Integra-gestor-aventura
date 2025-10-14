# Revisão técnica — Layout "Restaurados_02"

## Visão geral
O HTML/CSS/JS fornecido representa um fluxo completo para criação e manutenção de roteiros, mas há várias inconsistências estruturais e de integração que precisam ser resolvidas antes de unir com o restante do projeto. Os pontos abaixo foram organizados por camada para facilitar o retrabalho futuro.

## Problemas no HTML
- **Atributo incorreto no botão de menu** – o segundo botão em `.menu-group[data-block="roteiro"]` foi escrito como `<button class a="menu-item" ...>`, quebrando o atributo `class` e tornando o botão inacessível via CSS/JS.
- **Referências a elementos inexistentes** – o JavaScript espera elementos como `#panel-ativos`, `#toast`, `#confirm`, `#confirmText`, `#confirmYes` e `#confirmNo`, mas eles não estão declarados no markup, o que gera erros ao tentar manipular classes ou texto.
- **Container faltante para pontos de embarque** – o botão `#addPontoBtn` adiciona novos `<select>` dentro de `#pontosEmbarqueContainer`, porém esse container não existe no HTML, resultando em erro ao chamar `appendChild`.
- **Painel alternativo não definido** – as ações de menu "Roteiros Ativos" tentam exibir um painel alternativo através de `showAtivos()`, mas não há nenhuma seção correspondente no HTML para ocupar o papel de `panelAtivos`.
- **Dependências externas sem previsão de carregamento** – o script usa `flatpickr`, mas nenhuma folha de estilo ou script dessa biblioteca é importado no `<head>`.
- **Caminhos de assets divergentes** – o HTML referencia `style.css` e `script.js` na raiz, enquanto a estrutura atual do projeto usa subpastas (`css/style.css` e `js/main.js`). É preciso alinhar os caminhos ou mover os arquivos.
- **Botões sem `type` explícito** – em um formulário complexo, os botões dentro de `<section>` podem disparar submissão implícita; definir `type="button"` evita comportamentos inesperados.
- **Uso incorreto de `window.scrollTo`** – o valor `behavior: 'instant'` não faz parte da especificação; o correto seria `behavior: 'auto'` ou remover a propriedade.

## Problemas no JavaScript
- **Falha imediata por dependências globais** – `flatpickr` é invocado logo após o carregamento, mas como a biblioteca não é carregada gera `ReferenceError`, impedindo qualquer outra lógica de executar.
- **Função não definida** – `renderActiveList()` é chamada ao clicar em "Roteiros Ativos", mas não existe implementação no script, provocando `ReferenceError`.
- **Manipulação de elementos nulos** – o código chama `panelAtivos.classList.add(...)` e `toast.textContent = ...` sem verificar se os elementos foram encontrados, causando `TypeError` quando o seletor retorna `null`.
- **Associação equivocada de eventos** – o handler de "Percurso de viagem" (`#percursoViagem`) verifica `#embarqueObs` apenas no momento da troca do switch. Como não há listener para o campo de texto, a mensagem de aviso não acompanha as alterações posteriores.
- **Uso de `fetch` com `Content-Type: text/plain`** – o corpo enviado é JSON, porém o cabeçalho força `text/plain;charset=utf-8`; utilizar `application/json` é mais adequado para integração com o Apps Script.
- **Chave da API do Google Maps exposta** – a chave está embutida diretamente no HTML. Para publicação, é necessário restringir/domesticar a chave ou mover o carregamento para uma camada de configuração segura.
- **Mapeamento incompleto de radios** – `const exibirOpcaoRadios = document.getElementsByName('exibirOpcao')` retorna um `NodeList` vazio porque não há nenhum input com esse `name`, tornando a lógica de habilitar/desabilitar rota inócua.

## Problemas no CSS
- **Escopo global agressivo** – o reset aplica `font-family` em `*`, o que pode colidir com componentes externos futuros; prefira limitar aos componentes do app.
- **Falta de versões mobile completas** – embora exista um breakpoint para `720px`, a sidebar continua ocupando 220px por padrão, e a transição `left` não é sincronizada com o botão "Abrir menu" (`#toggleSidebar`).
- **Dependência de sombras e cores fixas** – vários valores (`box-shadow`, `border`) são rígidos; considere extrair para tokens reutilizáveis, alinhando com o design system planejado para o dashboard público.

## Recomendações gerais
1. Adicionar uma etapa de validação automática (ex.: `npm run lint` com HTMLHint/ESLint) para capturar seletores quebrados e chamadas a funções inexistentes.
2. Consolidar os módulos JavaScript em ES Modules reais ou migrar o script para a estrutura já existente em `public/js` para evitar duplicidade de lógica com o dashboard atual.
3. Revisar a arquitetura de estados (rascunho, edição, exclusão) antes de integrar ao Firebase, garantindo que os elementos auxiliares (toast, modal de confirmação, lista de ativos) sejam implementados.
4. Configurar variáveis de ambiente ou arquivos de configuração para guardar chaves externas (Google Maps, Apps Script) em vez de hardcode.

Essas observações devem servir como checklist na migração das seções isoladas para o projeto principal.
