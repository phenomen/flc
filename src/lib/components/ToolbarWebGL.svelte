<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
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

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div
				class={cn(
					buttonVariants({ variant: "outline", size: "icon" }),
					" text-emerald-500 hover:text-emerald-400",
					!glEnabled && !highPerf && "border-destructive text-destructive hover:text-destructive"
				)}>
				<CpuIcon class="block size-5" />
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content
			arrowClasses="bg-secondary"
			class="bg-secondary text-secondary-foreground text-sm">
			<div class="grid gap-2 text-center">
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
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
