import { invoke } from "@tauri-apps/api/core";

import { incognito } from "$scripts/settings.svelte.js";

export async function openWebview(url: string, id: string, title: string) {
	try {
		await invoke("open_webview", {
			url,
			id,
			title,
			incognito: incognito.current
		});
	} catch (error) {
		console.error("Failed to open webview:", error);
		throw error;
	}
}
