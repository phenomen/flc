<script lang="ts">
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
			console.error(result.error.message);
		}
	}

	async function handleLoadSettings() {
		nodeLauncher.value = server;
	}
</script>

<div class="group flex h-full w-full items-center overflow-hidden rounded-md border">
	<div class="flex h-full w-10 flex-col border-r">
		<button
			onclick={() => onEdit(server)}
			class="hover:bg-secondary h-full w-full border-b"
			title="Edit Server"
			><SettingsIcon
				size={18}
				class="mx-auto" /></button>

		<button
			onclick={handleDeleteServer}
			class="text-destructive hover:bg-destructive/20 h-full w-full"
			title="Delete Server"
			><XIcon
				size={18}
				class="mx-auto" /></button>
	</div>

	<div class="w-full px-4 py-6">
		<h1 class="overflow-hidden font-semibold text-nowrap text-ellipsis">{server.label}</h1>
	</div>

	<button
		onclick={handleLoadSettings}
		class="border-primary bg-primary text-primary-foreground hover:bg-primary/90 h-full w-full max-w-16 overflow-hidden border"
		title="Load Server Settings">
		<ArrowUpToLineIcon
			size={20}
			class="mx-auto" />
	</button>
</div>
