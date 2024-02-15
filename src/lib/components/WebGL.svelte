<script lang="ts">
	import { lc } from '$lib/tools';
	import { onMount } from 'svelte';

	let glEnabled = false;
	let highPerf = false;

	function checkWebGL() {
		let canvas = document.createElement('canvas');

		let gl = canvas.getContext('webgl2', {
			powerPreference: 'high-performance'
		});

		if (gl) {
			glEnabled = true;
			if (gl.getContextAttributes()?.powerPreference === 'high-performance') {
				highPerf = true;
			}
		}
	}

	onMount(() => {
		checkWebGL();
	});
</script>

<div
	class={`${
		!glEnabled || !highPerf ? 'border-red-500 text-red-500' : 'border-emerald-500 text-emerald-500'
	} text-center text-xs font-mono`}
>
	<span>
		{#if glEnabled}
			WebGL2 {lc.s('isAvailable')}
		{:else}
			WebGL2 {lc.s('isNotAvailable')}
		{/if}
	</span>
	<span> | </span>
	<span>
		{#if highPerf}
			{lc.s('highPerformance')} {lc.s('isAvailable')}
		{:else}
			{lc.s('highPerformance')} {lc.s('isNotAvailable')}
		{/if}
	</span>
</div>
