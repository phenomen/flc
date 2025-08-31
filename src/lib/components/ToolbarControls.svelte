<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Separator } from "$ui/separator/index.js";
	import { buttonVariants } from "$ui/button/index.js";
	import { Badge } from "$ui/badge/index.js";

	import { KeyboardIcon } from "@lucide/svelte";
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div class={buttonVariants({ variant: "ghost", size: "icon", class: "hover:cursor-help" })}>
				<KeyboardIcon class="block size-5" />
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content
			arrowClasses="bg-secondary"
			class="bg-muted text-muted-foreground text-sm">
			<div class="grid gap-2 text-center text-sm">
				<div class="flex w-full">
					<span class="mx-auto pb-1.5 text-center font-semibold"
						>Hotkeys in Foundry VTT window</span>
				</div>
				<div class="flex items-center space-x-1">
					<Badge variant="outline">Ctrl/⌘</Badge>
					<Badge variant="outline">F11</Badge>
					<span class="ml-auto">Toggle Fullscreen</span>
				</div>
				<Separator />
				<div class="flex items-center space-x-1">
					<Badge variant="outline">Ctrl/⌘</Badge>
					<Badge variant="outline">+</Badge>
					<span class="ml-auto">Zoom In</span>
				</div>
				<Separator />
				<div class="flex items-center space-x-1">
					<Badge variant="outline">Ctrl/⌘</Badge>
					<Badge variant="outline">-</Badge>
					<span class="ml-auto">Zoom Out</span>
				</div>
				<Separator />
				<div class="flex items-center space-x-1">
					<Badge variant="outline">Ctrl/⌘</Badge>
					<Badge variant="outline">0</Badge>
					<span class="ml-auto">Reset Zoom</span>
				</div>
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
