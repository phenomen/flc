<script lang="ts">
	import * as Tooltip from "$ui/tooltip/index.js";
	import * as Kbd from "$ui/kbd/index.js";
	import { buttonVariants } from "$ui/button/index.js";

	import { KeyboardIcon } from "@lucide/svelte";
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<div class={buttonVariants({ variant: "ghost", size: "icon", class: "hover:cursor-help" })}>
			<KeyboardIcon class="block size-5" />
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div class="grid gap-2 p-1 text-center text-sm">
			<div class="flex w-full">
				<span class="mx-auto pb-1.5 text-center font-semibold">Hotkeys in Foundry VTT window</span>
			</div>
			<div class="flex items-center justify-between">
				<span>Toggle Fullscreen</span>
				<Kbd.Group>
					<Kbd.Root>Ctrl/⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root class="w-6">F11</Kbd.Root>
				</Kbd.Group>
			</div>

			<div class="flex items-center justify-between">
				<span>Zoom In</span>
				<Kbd.Group>
					<Kbd.Root>Ctrl/⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root class="w-6">+</Kbd.Root>
				</Kbd.Group>
			</div>

			<div class="flex items-center justify-between">
				<span>Zoom Out</span>
				<Kbd.Group>
					<Kbd.Root>Ctrl/⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root class="w-6">-</Kbd.Root>
				</Kbd.Group>
			</div>

			<div class="flex items-center justify-between">
				<span>Reset Zoom</span>
				<Kbd.Group>
					<Kbd.Root>Ctrl/⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root class="w-6">0</Kbd.Root>
				</Kbd.Group>
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
