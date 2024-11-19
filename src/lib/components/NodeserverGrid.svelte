<script lang="ts">
	import { slide } from "svelte/transition";

	import NodeserverCard from "$components/NodeserverCard.svelte";
	import { nodeservers } from "$scripts/nodeservers.svelte.js";
</script>

<div class="grid gap-2 relative flex-1">
	{#if nodeservers.current.length}
		{#each nodeservers.current as server (server.id)}
			<div transition:slide>
				<NodeserverCard {server} />
			</div>
		{/each}
	{:else}
		<div
			class="font-medium p-2 border border-dashed border-muted-foreground rounded-md w-full text-center"
		>
			<p>There are no Node servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>
