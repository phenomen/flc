<script lang="ts">
	import { fly } from "svelte/transition";
	import { flip } from "svelte/animate";

	import ServerCard from "$components/ServerCard.svelte";
	import { servers, updateServer, type Server } from "$scripts/servers.svelte.js";
	import * as Sheet from "$ui/sheet/index.js";
	import ServerForm from "$lib/components/ServerForm.svelte";

	let editingServer = $state<Server | null>(null);
	let isOpen = $state<boolean>(false);
	let label = $state<string>("");
	let url = $state<string>("");
	let notes = $state<string>("");
	let order = $state<number>(0);
	let error = $state<string>("");

	function openEditSheet(server: Server) {
		editingServer = server;
		label = server.label;
		url = server.url;
		notes = server.notes || "";
		order = server.order ?? 0;
		error = "";
		isOpen = true;
	}

	function handleUpdateServer() {
		if (!editingServer) return;

		const result = updateServer({
			id: editingServer.id,
			label,
			url,
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
	{#if servers.current.length}
		{#each servers.current as server (server.id)}
			<div
				transition:fly
				animate:flip={{ duration: 500, delay: 200 }}>
				<ServerCard
					{server}
					onEdit={openEditSheet} />
			</div>
		{/each}
	{:else}
		<div
			class="border-muted-foreground w-full rounded-md border border-dashed p-2 text-center font-medium">
			<p>There are no servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Content
		side="right"
		class="px-2 py-4">
		<ServerForm
			mode="edit"
			bind:label
			bind:url
			bind:notes
			bind:order
			bind:error
			onSubmit={handleUpdateServer} />
	</Sheet.Content>
</Sheet.Root>
