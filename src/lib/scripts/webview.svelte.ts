import { invoke } from "@tauri-apps/api/core";

export async function openWebview(url: string, id: string, title: string, incognito: boolean) {
	try {
		await invoke("open_webview", {
			url,
			id,
			title,
			incognito
		});
	} catch (error) {
		console.error("Failed to open webview:", error);
		throw error;
	}
}
