<script lang="ts">
  import type { I18n } from "$lib/types";

  import { writable } from "svelte/store";
  import { localstore } from "$lib/util";

  import i18nJson from "$lib/data/i18n.json";

  const i18n: I18n = i18nJson;
  const lang = localstore(writable("en"), "lang");

  let glEnabled = false;
  let highPerf = false;

  function checkWebGL() {
    let canvas = document.createElement("canvas");

    let gl = canvas.getContext("webgl2", {
      powerPreference: "high-performance",
    });

    if (gl) {
      glEnabled = true;
      if (gl.getContextAttributes().powerPreference === "high-performance")
        highPerf = true;
    }
  }

  checkWebGL();
</script>

<div
  class="p-2 rounded text-center justify-center text-sm my-2 mx-auto border flex space-x-2 w-full"
  class:border-emerald-500={glEnabled && highPerf}
  class:border-red-500={!glEnabled || !highPerf}
  class:text-emerald-500={glEnabled && highPerf}
  class:text-red-500={!glEnabled || !highPerf}
>
  <span>
    {#if glEnabled}
      WebGL2 {i18n.isAvailable[$lang]}
    {:else}
      WebGL2 {i18n.isNotAvailable[$lang]}
    {/if}
  </span>
  <span> | </span>
  <span>
    {#if highPerf}
      {i18n.highPerformance[$lang]} {i18n.isAvailable[$lang]}
    {:else}
      {i18n.highPerformance[$lang]} {i18n.isNotAvailable[$lang]}
    {/if}
  </span>
</div>
