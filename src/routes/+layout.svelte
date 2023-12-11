<script lang="ts">
	import '../app.pcss';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';

	import { ModeWatcher } from 'mode-watcher';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<ModeWatcher />

<div class="container mx-auto py-4 max-w-4xl flex flex-col h-full">
	<Header />

	<div class="flex-1">
		<slot />
	</div>

	<Footer />
</div>
