<script lang="ts">
	import type { Update } from "@tauri-apps/plugin-updater";

	import { onMount } from "svelte";
	import { check } from "@tauri-apps/plugin-updater";

	let message = $state<string>("");
	let update = $state<Update | null>(null);
	let install = $state<boolean>(false);

	async function checkUpdate() {
		update = await check();

		if (update) {
			message = `A new version ${update.version} is available!`;
			install = true;
		}
	}

	async function installUpdate() {
		let downloaded = 0;
		let contentLength = 0;
		install = false;

		await update.downloadAndInstall((event) => {
			switch (event.event) {
				case "Started":
					contentLength = event.data.contentLength || 0;
					message = `Started downloading...`;
					break;
				case "Progress":
					downloaded += event.data.chunkLength;
					message = `Downloaded ${downloaded} from ${contentLength}`;
					break;
				case "Finished":
					message = "Download finished. Installing...";
					break;
			}
		});

		message = "Update is installed. Please restart the app.";
	}

	onMount(async () => {
		await checkUpdate();
	});
</script>

{#if update}
	<footer class="fixed bottom-0 z-10 bg-yellow-400 text-black w-full">
		<div class="px-4 py-1 flex space-x-4 items-center w-full justify-center text-sm">
			<div class="font-medium">{message}</div>
			{#if install}
				<button
					class="bg-black text-white px-2 py-0.5 rounded-md font-medium"
					onclick={installUpdate}>Update</button
				>
			{/if}
		</div>
	</footer>
{/if}
