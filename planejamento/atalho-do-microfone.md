# Atalho do microfone em qualquer janela

Sessão no repositório **`FelipeBlasques/cronicas-eternas-app`** (Tauri 2, fork do FLC), não no portal. Não há CLAUDE.md: tudo o que você precisa está aqui. Nomes no código e textos em português, como no resto do `lib.rs`. Decisões fechadas em 11/11/2026.

## Contexto

O chat do portal (janela `"chat"`, `abrir_chat` em `src-tauri/src/lib.rs`) vai ganhar um atalho de teclado para ligar e desligar o microfone durante uma chamada. A página do chat cuida do atalho quando ela está na frente; esse lado fica no portal, e você não mexe nele.

O que falta é o atalho valer **com outra janela na frente**: a do Foundry (`"jogo"`), a do portal ou outro programa. Para isso, o app registra o atalho no sistema (atalho global), só enquanto a pessoa está numa chamada, e avisa a página do chat a cada aperto.

O app já tem o `tauri-plugin-global-shortcut` iniciado no `Builder`. A interface antiga do FLC (`src/`, com o `registerShortcuts()` e o `unregisterAll()`) não abre em nenhuma janela: o `windows` do `tauri.conf.json` está vazio e as janelas abrem endereços externos. Não mexa nela.

## O que fazer

1. **O comando** `atalho_do_microfone(atalho: Option<String>)`:
   - só atende a janela de rótulo `"chat"` (receba a janela e confira o rótulo, como o `avisar`);
   - **guarda o atalho atual** num estado do app (`Mutex<Option<Shortcut>>`, registrado com `app.manage` no `setup`, como o `LoginPendente`);
   - **a cada chamada**, primeiro tira o atalho anterior, se houver;
   - **com `None`**, termina aí;
   - **com um texto,** lê o atalho com `texto.parse::<Shortcut>()`. A página manda os nomes do `KeyboardEvent.code`, com os modificadores antes: `"Control+Shift+KeyM"`, `"Alt+F8"`, `"F8"`, `"Pause"`.
     - Inválido: `Err("O atalho <texto> não é válido.")`.
     - Registra com `app.global_shortcut().on_shortcut(atalho, ...)`.
     - Se o registro falhar (outro programa já usa as teclas): `Err("Outro programa já usa esse atalho.")`, e fica sem atalho.
   - **a cada aperto e a cada soltura**, manda para a janela do chat, se ela existir:

     ```js
     window.dispatchEvent(new CustomEvent("cronicas-eternas:atalho", { detail: { estado: "apertou" } }))
     ```

     com `"apertou"` no `Pressed` e `"soltou"` no `Released`. Use o `eval` da janela. O texto do estado é fixo: nada do que a página manda entra nesse script.
2. **Quando a janela do chat fecha** (o evento `Destroyed` da janela), o atalho sai do sistema. Assim ele nunca fica preso depois da chamada.
3. **A permissão, só para o chat:**
   - o `build.rs` ganha `"atalho_do_microfone"` na lista do `AppManifest`;
   - o `capabilities/chat.json` ganha `"allow-atalho-do-microfone"`;
   - a página remota não ganha nenhuma outra permissão. Em especial, nenhuma do plugin `global-shortcut`: quem registra é o comando, do lado do Rust.
4. **O script da janela do chat:** o `SCRIPT_CHAT` ganha uma função, e o resto fica igual:

   ```js
   window.cronicasEternasApp = Object.freeze({
     loginFoundry: true,
     avisar: (titulo, corpo) =>
       window.__TAURI_INTERNALS__.invoke("avisar", { titulo: String(titulo), corpo: String(corpo) }),
     atalhoDoMicrofone: (atalho) =>
       window.__TAURI_INTERNALS__.invoke("atalho_do_microfone", { atalho: atalho == null ? null : String(atalho) }),
   });
   ```

5. **Versão:** 1.4.0 em `src-tauri/tauri.conf.json`, `package.json` e `src-tauri/Cargo.toml`. No `CHANGELOG.md`, uma linha: "O atalho do microfone do chat vale em qualquer janela durante a chamada."

## Como a página usa

Só para você entender, sem mexer:

- ao entrar numa chamada, a página chama `atalhoDoMicrofone("Control+Shift+KeyM")`;
- ao sair da chamada e ao abrir, chama `atalhoDoMicrofone(null)`;
- se a promessa rejeitar, ela mostra a mensagem de erro do comando;
- com o atalho do app ligado, a página não trata mais as mesmas teclas sozinha.

## Testar

O app não roda nesta sessão: eu gero pelo GitHub Actions e testo no Windows. Aqui, rode `cargo check` em `src-tauri`. Se faltarem bibliotecas do sistema para o Tauri no Linux, instale as da documentação do Tauri (`libwebkit2gtk-4.1-dev` e as outras). Se mesmo assim não der, diga.

No Windows, eu confiro:

- **numa chamada,** com a janela do Foundry na frente, o atalho troca o microfone, e o som de mudo ou de fala toca;
- **fora da chamada,** as mesmas teclas voltam a funcionar nos outros programas;
- **fechando a janela do chat no meio da chamada,** as teclas voltam a funcionar;
- **com um atalho que outro programa já usa,** aparece a mensagem.

## Fim

Commit com mensagem curta em português, envie a branch da sessão e não faça merge na `main`. Na resposta, liste os arquivos mudados e o resultado do `cargo check`.
