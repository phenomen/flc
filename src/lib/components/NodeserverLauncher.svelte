<script lang="ts">
	import type { Nodeserver } from "$scripts/nodeservers.svelte.js";

	import { join } from "@tauri-apps/api/path";
	import { Command, spawn } from "@tauri-apps/plugin-shell";

	import { Button } from "$ui/button/index.js";
	import * as Alert from "$ui/alert/index.js";

	import Info from "lucide-svelte/icons/info";

	import { nodelauncher } from "$scripts/nodelauncher.svelte.js";

	let error = $state<string>("");
	let launched = $state<boolean>(false);

	let launcherData = $state(nodelauncher);
	let value = $derived(launcherData.value);

	let { id, label, foundryPath, dataPath, port, args, notes } = $derived<Nodeserver>(value);

	async function launchNodeserver() {
		const normalizedFoundryPath = await join(foundryPath, "resources", "app", "main.js");
		const normalizedDataPath = await join(dataPath);

		const arg = `"${normalizedFoundryPath}" --dataPath ${normalizedDataPath} --port ${port} ${args}`;

		let command = Command.create("exec-node", [arg]);

		const child = await command.spawn();

		console.log("pid:", child.pid);

		launched = true;
	}

	async function stopNodeserver() {
		console.log("Stopping Foundry VTT Server");
		launched = false;
	}
</script>

<div class="flex flex-col space-y-2 p-2 border dark:border-primary/10 rounded-md bg-accent">
	<Alert.Root>
		<Info class="size-5" />

		<Alert.Description
			><p class="font-medium">
				<span class="font-semibold">Node.js 20+</span> is required to launch a Foundry VTT server.
				Download it at <span class="text-blue-500">nodejs.org</span>
			</p></Alert.Description
		>
	</Alert.Root>

	{#if launched}
		<Button
			onclick={async () => await stopNodeserver()}
			variant="destructive">Stop Server: {label}</Button
		>
	{:else}
		<Button
			onclick={async () => await launchNodeserver()}
			disabled={!id}>{!id ? "No Server Settings Loaded" : `Launch Server: ${label}`}</Button
		>
	{/if}
</div>
