<script lang="ts">
	import { ValidURLScheme } from '$lib/types';

	import { lc } from '$lib/tools';
	import { nanoid } from 'nanoid';
	import { servers } from '$lib/stores';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { BookmarkPlusIcon } from 'lucide-svelte';

	let host = '';
	let label = '';
	let validationMessage = '';

	function isValid(url: string): boolean {
		if (ValidURLScheme.safeParse(url).success) {
			return true;
		} else {
			validationMessage = lc.s('messageNotURL');
			return false;
		}
	}

	function addServer() {
		if (isValid(host)) {
			servers.update((s) => [
				...s,
				{
					id: nanoid(),
					label: label,
					host: host,
					notes: ''
				}
			]);

			label = '';
			host = '';
			validationMessage = '';
		}
	}
</script>

<form class="px-2 py-4 rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
	<div class="flex items-center gap-2">
		<div class="flex flex-col w-[300px] gap-1.5">
			<Label for="label">{lc.s('label')}</Label>
			<Input
				type="text"
				id="label"
				autocomplete="off"
				placeholder={lc.s('optionalPlaceholder')}
				bind:value={label}
			/>
		</div>
		<div class="flex flex-col w-full gap-1.5">
			<Label for="host">{lc.s('url')}</Label>
			<Input
				type="text"
				id="host"
				autocomplete="off"
				placeholder={lc.s('urlPlaceholder')}
				bind:value={host}
			/>
		</div>

		<div class="flex flex-col gap-1.5 items-end">
			<Label for="btn">&nbsp;</Label>
			<Button type="submit" on:click={addServer} size="icon"><BookmarkPlusIcon /></Button>
		</div>
	</div>
	<div class="text-center justify-center mt-1 text-red-500 font-mono text-sm">
		{#if validationMessage}
			<p>{validationMessage}</p>
		{/if}
	</div>
</form>
