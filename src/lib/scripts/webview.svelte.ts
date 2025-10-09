import { invoke } from "@tauri-apps/api/core";
import { PersistedState } from "runed";

const incognito = new PersistedState("incognito", false);

export async function openWebview(url: string, id: string, title: string) {
	try {
		console.log("incognito", incognito.current);

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
