<script lang="ts">
	import type { NodeServer } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import { BookmarkXIcon, RocketIcon, XOctagonIcon } from 'lucide-svelte';

	export let server: NodeServer;
	export let launched: string;

	const dispatch = createEventDispatcher();
</script>

<Card.Root
	class={`flex flex-col h-full w-full ${launched === server.id ? 'border-emerald-500' : ''}`}
>
	<Card.Header class="p-2.5">
		<Card.Title>{server.label}</Card.Title>
	</Card.Header>

	<Card.Content class="p-2.5 flex-1">
		<div class="font-mono text-xs grid gap-1 p-2 bg-muted text-muted-foreground rounded-md">
			<div>node {server.foundryPath}\resources\app\main.js</div>
			{#if server.dataPath}<div>--dataPath={server.dataPath}</div>{/if}
			{#if server.port}<div>--port={server.port}</div>{/if}
			{#if server.world}<div>--world={server.world}</div>{/if}
			{#if server.args}<div>{server.args}</div>{/if}
		</div>
	</Card.Content>

	<Card.Footer class="flex items-center gap-1 w-full p-2.5">
		<Button
			on:click={() => dispatch('removeServerNodeEvent', server.id)}
			variant="outline"
			size="icon"
			class="hover:text-destructive hover:border-destructive"><BookmarkXIcon /></Button
		>
		<div class="flex-1" />
		{#if launched === server.id}
			<Button size="icon" variant="destructive" on:click={() => dispatch('stopServerNodeEvent')}
				><XOctagonIcon /></Button
			>
		{/if}
		<Button
			size="icon"
			on:click={() => dispatch('startServerNodeEvent', server)}
			disabled={launched !== ''}><RocketIcon /></Button
		>
	</Card.Footer>
</Card.Root>
