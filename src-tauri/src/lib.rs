use tauri::webview::{NewWindowResponse, WebviewWindowBuilder};
use tauri::{AppHandle, Manager};
#[cfg(not(any(target_os = "android", target_os = "ios")))]
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

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
    .incognito(incognito)
    .inner_size(1280.0, 800.0)
    .focused(true)
    .center()
    .devtools(true)
    .disable_drag_drop_handler()
    .zoom_hotkeys_enabled(true)
    .maximizable(true)
    .resizable(true)
    .minimizable(true)
    .closable(true)
    .on_new_window(|_url, _features| {
        // Allow popup windows to open
        NewWindowResponse::Allow
    })
    .build()
    .map_err(|e| format!("Failed to create webview: {}", e))?;

    Ok(())
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
fn toggle_foundry_fullscreen(app: &AppHandle) {
    let foundry_windows: Vec<_> = app
        .webview_windows()
        .into_iter()
        .filter(|(label, _)| label.starts_with("foundry"))
        .map(|(_, window)| window)
        .collect();

    if foundry_windows.is_empty() {
        return;
    }

    if let Some(window) = foundry_windows
        .iter()
        .find(|window| window.is_focused().unwrap_or(false))
    {
        let is_fullscreen = window.is_fullscreen().unwrap_or(false);
        let _ = window.set_fullscreen(!is_fullscreen);
        return;
    }

    for window in foundry_windows {
        let is_fullscreen = window.is_fullscreen().unwrap_or(false);
        let _ = window.set_fullscreen(!is_fullscreen);
    }
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

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            #[cfg(not(any(target_os = "android", target_os = "ios")))]
            {
                app.global_shortcut().on_shortcut(
                    "CommandOrControl+F11",
                    |app, _shortcut, event| {
                        if event.state == ShortcutState::Pressed {
                            toggle_foundry_fullscreen(app);
                        }
                    },
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_webview])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
