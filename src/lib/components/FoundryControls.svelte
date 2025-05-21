<script lang="ts">
	import * as Popover from "$ui/popover/index.js";
	import { Separator } from "$ui/separator/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { CircleHelpIcon } from "@lucide/svelte";
</script>

<Popover.Root>
	<Popover.Trigger>
		<div
			class={buttonVariants({ variant: "outline-solid", size: "icon" })}
			title="Hotkeys">
			<CircleHelpIcon size={24} />
		</div>
	</Popover.Trigger>
	<Popover.Content>
		<div class="grid gap-2 text-xs font-medium">
			<div class="flex w-full">
				<span class="text-muted-foreground mx-auto pb-1.5 text-center"
					>Hotkeys in Foundry VTT window</span>
			</div>
			<div class="flex w-full items-center justify-between space-x-2">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">F11</kbd></span><span
					>Toggle Fullscreen</span>
			</div>
			<Separator />
			<div class="flex w-full items-center justify-between space-x-2">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">+</kbd></span><span>Zoom In</span>
			</div>
			<Separator />
			<div class="flex w-full items-center justify-between space-x-2">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">-</kbd></span><span>Zoom Out</span>
			</div>
			<Separator />
			<div class="flex w-full items-center justify-between space-x-2">
				<span><kbd class="kbd">Ctrl/⌘</kbd> <kbd class="kbd">0</kbd></span><span>Reset Zoom</span>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
