<script lang="ts">
	import { onDestroy } from "svelte";
	import { CheckIcon, CopyIcon } from "@lucide/svelte";
	import { Button } from "$ui/button/index.js";

	let { text }: { text: string } = $props();
	let message = $state("");
	let copying = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => clearTimeout(resetTimer));

	async function copyText() {
		if (!text || copying) return;
		clearTimeout(resetTimer);
		message = "";
		copying = true;
		try {
			await navigator.clipboard.writeText(text);
			message = "Copied";
		} catch {
			message = "Could not copy text. Try again.";
		} finally {
			copying = false;
			resetTimer = setTimeout(() => (message = ""), 3000);
		}
	}
</script>

<div class="relative mr-2 shrink-0">
	<Button
		size="icon"
		variant="outline"
		disabled={!text || copying}
		title={text ? "Copy text" : "Add Quick Copy Text in Edit Server"}
		aria-label="Copy text"
		onclick={copyText}>
		{#if message === "Copied"}<CheckIcon />{:else}<CopyIcon />{/if}
	</Button>
	<span
		role="status"
		class={message
			? "bg-popover text-popover-foreground absolute top-full right-0 z-10 mt-1 w-max max-w-48 rounded-md border px-2 py-1 text-xs shadow-sm"
			: "sr-only"}>
		{message}
	</span>
</div>
