# Janela do chat no app

Sessão no repositório **`FelipeBlasques/cronicas-eternas-app`** (Tauri 2, fork do FLC), não no portal. Cole este arquivo como pedido na sessão do Claude Code aberta nesse repositório. Decisões fechadas em 03/11/2026.

## Contexto

O portal ganhou um chat em **chat.cronicaseternas.com**, com salas de voz e vídeo. Hoje o app abre o portal na janela principal (`criar_janela_principal` em `src-tauri/src/lib.rs`) e manda tudo o que é de `vtt.cronicaseternas.com` para a janela do jogo (`abrir_jogo`). Uma navegação para o chat ficaria na janela principal, no lugar do portal, e trocar de página derrubaria a chamada.

No app, o botão Chat do portal navega na mesma janela (o portal sabe que está no app por `window.cronicasEternasApp`). Quem decide onde o chat abre é o app.

## O que fazer

1. Em `lib.rs`, uma constante `HOST_CHAT: &str = "chat.cronicaseternas.com"`.
2. No `on_navigation` da janela principal: navegação para `HOST_CHAT` abre **a janela do chat** e devolve `false` (o portal fica onde estava). Crie a janela fora do evento, com `tauri::async_runtime::spawn`, como o `abrir_jogo` faz.
3. **A janela do chat** (`abrir_chat`):
   - rótulo `"chat"`, título "Crônicas Eternas · Chat", tamanho 1200 × 800, mínimo 1100 × 640, centralizada;
   - se já existir, só traz para a frente (`set_focus`) e, se o endereço pedido for outro, navega para ele;
   - o mesmo `initialization_script(SCRIPT_PORTAL)` da janela principal;
   - `zoom_hotkeys_enabled(true)` e `disable_drag_drop_handler()`, como na principal. O segundo é o que deixa o arrastar de imagens do navegador chegar na página, e o chat recebe imagens arrastadas;
   - no `on_navigation`: endereços de `HOST_CHAT` ficam nela; `vtt.cronicaseternas.com` vai para o `abrir_jogo` como na principal; qualquer outro (o link "← Portal" do chat) navega a janela principal para lá, traz a principal para a frente e devolve `false`.
4. Fechar a janela do chat encerra a chamada. É o esperado, nada a fazer.
5. Versão nova (1.2.0) em `tauri.conf.json`, `package.json` e `Cargo.toml`, e uma linha no `CHANGELOG.md`: "O chat do portal abre numa janela própria."

## O que testar e relatar (sem consertar nesta sessão, a não ser o item 1)

1. **Microfone e câmera** na janela do chat, no Windows (WebView2): ao entrar numa sala, aparece o pedido de permissão e o áudio funciona. Se o WebView2 recusar sem perguntar, trate o pedido de permissão só para `HOST_CHAT` (no Windows, pelo `with_webview` e o evento `PermissionRequested` do `ICoreWebView2`), permitindo microfone e câmera. O `Info.plist` do macOS já tem as frases de câmera e microfone.
2. **Avisos do navegador** (`new Notification(...)`) na janela do chat: aparecem ou não. Só relate o resultado.
3. **Compartilhar a tela**: o seletor de tela abre.
4. O login do portal vale na janela do chat (as janelas do app dividem os cookies).

Na resposta final, liste os arquivos mudados e o resultado de cada teste acima.
