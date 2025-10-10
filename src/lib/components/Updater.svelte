<script lang="ts">
	import type { Update } from "@tauri-apps/plugin-updater";
	import { open } from "@tauri-apps/plugin-shell";

	import { Button } from "$ui/button/index.js";
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

		await update?.downloadAndInstall((event) => {
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
	<footer class="bg-primary fixed bottom-0 z-10 flex h-10 w-full align-middle">
		<div class="my-auto flex w-full items-center justify-center space-x-3 px-4">
			<span class="text-primary-foreground font-medium">{message}</span>
			{#if install}
				<Button
					size="sm"
					variant="secondary"
					onclick={installUpdate}>Update</Button>

				<button
					class="text-primary-foreground text-xs underline underline-offset-4"
					onclick={() => open("https://github.com/phenomen/flc/blob/main/CHANGELOG.md")}
					>CHANGELOG</button>
			{/if}
		</div>
	</footer>
{/if}
