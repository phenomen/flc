<script lang="ts">
	import type { Server } from '$lib/types';
	import { fetch } from '@tauri-apps/api/http';
	import { createEventDispatcher, onMount } from 'svelte';
	import { preferences } from '$lib/stores';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import { LogInIcon, BookmarkXIcon, InfoIcon, RadioIcon } from 'lucide-svelte';

	export let server: Server;

	let loading = false;
	let state: string = 'unknown';

	async function checkAPI(url: string, timeout: number): Promise<boolean> {
		loading = true;
		let api;

		try {
			api = await fetch(url, {
				method: 'HEAD',
				timeout: timeout,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'User-Agent': 'FLC'
				}
			});
		} catch (error) {
			return false;
		} finally {
			loading = false;

			if (api?.ok) {
				return true;
			} else {
				return false;
			}
		}
	}

	async function checkServer() {
		const partners = ['forge-vtt.com', 'moltenhosting.com', 'foundryserver.com'];
		const hostingMatch = partners.some((url) => server.host.includes(url));

		if (hostingMatch) {
			state = 'hosting';
		} else {
			checkAPI(server.host, 2).then((exists) => {
				state = exists ? 'active' : 'inactive';
			});
		}
	}

	async function joinServer() {
		window.location.assign(server.host);
	}

	const dispatch = createEventDispatcher();

	onMount(() => {
		checkServer();
	});
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
			class="hover:text-destructive hover:border-destructive"><BookmarkXIcon /></Button
		>
		<Button
			on:click={() => dispatch('displayServerNotesEvent', server.id)}
			variant="outline"
			size="icon"><InfoIcon /></Button
		>
		<Button on:click={checkServer} variant="outline" size="icon" disabled={loading}>
			<div
				class:animate-spin={loading}
				class:text-emerald-500={state === 'active'}
				class:text-red-500={state === 'inactive'}
				class:text-sky-500={state === 'hosting'}
			>
				<RadioIcon />
			</div>
		</Button>
		<div class="flex-1" />
		<Button on:click={joinServer} size="icon"><LogInIcon /></Button>
	</Card.Footer>
</Card.Root>
