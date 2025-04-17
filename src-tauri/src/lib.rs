// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/*
use tauri::{utils::config::WebviewUrl, webview::WebviewWindowBuilder, Url};

#[tauri::command]
fn open_webview(app: tauri::AppHandle, url: String, id: String, title: String) {
    let webview_url = tauri::WebviewUrl::External(Url::parse(url.as_str()).unwrap());

    let app_clone = app.clone();

    let webview_window = WebviewWindowBuilder::new(&app_clone, &id, webview_url.into())
        .title(title)
        .inner_size(1280.0, 800.0)
        .center()
        .focused(true)
        .devtools(true)
        .zoom_hotkeys_enabled(true)
        .disable_drag_drop_handler()
        .build();
}
*/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        //.invoke_handler(tauri::generate_handler![open_webview])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
