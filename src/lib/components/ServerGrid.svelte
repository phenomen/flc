<script lang="ts">
	import { slide } from "svelte/transition";

	import ServerCard from "$components/ServerCard.svelte";
	import { servers } from "$scripts/servers.svelte.js";
</script>

<div class="grid gap-2 relative mb-8">
	{#if servers.current.length}
		{#each servers.current as server (server.id)}
			<div transition:slide>
				<ServerCard {server} />
			</div>
		{/each}
	{:else}
		<div
			class="font-medium p-2 border border-dashed border-muted-foreground rounded-md w-full text-center"
		>
			<p>There are no servers yet. Start by adding a new server.</p>
		</div>
	{/if}
</div>
