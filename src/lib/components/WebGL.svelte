<script lang="ts">
	import * as Popover from "$ui/popover/index.js";
	import { buttonVariants } from "$ui/button/index.js";
	import { cn } from "$lib/utils.js";

	import { CpuIcon } from "@lucide/svelte";

	let glEnabled = $state(false);
	let highPerf = $state(false);

	function checkWebGL() {
		let canvas = document.createElement("canvas");

		let gl = canvas.getContext("webgl2", {
			powerPreference: "high-performance"
		});

		if (gl) {
			glEnabled = true;
			if (gl.getContextAttributes()?.powerPreference === "high-performance") highPerf = true;
		}
	}

	checkWebGL();
</script>

<Popover.Root>
	<Popover.Trigger>
		<div
			class={cn(
				buttonVariants({ variant: "outline", size: "icon" }),
				"border-emerald-500 text-emerald-500 hover:text-emerald-500",
				!glEnabled && !highPerf && "border-red-500 text-red-500 hover:text-red-500"
			)}
			title="Performance Report">
			<CpuIcon class="block size-5" />
		</div>
	</Popover.Trigger>
	<Popover.Content>
		<div class="grid gap-2 text-center text-xs font-medium">
			<span>
				{#if glEnabled}
					WebGL2 is available.
				{:else}
					WebGL2 is not available.
				{/if}
			</span>

			<span>
				{#if highPerf}
					High-performance GPU is available.
				{:else}
					High-performance GPU is not available.
				{/if}
			</span>
		</div>
	</Popover.Content>
</Popover.Root>
