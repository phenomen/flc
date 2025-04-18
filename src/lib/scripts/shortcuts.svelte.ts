import { getAllWindows } from "@tauri-apps/api/window";
import { register, unregister, unregisterAll, isRegistered } from "@tauri-apps/plugin-global-shortcut";

async function toggleFullscreen() {
	const windows = await getAllWindows();
	const foundryWindows = windows.filter((window) => window.label.includes("foundry"));

	for (const window of foundryWindows) {
		const fullscreen = await window.isFullscreen();
		await window.setFullscreen(!fullscreen);
	}
}

export async function registerShortcuts() {
	//console.log(await isRegistered("CommandOrControl+F11"));
	await unregisterAll();

	await register("CommandOrControl+F11", async (event) => {
		//console.log(event.state);
		if (event.state === "Pressed") {
			await toggleFullscreen();
		}
	});
	//console.log(await isRegistered("CommandOrControl+F11"));
}