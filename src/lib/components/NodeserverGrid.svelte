<script lang="ts">
	import { fly } from "svelte/transition";
	import { flip } from "svelte/animate";

	import NodeserverCard from "$components/NodeserverCard.svelte";
	import { nodeservers, updateServer, type Nodeserver } from "$scripts/nodeservers.svelte.js";
	import * as Sheet from "$ui/sheet/index.js";
	import NodeServerForm from "$lib/components/NodeServerForm.svelte";

	let editingServer = $state<Nodeserver | null>(null);
	let isOpen = $state<boolean>(false);
	let label = $state<string>("");
	let notes = $state<string>("");
	let foundryPath = $state<string>("");
	let dataPath = $state<string>("");
	let port = $state<number>(30000);
	let args = $state<string>("");
	let order = $state<number>(0);
	let error = $state<string>("");

	function openEditSheet(server: Nodeserver) {
		editingServer = server;
		label = server.label;
		notes = server.notes || "";
		foundryPath = server.foundryPath;
		dataPath = server.dataPath || "";
		port = server.port;
		args = server.args || "";
		order = server.order ?? 0;
		error = "";
		isOpen = true;
	}

	function handleUpdateServer() {
		if (!editingServer) return;

		const result = updateServer({
			id: editingServer.id,
			label,
			foundryPath,
			dataPath,
			port,
			args,
			notes,
			order
		});

		if (result.success) {
			error = "";
			isOpen = false;
		} else {
			error = result.error.message;
		}
	}
</script>

<div class="relative mb-8 grid gap-3">
	{#if nodeservers.current.length}
		{#each nodeservers.current as server (server.id)}
			<div
				transition:fly
				animate:flip={{ duration: 500, delay: 200 }}>
				<NodeserverCard
					{server}
					onEdit={openEditSheet} />
			</div>
		{/each}
	{:else}
		<div
			class="border-muted-foreground w-full rounded-md border border-dashed p-2 text-center font-medium">
			<p>There are no Node servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Content
		side="right"
		class="px-2 py-4">
		<NodeServerForm
			mode="edit"
			bind:label
			bind:notes
			bind:foundryPath
			bind:dataPath
			bind:port
			bind:args
			bind:order
			bind:error
			onSubmit={handleUpdateServer} />
	</Sheet.Content>
</Sheet.Root>
