import { getAllWindows } from "@tauri-apps/api/window";
import { register } from "@tauri-apps/plugin-global-shortcut";

export async function toggleFullscreen() {
	const windows = await getAllWindows();
	const foundryWindows = windows.filter((window) => window.label.includes("foundry"));

	for (const window of foundryWindows) {
		const focused = await window.isFocused();
		if (focused) {
			const fullscreen = await window.isFullscreen();
			await window.setFullscreen(!fullscreen);
		}
	}
}

export async function registerShortcuts() {
	await register("CommandOrControl+F11", async (event) => {
		if (event.state === "Pressed") {
			await toggleFullscreen();
		}
	});
}
