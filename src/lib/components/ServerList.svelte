<script lang="ts">
	import type { Server } from '$lib/types';

	import { lc } from '$lib/tools';
	import { servers, preferences } from '$lib/stores';

	import ServerItem from '$lib/components/ServerItem.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';

	import { SaveIcon } from 'lucide-svelte';

	let notesOpen = false;
	let notes = '';
	let notesId = '';

	function removeServer(id: string) {
		let filtered = $servers.filter((item: Server) => item.id !== id);
		$servers = filtered;
	}

	function displayServerNotes(id: string) {
		let server = $servers.find((item: Server) => item.id === id);

		if (server) {
			notesId = server.id;
			notes = server.notes || '';
			notesOpen = true;
		}
	}

	function saveNotes(id: string) {
		let server = $servers.find((item: Server) => item.id === id);

		if (server) {
			server.notes = notes;
			$servers = [...$servers];
		}
		notesOpen = false;
	}
</script>

<div class="my-6">
	{#if $servers.length === 0}
		<Alert.Root>
			<Alert.Description class="text-center">{lc.s('emptyListMessage')}</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
			{#each $servers.toReversed() as server (server.id)}
				<ServerItem
					{server}
					on:removeServerEvent={(e) => removeServer(e.detail)}
					on:displayServerNotesEvent={(e) => displayServerNotes(e.detail)}
				/>
			{/each}
		</div>
	{/if}
</div>

<Dialog.Root bind:open={notesOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{lc.s('serverNotes')}</Dialog.Title>
			<Dialog.Description>{lc.s('serverNotesDescription')}</Dialog.Description>
		</Dialog.Header>

		<form class="flex w-full items-center space-x-2" on:submit={() => saveNotes(notesId)}>
			<Input bind:value={notes} class={`${$preferences.streamMode ? 'blur-sm' : ''}`} />

			<Button type="submit"><SaveIcon /></Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
