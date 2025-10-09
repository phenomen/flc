use tauri::webview::{NewWindowResponse, WebviewWindowBuilder};
use tauri::{AppHandle, Manager};

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

    // Build the webview window
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
    .drag_and_drop(false)
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

#[cfg(not(mobile))]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![open_webview])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
