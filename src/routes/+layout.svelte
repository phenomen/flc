<script lang="ts">
	import "../app.css";
	import "@fontsource-variable/inter";

	import { ModeWatcher } from "mode-watcher";

	import Header from "$components/Header.svelte";
	import Updater from "$components/Updater.svelte";
	import { registerShortcuts } from "$scripts/shortcuts.svelte.js";

	let { children } = $props();

	registerShortcuts();
</script>

<ModeWatcher />
<Header />
{@render children?.()}
<Updater />
