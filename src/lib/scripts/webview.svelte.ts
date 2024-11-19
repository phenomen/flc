import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { toast } from "svelte-sonner";

export async function openWebview(url: string, title?: string) {
	const webview = new WebviewWindow("foundry", {
		title: `Foundry VTT - ${title}`,
		url,
		x: 0,
		y: 0,
		width: 1280,
		height: 720,
		focus: true,
		center: true,
		devtools: true,
		dragDropEnabled: false,
		zoomHotkeysEnabled: true
	});

	webview.once("tauri://created", function () {
		// webview successfully created
	});

	webview.once("tauri://error", function (e) {
		console.log(e);
		if (e.payload === "a webview with label `foundry` already exists") {
			toast("Foundry VTT window is already open.");
		}
	});
}
