import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { nanoid } from "nanoid";

export async function openWebview(
	url: string,
	id: string,
	title: string,
	user?: string,
	password?: string
) {
	const webview = new WebviewWindow(`foundry-${id}-${nanoid()}`, {
		title: `Foundry VTT - ${title}`,
		url,
		width: 1280,
		height: 800,
		focus: true,
		center: true,
		devtools: true,
		dragDropEnabled: false,
		zoomHotkeysEnabled: true
	});

	webview.once("tauri://created", function () {
		// console.log("Webview created");
	});

	webview.once("tauri://error", function (e) {
		console.log(e);
	});
}
