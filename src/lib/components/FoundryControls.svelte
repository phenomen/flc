<script lang="ts">
	import { Button } from "$ui/button/index.js";

	import Fullscreen from "lucide-svelte/icons/fullscreen";
	import ZoomIn from "lucide-svelte/icons/zoom-in";
	import ZoomOut from "lucide-svelte/icons/zoom-out";

	import { toggleFullscreen, zoomIn, zoomOut } from "$scripts/tray.svelte";
</script>

<div class="flex items-center space-x-1 p-1 border rounded-md border-orange-500">
	<Button
		onclick={zoomOut}
		variant="outline"
		size="icon"
		title="Zoom Out"
	>
		<ZoomOut class="size-5" />
	</Button>

	<Button
		onclick={zoomIn}
		variant="outline"
		size="icon"
		title="Zoom In"
	>
		<ZoomIn class="size-5" />
	</Button>

	<Button
		onclick={toggleFullscreen}
		variant="outline"
		size="icon"
		title="Toggle Fullscreen"
	>
		<Fullscreen class="size-5" />
	</Button>
</div>
