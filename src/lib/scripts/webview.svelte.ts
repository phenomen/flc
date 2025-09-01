import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export async function openWebview(url: string, id: string, title: string, incognito: boolean) {
	// strip id from not alphanumeric characters
	const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, "");

	let newId = `foundry${sanitizedId}`;

	// check for existing webview window with the same id
	// the reason we don't always assign a random number is to have a persistent cache for the default webview window
	const existingWebview = await WebviewWindow.getByLabel(newId);

	if (existingWebview) {
		const randomNumber = Math.floor(Math.random() * 1000000);

		newId = `foundry${sanitizedId}${randomNumber}`;
	}

	const webview = new WebviewWindow(newId, {
		//parent: "main",
		title: `Foundry VTT - ${title}`,
		url,
		incognito,
		width: 1280,
		height: 800,
		focus: true,
		center: true,
		devtools: true,
		dragDropEnabled: false,
		zoomHotkeysEnabled: true,
		allowLinkPreview: false,
		maximizable: true,
		resizable: true,
		minimizable: true,
		closable: true
	});

	webview.once("tauri://created", function () {
		// console.log("Webview created");
	});

	webview.once("tauri://error", function (e) {
		console.log(e);
	});
}
