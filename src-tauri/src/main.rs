#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::GlobalShortcutManager;
#[cfg(any(windows, target_os = "macos"))]
use tauri::Manager;

#[tauri::command]
fn start_server(params: String) {
    let command_arg = format!("{}/resources/app/main.js", params);

    Command::new("cmd")
        .arg("/c")
        .arg("node")
        .arg(command_arg)
        .spawn()
        .expect("Failed to start a server");
}

#[allow(unused_must_use)]
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_server])
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
