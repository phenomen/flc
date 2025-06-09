<script lang="ts">
	import { SettingsIcon, XIcon, ArrowUpToLineIcon } from "@lucide/svelte";

	import { Button } from "$ui/button/index.js";

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

<div class="flex h-full w-full items-center">
	<div class="grid gap-1">
		<Button
			onclick={() => onEdit(server)}
			class="hover:text-primary"
			size="icon"
			variant="outline"
			title="Edit Server"><SettingsIcon /></Button>

		<Button
			onclick={handleDeleteServer}
			class="hover:text-destructive"
			variant="outline"
			size="icon"
			title="Delete Server"><XIcon /></Button>
	</div>

	<div class="bg-accent/50 ring-border mx-2 flex h-full w-full rounded-md px-4 py-3 ring-1">
		<h1 class="my-auto overflow-hidden font-semibold text-nowrap text-ellipsis">
			{server.label}
		</h1>
	</div>

	<Button
		onclick={handleLoadSettings}
		class="h-full w-16"
		title="Load Server Settings">
		<ArrowUpToLineIcon class="size-5" />
	</Button>
</div>
