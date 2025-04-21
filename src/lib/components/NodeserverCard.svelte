<script lang="ts">
	import * as Card from "$ui/card/index.js";

	import { SettingsIcon, XIcon, ArrowUpToLineIcon } from "@lucide/svelte";

	import { deleteServer, type Nodeserver } from "$scripts/nodeservers.svelte.js";
	import { nodeLauncher } from "$scripts/nodelauncher.svelte.js";

	let { server, onEdit = $bindable((server: Nodeserver) => {}) } = $props<{
		server: Nodeserver;
		onEdit?: (server: Nodeserver) => void;
	}>();

	if (!server) {
		throw new Error("Node Server not found");
	}

	function handleDeleteServer() {
		const result = deleteServer(server.id);

		if (!result.success) {
			console.error(result.issues);
		}
	}

	async function handleLoadSettings() {
		nodeLauncher.value = server;
	}
</script>

<Card.Root class="group flex h-full w-full items-center overflow-hidden rounded-md border">
	<div class="flex h-full w-10 flex-col border-r">
		<button
			onclick={() => onEdit(server)}
			class="h-full w-full border-b hover:bg-secondary"
			title="Edit Server"
			><SettingsIcon
				size={18}
				class="mx-auto" /></button>

		<button
			onclick={handleDeleteServer}
			class="h-full w-full text-destructive hover:bg-destructive/20"
			title="Delete Server"
			><XIcon
				size={18}
				class="mx-auto" /></button>
	</div>

	<div class="w-full px-4 py-6">
		<h1 class="overflow-hidden text-ellipsis text-nowrap font-semibold">{server.label}</h1>
	</div>

	<button
		onclick={handleLoadSettings}
		class="h-full w-full max-w-16 overflow-hidden border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
		title="Load Server Settings">
		<ArrowUpToLineIcon
			size={20}
			class="mx-auto" />
	</button>
</Card.Root>
