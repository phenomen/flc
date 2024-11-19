<script lang="ts">
	import { slide } from "svelte/transition";

	import ServerCard from "$components/ServerCard.svelte";

	import { servers } from "$scripts/servers.svelte.js";
</script>

<div class="grid gap-2 relative my-4 flex-1">
	{#if servers.current.length}
		{#each servers.current as server (server.id)}
			<div transition:slide>
				<ServerCard {server} />
			</div>
		{/each}
	{:else}
		<div class="flex text-center mx-auto font-medium">
			The server list is empty. Start by adding a new Server.
		</div>
	{/if}
</div>
