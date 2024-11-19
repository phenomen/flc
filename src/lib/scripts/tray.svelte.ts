import { defaultWindowIcon } from "@tauri-apps/api/app";
import { getCurrentWindow, getAllWindows } from "@tauri-apps/api/window";
import { Menu, Submenu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { getAllWebviews } from "@tauri-apps/api/webview";
import { toast } from "svelte-sonner";

let zoom = $state(1.0);

export async function toggleFullscreen() {
	const windows = await getAllWindows();
	const foundryWindow = windows.find((window) => window.label === "foundry");
	if (foundryWindow) {
		const fullscreen = await foundryWindow.isFullscreen();
		await foundryWindow.setFullscreen(!fullscreen);
	} else {
		return toast("Open a Foundry VTT window to toggle fullscreen.");
	}
}

export async function setZoomFactor(factor: number) {
	const webviews = await getAllWebviews();
	const foundryWebview = webviews.find((webview) => webview.label === "foundry");
	if (foundryWebview) {
		await foundryWebview.setZoom(factor);
		return toast(`Zoom level is x${factor.toPrecision(2)}`);
	} else {
		return toast("Open a Foundry VTT window to set zoom level.");
	}
}

export async function zoomIn() {
	const webviews = await getAllWebviews();
	const foundryWebview = webviews.find((webview) => webview.label === "foundry");

	if (foundryWebview) {
		if (zoom > 1.8) {
			return toast("Zoom is already at maximum level.");
		} else {
			zoom = zoom + 0.1;
		}
	}
	await setZoomFactor(zoom);
}

export async function zoomOut() {
	const webviews = await getAllWebviews();
	const foundryWebview = webviews.find((webview) => webview.label === "foundry");

	if (foundryWebview) {
		if (zoom < 0.8) {
			return toast("Zoom is already at minimum level.");
		} else {
			zoom = zoom - 0.1;
		}
	}
	await setZoomFactor(zoom);
}

export async function registerTray() {
	const currentMenu = await TrayIcon.getById("flc");

	if (currentMenu) {
		return;
	}

	const submenu = await Submenu.new({
		id: "zoom",
		text: "Zoom",
		items: [
			{
				id: "zoom120",
				text: "120%",
				action: async () => {
					await setZoomFactor(1.2);
				}
			},
			{
				id: "zoom110",
				text: "110%",
				action: async () => {
					await setZoomFactor(1.1);
				}
			},
			{
				id: "zoom100",
				text: "100%",
				action: async () => {
					await setZoomFactor(1.0);
				}
			},
			{
				id: "zoom90",
				text: "90%",
				action: async () => {
					await setZoomFactor(0.9);
				}
			},
			{
				id: "zoom80",
				text: "80%",
				action: async () => {
					await setZoomFactor(0.8);
				}
			}
		]
	});

	const menu = await Menu.new({
		items: [
			{
				id: "fullscreen",
				text: "Toggle Fullscreen",
				action: async () => {
					await toggleFullscreen();
				}
			},
			submenu,
			{
				id: "exit",
				text: "Exit",
				action: async () => {
					await getCurrentWindow().close();
				}
			}
		]
	});

	const options = {
		id: "flc",
		menu,
		menuOnLeftClick: true,
		icon: await defaultWindowIcon()
	};

	await TrayIcon.new(options);
}
