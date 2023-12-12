<script lang="ts">
	import type { Server } from '$lib/types';

	import { createEventDispatcher } from 'svelte';
	import { preferences } from '$lib/stores';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import { LogInIcon, BookmarkXIcon, InfoIcon } from 'lucide-svelte';

	export let server: Server;

	async function joinServer() {
		window.location.assign(server.host);
	}

	const dispatch = createEventDispatcher();
</script>

<Card.Root class="flex flex-col h-full w-full">
	<Card.Header class="p-2.5 flex-1">
		<Card.Title>{server.label}</Card.Title>
		<Card.Description class={`font-mono text-xs ${$preferences.streamMode ? 'blur-sm' : ''}`}
			>{server.host}</Card.Description
		>
	</Card.Header>

	<Card.Footer class="flex items-center gap-1 w-full p-2.5">
		<Button
			on:click={() => dispatch('removeServerEvent', server.id)}
			variant="outline"
			size="icon"
			class="text-destructive hover:text-destructive hover:border-destructive"
			><BookmarkXIcon /></Button
		>
		<Button
			on:click={() => dispatch('displayServerNotesEvent', server.id)}
			variant="outline"
			size="icon"><InfoIcon /></Button
		>
		<div class="flex-1" />
		<Button on:click={joinServer} variant="outline"><LogInIcon /></Button>
	</Card.Footer>
</Card.Root>
