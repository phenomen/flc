<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { appWindow } from '@tauri-apps/api/window';
	import { preferences } from '$lib/stores';
	import { lc } from '$lib/utils';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	import {
		SunIcon,
		MoonIcon,
		MinimizeIcon,
		MaximizeIcon,
		VideoIcon,
		VideoOffIcon
	} from 'lucide-svelte';

	let isFullscreen = false;

	const languages = [
		{ value: 'en', label: 'EN-US' },
		{ value: 'pt', label: 'PT-BR' },
		{ value: 'es', label: 'ES-ES' },
		{ value: 'ru', label: 'RU-RU' }
	];

	function toggleStreamMode() {
		$preferences.streamMode = !$preferences.streamMode;
	}

	async function toggleFullscreen() {
		isFullscreen = await appWindow.isFullscreen();
		appWindow.setFullscreen(!isFullscreen);
	}
</script>

<div class="flex items-center gap-1">
	<Select.Root
		bind:selected={$preferences.language}
		onSelectedChange={() => window.location.reload()}
	>
		<Select.Trigger class="w-[120px]">
			<Select.Value placeholder={$preferences.language.label} />
		</Select.Trigger>
		<Select.Content>
			{#each languages as language}
				<Select.Item value={language.value}>{language.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<Button
		on:click={toggleFullscreen}
		variant="outline"
		size="icon"
		title={lc.s('toggleFullscreen') + ' (Ctrl+F11)'}
	>
		{#if isFullscreen}
			<MaximizeIcon />
		{:else}
			<MinimizeIcon />
		{/if}
	</Button>

	<Button
		on:click={toggleStreamMode}
		variant="outline"
		size="icon"
		title={lc.s('toggleStreamMode')}
	>
		{#if $preferences.streamMode}
			<VideoIcon />
		{:else}
			<VideoOffIcon />
		{/if}
	</Button>

	<Button on:click={toggleMode} variant="outline" size="icon" title={lc.s('toggleTheme')}>
		<SunIcon class="absolute scale-100 dark:scale-0" />
		<MoonIcon class="absolute scale-0 dark:scale-100" />
	</Button>
</div>
