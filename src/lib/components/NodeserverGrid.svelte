<script lang="ts">
	import type { Nodeserver } from "$scripts/nodeservers.svelte.js";
	import { fade } from "svelte/transition";

	import NodeserverCard from "$components/NodeserverCard.svelte";
	import { nodeservers } from "$scripts/nodeservers.svelte.js";

	function sortServers(s: Nodeserver[]) {
		s.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
	}

	$effect(() => {
		sortServers(nodeservers.current);
	});
</script>

<div class="relative mb-8 grid gap-2">
	{#if nodeservers.current.length}
		{#each nodeservers.current as server (server.id)}
			<div transition:fade>
				<NodeserverCard {server} />
			</div>
		{/each}
	{:else}
		<div
			class="w-full rounded-md border border-dashed border-muted-foreground p-2 text-center font-medium">
			<p>There are no Node servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>
