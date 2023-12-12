<script lang="ts">
	import { join } from '@tauri-apps/api/path';
	import { open } from '@tauri-apps/api/dialog';
	import { open as openURL } from '@tauri-apps/api/shell';

	import { lc } from '$lib/utils';
	import { nanoid } from 'nanoid';
	import { nodeservers } from '$lib/stores';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { BookmarkPlusIcon } from 'lucide-svelte';

	let label = '';
	let foundryPath = '';
	let dataPath = '';
	let port = '';
	let world = '';
	let args = '';
	let validationMessage = '';

	async function selectFoundryPath() {
		const selected = await open({
			directory: true,
			multiple: false
		});

		if (selected === null) {
			return;
		} else {
			foundryPath = selected as string;
		}
	}

	async function selectDataPath() {
		const selected = await open({
			directory: true,
			multiple: false
		});

		if (selected === null) {
			return;
		} else {
			dataPath = selected as string;
		}
	}
</script>

<form class="px-2 pt-4 rounded-lg border bg-card text-card-foreground shadow-sm mt-6 grid gap-2">
	<div class="grid grid-cols-9 items-center gap-2">
		<div class="flex flex-col gap-1.5 col-span-2">
			<Label for="label">{lc.s('label')}</Label>
			<Input type="text" id="label" autocomplete="off" bind:value={label} />
		</div>
		<div class="flex flex-col gap-1.5 col-span-4">
			<Label for="foundryPath">{lc.s('foundryPath')}</Label>
			<Input
				type="text"
				id="foundryPath"
				autocomplete="off"
				bind:value={foundryPath}
				on:click={selectFoundryPath}
			/>
		</div>
		<div class="flex flex-col gap-1.5 col-span-3">
			<Label for="dataPath">{lc.s('userDataPath')}</Label>
			<Input
				type="text"
				id="dataPath"
				autocomplete="off"
				placeholder={lc.s('optionalPlaceholder')}
				bind:value={dataPath}
				on:click={selectDataPath}
			/>
		</div>
	</div>

	<div class="grid grid-cols-9 items-center gap-2">
		<div class="flex flex-col gap-1.5 col-span-2">
			<Label for="port">{lc.s('portNumber')}</Label>
			<Input
				type="number"
				id="port"
				autocomplete="off"
				placeholder={lc.s('optionalPlaceholder')}
				bind:value={port}
			/>
		</div>
		<div class="flex flex-col gap-1.5 col-span-2">
			<Label for="world">{lc.s('defaultWorld')}</Label>
			<Input
				type="text"
				id="world"
				autocomplete="off"
				placeholder={lc.s('optionalPlaceholder')}
				bind:value={world}
			/>
		</div>
		<div class="flex flex-col gap-1.5 col-span-3">
			<Label for="args">{lc.s('extraArguments')}</Label>
			<Input
				type="text"
				id="args"
				autocomplete="off"
				placeholder={lc.s('optionalPlaceholder')}
				bind:value={args}
			/>
		</div>
		<div class="flex flex-col gap-1.5 items-end col-span-2">
			<Label for="btn">&nbsp;</Label>
			<Button type="submit" class="w-full">{lc.s('addServer')}</Button>
		</div>
	</div>

	<div class="flex mx-auto text-center mt-2">
		<span class="text-muted-foreground text-sm"
			>{lc.s('foundryServerNodeRequirement')} |

			<button class="underline" on:click={() => openURL('https://nodejs.org/en/download/current')}
				>{lc.s('foundryServerNodeDownload')}</button
			>
		</span>
	</div>

	<div class="text-center justify-center mt-1 text-red-500 font-mono text-sm">
		{#if validationMessage}
			<p>{validationMessage}</p>
		{/if}
	</div>
</form>
