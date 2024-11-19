<script lang="ts">
	import "../app.css";
	import "@fontsource-variable/inter";

	import { ModeWatcher } from "mode-watcher";

	import { Toaster } from "$ui/sonner/index.js";

	import Header from "$components/Header.svelte";
	import { registerTray } from "$scripts/tray.svelte.js";

	let { children } = $props();

	registerTray();
</script>

<ModeWatcher />
<Toaster />
<Header />

{@render children?.()}
