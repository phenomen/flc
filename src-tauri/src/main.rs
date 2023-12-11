// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{GlobalShortcutManager, Manager};

#[allow(unused_must_use)]
fn main() {
  tauri::Builder::default()
  .setup(|app| {
    let window = app.get_window("main").unwrap();
    let mut shortcut_manager = app.global_shortcut_manager();

    shortcut_manager.register("CommandOrControl+F11", move || {
        let is_fullscreen = !window.is_fullscreen().unwrap_or(false);
        window.set_fullscreen(is_fullscreen);
    });

    Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}




