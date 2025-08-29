<script lang="ts">
	import "../app.css";
	import "@fontsource-variable/geist";

	import { ModeWatcher } from "mode-watcher";

	import Header from "$components/Header.svelte";
	import Updater from "$components/Updater.svelte";
	import { registerShortcuts } from "$scripts/shortcuts.svelte.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	let { children } = $props();
	let tab = $state<"join" | "launch">("join");

	registerShortcuts();
</script>

<ModeWatcher />

<Tabs.Root bind:value={tab}>
	<Header />
	{@render children?.()}
</Tabs.Root>

<Updater />
