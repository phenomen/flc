<script lang="ts">
	import { fly } from "svelte/transition";
	import { flip } from "svelte/animate";

	import NodeserverCard from "$components/NodeserverCard.svelte";
	import { nodeservers } from "$scripts/nodeservers.svelte.js";
</script>

<div class="relative mb-8 grid gap-2">
	{#if nodeservers.current.length}
		{#each nodeservers.current as server (server.id)}
			<div
				transition:fly
				animate:flip={{ duration: 500, delay: 200 }}>
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
