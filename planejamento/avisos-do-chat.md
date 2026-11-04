# Avisos do chat no app

Sessão neste repositório (o app Crônicas Eternas, Tauri 2, fork do FLC). Não há CLAUDE.md: tudo o que você precisa está aqui. Nomes no código e textos em português, como no resto do `lib.rs`. Decisões fechadas em 04/11/2026.

## Contexto

A janela do chat (`abrir_chat` em `src-tauri/src/lib.rs`) abre https://chat.cronicaseternas.com. A página do chat avisa as mensagens novas com o `Notification` do navegador, mas o WebView2 do Windows recusa esses avisos: a página mostra "Avisos bloqueados" e não há onde liberar.

A página do chat vai passar a usar `window.cronicasEternasApp.avisar(titulo, corpo)` quando ele existir (isso fica do lado do portal; você não mexe no portal). Este app precisa oferecer esse `avisar` só na janela do chat, mostrando uma notificação do Windows.

## O que fazer

1. **O plugin:** acrescente o `tauri-plugin-notification` (só desktop, como os outros plugins) e inicie no `Builder`.
2. **O comando:** um comando `avisar(titulo: String, corpo: String)` que:
   - só atende a janela de rótulo `"chat"` (receba a janela no comando e confira o rótulo);
   - corta o título em 120 caracteres e o corpo em 240;
   - mostra a notificação com o plugin. O nome do app aparece sozinho.
3. **A permissão, só para o chat:** um arquivo novo `src-tauri/capabilities/chat.json`:
   - `windows: ["chat"]`;
   - `remote.urls: ["https://chat.cronicaseternas.com/*"]`;
   - só a permissão do comando `avisar`.

   Para isso, o `build.rs` declara os comandos do app com o `AppManifest` (veja a documentação de capabilities do Tauri 2 para comandos do app). Confira que os comandos que já existem (`open_webview`, `read_text_file`, `write_text_file`) continuam funcionando nas janelas locais: se o manifesto passar a exigir permissão para eles, acrescente-as ao `capabilities/default.json`. A página remota não pode ganhar nenhuma outra permissão.
4. **O script da janela do chat:** uma constante `SCRIPT_CHAT`, usada só no `abrir_chat` no lugar do `SCRIPT_PORTAL`:

   ```js
   window.cronicasEternasApp = Object.freeze({
     loginFoundry: true,
     avisar: (titulo, corpo) =>
       window.__TAURI_INTERNALS__.invoke("avisar", { titulo: String(titulo), corpo: String(corpo) }),
   });
   ```

   A janela principal continua com o `SCRIPT_PORTAL` de hoje.
5. **Versão:** 1.3.0 em `src-tauri/tauri.conf.json`, `package.json` e `src-tauri/Cargo.toml`, e uma linha no `CHANGELOG.md`: "Os avisos do chat aparecem como notificações do Windows."

## Testar

O app não roda nesta sessão: eu gero pelo GitHub Actions e testo no Windows. Aqui, rode `cargo check` em `src-tauri`. Se faltarem bibliotecas do sistema para o Tauri no Linux, instale as da documentação do Tauri (`libwebkit2gtk-4.1-dev` e as outras). Se mesmo assim não der, diga.

## Fim

Commit com mensagem curta em português, envie a branch da sessão e não faça merge na `main`. Na resposta, liste os arquivos mudados e o resultado do `cargo check`.
