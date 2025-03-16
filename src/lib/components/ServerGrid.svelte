<script lang="ts">
	import type { Server } from "$scripts/servers.svelte.js";
	import { fade } from "svelte/transition";

	import ServerCard from "$components/ServerCard.svelte";
	import { servers } from "$scripts/servers.svelte.js";

	function sortServers(s: Server[]) {
		s.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
	}

	$effect(() => {
		sortServers(servers.current);
	});
</script>

<div class="relative mb-8 grid gap-2">
	{#if servers.current.length}
		{#each servers.current as server (server.id)}
			<div transition:fade>
				<ServerCard {server} />
			</div>
		{/each}
	{:else}
		<div
			class="w-full rounded-md border border-dashed border-muted-foreground p-2 text-center font-medium">
			<p>There are no servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>
