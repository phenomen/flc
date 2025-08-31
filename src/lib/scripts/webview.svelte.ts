import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export async function openWebview(url: string, id: string, title: string, incognito: boolean) {
	// strip id from not alphanumeric characters
	const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, "");

	const webview = new WebviewWindow(`foundry${sanitizedId}`, {
		title: `Foundry VTT - ${title}`,
		url,
		width: 1280,
		height: 800,
		focus: true,
		center: true,
		devtools: true,
		dragDropEnabled: false,
		zoomHotkeysEnabled: true,
		incognito
	});

	webview.once("tauri://created", function () {
		// console.log("Webview created");
	});

	webview.once("tauri://error", function (e) {
		console.log(e);
	});
}
