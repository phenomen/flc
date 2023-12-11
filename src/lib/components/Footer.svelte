<script lang="ts">
	import { onMount } from 'svelte';
	import { getVersion } from '@tauri-apps/api/app';
	import WebGL from '$lib/components/WebGL.svelte';

	let appVersion = '1.0';

	onMount(async () => {
		appVersion = await getVersion();
	});
</script>

<div class="py-4">
	<WebGL />

	<div class="text-center text-muted-foreground text-xs mt-2">
		<span class="font-bold">Foundry Lightweight Client</span> v{appVersion}
	</div>
</div>
