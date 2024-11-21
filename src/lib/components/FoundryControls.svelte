<script lang="ts">
	import * as Popover from "$ui/popover/index.js";
	import { Separator } from "$ui/separator/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import CircleHelp from "lucide-svelte/icons/circle-help";
</script>

<Popover.Root>
	<Popover.Trigger>
		<div
			class={buttonVariants({ variant: "outline", size: "icon" })}
			title="Hotkeys"
		>
			<CircleHelp size={24} />
		</div>
	</Popover.Trigger>
	<Popover.Content>
		<div class="grid gap-2 font-medium text-xs">
			<div class="w-full justify-between flex space-x-2 items-center">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">F11</kbd></span><span
					>Toggle Fullscreen</span
				>
			</div>
			<Separator />
			<div class="w-full justify-between flex space-x-2 items-center">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">+</kbd></span><span>Zoom In</span>
			</div>
			<Separator />
			<div class="w-full justify-between flex space-x-2 items-center">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">-</kbd></span><span>Zoom Out</span>
			</div>
			<Separator />
			<div class="w-full justify-between flex space-x-2 items-center">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">0</kbd></span><span>Reset Zoom</span>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

<style>
	.kbd {
		@apply bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono font-medium opacity-100;
	}
</style>
