use std::sync::Mutex;
use tauri::webview::{NewWindowResponse, PageLoadEvent, WebviewWindowBuilder};
use tauri::{AppHandle, Manager, Url, WebviewUrl, WebviewWindow, WindowEvent};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_shell::ShellExt;

// Crônicas Eternas: aplicativo do grupo, baseado no FLC (Foundry Lightweight Client)
// de Phenomen, licença MIT. A janela principal abre o portal; quando o portal manda
// o jogador para o Foundry, o jogo abre numa janela própria e o portal continua aberto.

/// Endereço do portal, que abre na janela principal
const PORTAL: &str = "https://cronicaseternas.com";

/// Endereço do Foundry: navegações para cá abrem na janela do jogo
const HOST_FOUNDRY: &str = "vtt.cronicaseternas.com";

/// Endereço do chat do portal: navegações para cá abrem na janela do chat
const HOST_CHAT: &str = "chat.cronicaseternas.com";

/// Avisa o portal de que este aplicativo sabe fazer o login no Foundry sozinho
const SCRIPT_PORTAL: &str = "window.cronicasEternasApp = Object.freeze({ loginFoundry: true });";

/// Na janela do chat, além do aviso do login, oferece o `avisar`, que mostra uma
/// notificação do sistema no lugar do `Notification` do navegador, e o
/// `atalhoDoMicrofone`, que liga o atalho do microfone em qualquer janela
const SCRIPT_CHAT: &str = r#"window.cronicasEternasApp = Object.freeze({
  loginFoundry: true,
  avisar: (titulo, corpo) =>
    window.__TAURI_INTERNALS__.invoke("avisar", { titulo: String(titulo), corpo: String(corpo) }),
  atalhoDoMicrofone: (atalho) =>
    window.__TAURI_INTERNALS__.invoke("atalho_do_microfone", { atalho: atalho == null ? null : String(atalho) }),
});"#;

/// Avisos do atalho do microfone para a página do chat. Os textos são fixos.
const SCRIPT_ATALHO_APERTOU: &str = r#"window.dispatchEvent(new CustomEvent("cronicas-eternas:atalho", { detail: { estado: "apertou" } }))"#;
const SCRIPT_ATALHO_SOLTOU: &str = r#"window.dispatchEvent(new CustomEvent("cronicas-eternas:atalho", { detail: { estado: "soltou" } }))"#;

/// Tamanho máximo do título e do corpo dos avisos do chat, em caracteres
const LIMITE_TITULO: usize = 120;
const LIMITE_CORPO: usize = 240;

/// Faz o login na tela de entrada do Foundry: preenche usuário e senha e usa o próprio
/// botão de entrar. Se a tela continuar no login, tenta o pedido direto. No pior caso,
/// a tela fica preenchida para a pessoa só clicar em entrar.
const SCRIPT_LOGIN: &str = r#"(async () => {
  const dados = __DADOS__;
  const nome = dados.usuario.trim();
  const alvo = nome.toLowerCase();
  const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
  const mesmoNome = (texto) => typeof texto === "string" && texto.trim().toLowerCase() === alvo;

  // Espera a tela de login montar o formulário
  let campoSenha = null;
  for (let i = 0; i < 40 && !campoSenha; i++) {
    campoSenha = document.querySelector('input[name="password"]');
    if (!campoSenha) await esperar(250);
  }
  if (!campoSenha) return;
  const form = campoSenha.form || document;

  const acharId = () => {
    const doJogo = window.game?.users?.find?.((u) => mesmoNome(u.name));
    if (doJogo) return doJogo.id;
    const dosDados = window.game?.data?.users?.find?.((u) => mesmoNome(u.name));
    if (dosDados) return dosDados._id ?? dosDados.id;
    const opcao = [...form.querySelectorAll("select option")].find((o) => mesmoNome(o.textContent));
    return opcao?.value || null;
  };
  let userId = acharId();
  for (let i = 0; i < 12 && !userId; i++) {
    await esperar(250);
    userId = acharId();
  }

  const preencher = (campo, valor) => {
    if (!campo) return;
    campo.focus();
    campo.value = valor;
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));
  };

  // Pedido direto ao Foundry, com os nomes de campo das versões antigas e da 14
  const loginDireto = async () => {
    try {
      const corpo = { action: "join", username: nome, password: dados.senha };
      if (userId) {
        corpo.userId = userId;
        corpo.userid = userId;
      }
      const resposta = await fetch(location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (resultado.status === "success") location.href = resultado.redirect || "/game";
    } catch (erro) {
      console.warn("Login automático não funcionou:", erro);
    }
  };

  // Versão 14: o usuário é digitado. Versões antigas: escolhido numa lista.
  const campoNome = form.querySelector('input[name="username"]')
    || form.querySelector('input[type="text"], input:not([type])');
  const lista = form.querySelector('select[name="userid"], select[name="userId"]');
  if (campoNome && campoNome !== campoSenha) preencher(campoNome, nome);
  if (lista && userId) preencher(lista, userId);
  preencher(campoSenha, dados.senha);

  // Se o Foundry não cuidar do envio, impede o envio comum (que colocaria a senha no endereço)
  let foundryCuidou = true;
  window.addEventListener("submit", (evento) => {
    if (!evento.defaultPrevented) {
      evento.preventDefault();
      foundryCuidou = false;
    }
  }, { once: true });

  // Primeiro usa o próprio botão do Foundry, que monta o pedido do jeito que a versão espera
  const botao = form.querySelector('button[type="submit"], button[name="join"], button:not([type])');
  await esperar(300);
  if (botao) botao.click();
  else if (form.requestSubmit) form.requestSubmit();

  if (!foundryCuidou) return loginDireto();
  await esperar(3000);
  if (location.pathname.endsWith("/join")) await loginDireto();
})();"#;

/// Login do Foundry esperando a janela do jogo chegar na tela de entrada
#[derive(Default)]
struct LoginPendente(Mutex<Option<(String, String)>>);

/// Atalho do microfone registrado no sistema enquanto a pessoa está numa chamada
#[derive(Default)]
struct AtalhoMicrofone(Mutex<Option<Shortcut>>);

/// Tira o atalho do microfone do sistema, se houver um
fn tirar_atalho(app: &AppHandle, atual: &mut Option<Shortcut>) {
    if let Some(anterior) = atual.take() {
        if let Err(erro) = app.global_shortcut().unregister(anterior) {
            eprintln!("Não foi possível tirar o atalho do microfone: {erro}");
        }
    }
}

/// Lê o usuário e a senha que o portal mandou no fim do endereço (depois do #)
fn login_do_endereco(url: &Url) -> Option<(String, String)> {
    let fragmento = url.fragment()?;
    let mut leitor = Url::parse("http://local/").ok()?;
    leitor.set_query(Some(fragmento));
    let mut usuario = None;
    let mut senha = None;
    for (chave, valor) in leitor.query_pairs() {
        match chave.as_ref() {
            "ce-usuario" => usuario = Some(valor.into_owned()),
            "ce-senha" => senha = Some(valor.into_owned()),
            _ => {}
        }
    }
    Some((usuario?, senha?))
}

/// Corta o texto em `limite` caracteres
fn cortar(texto: &str, limite: usize) -> String {
    texto.chars().take(limite).collect()
}

/// Mostra uma notificação do sistema com um aviso do chat. Só atende a janela do chat.
#[tauri::command]
fn avisar(janela: WebviewWindow, titulo: String, corpo: String) -> Result<(), String> {
    if janela.label() != "chat" {
        return Err("avisar só funciona na janela do chat".into());
    }
    janela
        .notification()
        .builder()
        .title(cortar(&titulo, LIMITE_TITULO))
        .body(cortar(&corpo, LIMITE_CORPO))
        .show()
        .map_err(|erro| format!("Não foi possível mostrar o aviso: {erro}"))
}

/// Liga o atalho do microfone em qualquer janela (com um texto) ou desliga (com `None`).
/// Só atende a janela do chat.
#[tauri::command]
fn atalho_do_microfone(janela: WebviewWindow, atalho: Option<String>) -> Result<(), String> {
    if janela.label() != "chat" {
        return Err("atalho_do_microfone só funciona na janela do chat".into());
    }
    let app = janela.app_handle();
    let estado = app.state::<AtalhoMicrofone>();
    let mut atual = estado
        .0
        .lock()
        .map_err(|_| "Não foi possível trocar o atalho.".to_string())?;

    tirar_atalho(app, &mut atual);
    let Some(texto) = atalho else {
        return Ok(());
    };

    let novo = texto
        .parse::<Shortcut>()
        .map_err(|_| format!("O atalho {texto} não é válido."))?;
    app.global_shortcut()
        .on_shortcut(novo, |app, _atalho, evento| {
            let script = match evento.state {
                ShortcutState::Pressed => SCRIPT_ATALHO_APERTOU,
                ShortcutState::Released => SCRIPT_ATALHO_SOLTOU,
            };
            if let Some(chat) = app.get_webview_window("chat") {
                let _ = chat.eval(script);
            }
        })
        .map_err(|_| "Outro programa já usa esse atalho.".to_string())?;
    *atual = Some(novo);
    Ok(())
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {e}"))
}

#[tauri::command]
fn write_text_file(path: String, contents: String) -> Result<(), String> {
    std::fs::write(&path, contents).map_err(|e| format!("Failed to write file: {e}"))
}

#[tauri::command]
async fn open_webview(
    app: AppHandle,
    url: String,
    id: String,
    title: String,
    incognito: bool,
) -> Result<(), String> {
    // Sanitize ID to remove non-alphanumeric characters
    let sanitized_id: String = id.chars().filter(|c| c.is_alphanumeric()).collect();
    let mut new_id = format!("foundry{}", sanitized_id);

    // Check if a window with this label already exists
    if app.webview_windows().contains_key(&new_id) {
        let random_number = rand::random::<u32>() % 1000000;
        new_id = format!("foundry{}{}", sanitized_id, random_number);
    }

    WebviewWindowBuilder::new(
        &app,
        &new_id,
        tauri::WebviewUrl::External(url.parse().map_err(|e| format!("Invalid URL: {}", e))?),
    )
    .title(format!("Foundry VTT - {}", title))
    .center()
    .closable(true)
    .devtools(true)
    .disable_drag_drop_handler()
    .focused(true)
    .general_autofill_enabled(false)
    .incognito(incognito)
    .inner_size(1280.0, 800.0)
    .maximizable(true)
    .minimizable(true)
    .resizable(true)
    .zoom_hotkeys_enabled(true)
    .on_new_window(|_url, _features| {
        // Allow popup windows to open
        NewWindowResponse::Allow
    })
    .build()
    .map_err(|e| format!("Failed to create webview: {}", e))?;

    Ok(())
}

/// Abre o Foundry na janela do jogo. Se ela já existir, só troca o endereço e traz para a frente.
fn abrir_jogo(app: &AppHandle, url: Url) {
    if let Some(janela) = app.get_webview_window("jogo") {
        let _ = janela.navigate(url);
        let _ = janela.unminimize();
        let _ = janela.set_focus();
        return;
    }

    let resultado = WebviewWindowBuilder::new(app, "jogo", WebviewUrl::External(url))
        .title("Crônicas Eternas: Foundry")
        .inner_size(1280.0, 800.0)
        .min_inner_size(800.0, 600.0)
        .maximized(true)
        .focused(true)
        .devtools(true)
        .disable_drag_drop_handler()
        .general_autofill_enabled(false)
        .zoom_hotkeys_enabled(true)
        .on_new_window(|_url, _features| {
            // O Foundry abre janelas extras (fichas destacadas, por exemplo)
            NewWindowResponse::Allow
        })
        .on_page_load(|janela, carga| {
            let na_entrada = carga.url().path().ends_with("/join");
            if !matches!(carga.event(), PageLoadEvent::Finished) || !na_entrada {
                return;
            }
            // O login é usado uma vez só: se falhar, a tela de login fica para entrar manualmente
            let pendente = janela.state::<LoginPendente>().0.lock().ok().and_then(|mut login| login.take());
            if let Some((usuario, senha)) = pendente {
                let dados = serde_json::json!({ "usuario": usuario, "senha": senha }).to_string();
                let script = SCRIPT_LOGIN.replace("__DADOS__", &dados);
                let _ = janela.eval(&script);
            }
        })
        .build();

    if let Err(erro) = resultado {
        eprintln!("Não foi possível abrir a janela do jogo: {erro}");
    }
}

/// Guarda o login que veio no endereço do Foundry e abre o jogo fora do evento de navegação
fn encaminhar_jogo(app: &AppHandle, url: &Url) {
    // Guarda o login que veio do portal e tira ele do endereço antes de abrir o jogo
    if let Some(login) = login_do_endereco(url) {
        if let Ok(mut pendente) = app.state::<LoginPendente>().0.lock() {
            *pendente = Some(login);
        }
    }
    let mut destino = url.clone();
    destino.set_fragment(None);
    let app = app.clone();
    // Cria a janela fora deste evento, para não travar no Windows
    tauri::async_runtime::spawn(async move { abrir_jogo(&app, destino) });
}

/// Leva a janela principal para o endereço pedido e traz ela para a frente
fn voltar_ao_portal(app: &AppHandle, url: Url) {
    if let Some(janela) = app.get_webview_window("main") {
        let _ = janela.navigate(url);
        let _ = janela.unminimize();
        let _ = janela.set_focus();
    }
}

/// Abre o chat do portal numa janela própria. Se ela já existir, traz para a frente e,
/// se o endereço pedido for outro, navega para ele.
fn abrir_chat(app: &AppHandle, url: Url) {
    if let Some(janela) = app.get_webview_window("chat") {
        if janela.url().ok().as_ref() != Some(&url) {
            let _ = janela.navigate(url);
        }
        let _ = janela.unminimize();
        let _ = janela.set_focus();
        return;
    }

    let navegacao = app.clone();
    let links = app.clone();
    let resultado = WebviewWindowBuilder::new(app, "chat", WebviewUrl::External(url))
        .title("Crônicas Eternas · Chat")
        .inner_size(1200.0, 800.0)
        .min_inner_size(1100.0, 640.0)
        .center()
        .focused(true)
        .disable_drag_drop_handler()
        .zoom_hotkeys_enabled(true)
        .initialization_script(SCRIPT_CHAT)
        .on_navigation(move |url| {
            if !matches!(url.scheme(), "http" | "https") {
                return true;
            }
            match url.host_str() {
                Some(HOST_CHAT) => true,
                Some(HOST_FOUNDRY) => {
                    encaminhar_jogo(&navegacao, url);
                    false
                }
                _ => {
                    // O link "← Portal" e afins: abrem na janela principal, o chat continua
                    let handle = navegacao.clone();
                    let destino = url.clone();
                    tauri::async_runtime::spawn(async move { voltar_ao_portal(&handle, destino) });
                    false
                }
            }
        })
        .on_new_window(move |url, _features| {
            // Links das mensagens (target="_blank") abrem no navegador padrão
            if matches!(url.scheme(), "http" | "https") {
                #[allow(deprecated)]
                if let Err(erro) = links.shell().open(url.as_str(), None) {
                    eprintln!("Não foi possível abrir o link no navegador: {erro}");
                }
            }
            NewWindowResponse::Deny
        })
        .build();

    match resultado {
        Ok(janela) => {
            // Ao fechar o chat, o atalho do microfone sai do sistema
            let handle = app.clone();
            janela.on_window_event(move |evento| {
                if matches!(evento, WindowEvent::Destroyed) {
                    if let Ok(mut atual) = handle.state::<AtalhoMicrofone>().0.lock() {
                        tirar_atalho(&handle, &mut atual);
                    }
                }
            });
        }
        Err(erro) => eprintln!("Não foi possível abrir a janela do chat: {erro}"),
    }
}

/// Cria a janela principal já no portal
fn criar_janela_principal(app: &AppHandle) -> tauri::Result<()> {
    let portal: Url = PORTAL.parse().expect("endereço do portal inválido");
    let handle = app.clone();

    WebviewWindowBuilder::new(app, "main", WebviewUrl::External(portal))
        .title("Crônicas Eternas")
        .inner_size(1280.0, 820.0)
        .min_inner_size(800.0, 600.0)
        .center()
        .disable_drag_drop_handler()
        .zoom_hotkeys_enabled(true)
        .initialization_script(SCRIPT_PORTAL)
        .on_navigation(move |url| match url.host_str() {
            Some(HOST_FOUNDRY) => {
                encaminhar_jogo(&handle, url);
                false // o portal continua na janela principal
            }
            Some(HOST_CHAT) => {
                let handle = handle.clone();
                let destino = url.clone();
                // Cria a janela fora deste evento, para não travar no Windows
                tauri::async_runtime::spawn(async move { abrir_chat(&handle, destino) });
                false // o portal continua na janela principal
            }
            _ => true,
        })
        .build()?;

    Ok(())
}

#[cfg(not(mobile))]
pub fn run() {
    #[cfg(target_os = "windows")]
    unsafe {
        std::env::set_var(
            "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
            "--force-high-performance-gpu --allow-insecure-localhost --allow-running-insecure-content --block-new-web-contents=false",
        );
    }

    // WebKitGTK white screen bug workaround
    // https://github.com/khoj-ai/pipali/pull/44
    #[cfg(target_os = "linux")]
    unsafe {
        for var in [
            "WEBKIT_DISABLE_DMABUF_RENDERER",
            "WEBKIT_DISABLE_COMPOSITING_MODE",
        ] {
            if std::env::var_os(var).is_none() {
                std::env::set_var(var, "1");
            }
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            atalho_do_microfone,
            avisar,
            open_webview,
            read_text_file,
            write_text_file
        ])
        .setup(|app| {
            app.manage(LoginPendente::default());
            app.manage(AtalhoMicrofone::default());
            criar_janela_principal(app.handle())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
