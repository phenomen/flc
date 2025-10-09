<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { SunIcon } from "@lucide/svelte";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$ui/button/index.js";
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		><Button
			onclick={toggleMode}
			variant="outline"
			size="icon">
			<SunIcon class="block size-5" />
		</Button></Tooltip.Trigger>
	<Tooltip.Content
		arrowClasses="bg-secondary"
		class="bg-secondary text-secondary-foreground text-sm">
		<p class="font-semibold">Toggle Theme</p>
	</Tooltip.Content>
</Tooltip.Root>
