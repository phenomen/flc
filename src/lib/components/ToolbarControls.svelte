<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Separator } from "$ui/separator/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { CircleHelpIcon } from "@lucide/svelte";
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div class={buttonVariants({ variant: "outline", size: "icon" })}>
				<CircleHelpIcon size={24} />
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content
			arrowClasses="bg-secondary"
			class="bg-secondary text-secondary-foreground text-sm">
			<div class="grid gap-2 text-center text-sm">
				<div class="flex w-full">
					<span class="mx-auto pb-1.5 text-center font-semibold"
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
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
