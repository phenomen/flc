<script lang="ts">
	import { getContext } from "svelte";

	import { Button } from "$ui/button/index.js";
	import { ScrollArea } from "$ui/scroll-area/index.js";

	import type { LocalStorage, Server } from "$scripts/storage.svelte.js";

	const servers = getContext("servers") as LocalStorage<Server[]>;
</script>

{#if servers.current}
	<ScrollArea class="bg-black text-[#64d86b]  p-2">
		<pre class="text-xs h-[180px] w-full">{JSON.stringify(servers.current, null, 2)}</pre>
	</ScrollArea>
{/if}
