#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::{Child, Command};
use tauri::GlobalShortcutManager;
#[cfg(any(windows, target_os = "macos"))]
use tauri::Manager;

static mut CHILD_PROCESS: Option<Child> = None;

#[tauri::command]
fn start_server(params: String) -> Result<(), String> {
    let command_arg = format!("{}/resources/app/main.js", params);

    let child_process = Command::new("node")
        .arg(command_arg)
        .spawn()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    unsafe {
        CHILD_PROCESS.replace(child_process);
    }

    Ok(())
}

#[tauri::command]
fn stop_server() -> Result<(), String> {
    let child_process = unsafe { CHILD_PROCESS.take() };

    if let Some(mut child) = child_process {
        child
            .kill()
            .map_err(|e| format!("Failed to stop server: {}", e))?;
        child
            .wait()
            .map_err(|e| format!("Failed to wait for server process: {}", e))?;
    }

    Ok(())
}

#[allow(unused_must_use)]
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
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
