fn main() {
    // Declara os comandos do app para que cada um precise de permissão nas capabilities
    let manifesto = tauri_build::AppManifest::new().commands(&[
        "open_webview",
        "read_text_file",
        "write_text_file",
        "avisar",
        "atalho_do_microfone",
    ]);
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(manifesto))
        .expect("falha ao montar o aplicativo");
}
