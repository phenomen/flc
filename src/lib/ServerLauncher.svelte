<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
  import { invoke } from "@tauri-apps/api/tauri";

  import { localstore } from "svu/store";
  import { z } from "zod";

  import i18nJson from "$lib/i18n.json";

  import HeroiconsFolder20Solid from "~icons/heroicons/folder-20-solid";
  import HeroiconsPlay20Solid from "~icons/heroicons/play-20-solid";
  import HeroiconsStop20Solid from "~icons/heroicons/stop-20-solid";

  export let checkAllServers: Function;

  const I18n = z.record(z.record(z.string()));
  type I18n = z.infer<typeof I18n>;

  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const foundryDir = localstore("foundrydir", "");

  let launched: boolean = false;
  let serverError: string = "";

  async function startServer() {
    launched = true;
    await invoke("start_server", { params: $foundryDir })
      .then((message) => {
        console.log(message);
        serverError = "";
      })
      .catch((error) => {
        console.error(error);
        launched = false;

        if (error.includes("Foundry VTT cannot start in this directory which is already locked")) {
          serverError =
            "-------------- FOUNDRY VTT SERVER IS ALREADY RUNNING ------------- See error details in Console (F12)";
        } else if (error.includes("Cannot find module")) {
          serverError =
            "------------ INCORRECT FOUNDRY VTT INSTALLATION FOLDER ----------- See error details in Console (F12)";
        } else if (
          error.includes("is not recognized as an internal or external command") ||
          error.includes("program not found")
        ) {
          serverError =
            "--------------------- NODEJS IS NOT INSTALLED -------------------- See error details in Console (F12)";
        } else {
          serverError = error;
        }
      });

    checkAllServers();
  }

  async function stopServer() {
    try {
      await invoke("stop_server");
      launched = false;
      serverError = "";
    } catch (error) {
      console.error(error);
    }

    checkAllServers();
  }

  async function selectDir() {
    const selected = await open({
      directory: true,
    });

    if (selected === null) {
      return;
    } else {
      $foundryDir = selected;
    }
  }
</script>

<section class="my-10">
  <div
    class="bg-slate-200 dark:bg-slate-800 p-2 rounded mx-auto text-center justify-center shadow-inner"
  >
    {#if launched}
      <div class="flex items-center space-x-2 justify-center">
        <div class="font-medium text-slate-700 dark:text-slate-300">
          {i18n.foundryServerSuccess[$lang]}
        </div>
        <button
          type="button"
          class="button bg-red-600 hover:bg-red-500 rounded"
          on:click={() => {
            stopServer();
          }}
        >
          <HeroiconsStop20Solid />
        </button>
      </div>
    {:else}
      <h2 class="font-medium text-slate-700 dark:text-slate-300">
        {i18n.foundryServerLauncher[$lang]}
      </h2>
      <div class="p-2">
        <div class="w-full flex space-x-2">
          <div class="w-full">
            <input
              type="text"
              name="foundryDir"
              id="foundryDir"
              bind:value={$foundryDir}
              disabled
            />
          </div>

          <button
            type="button"
            class="button bg-slate-600 hover:bg-slate-500 rounded "
            on:click={() => selectDir()}
          >
            <HeroiconsFolder20Solid />
          </button>

          <button
            type="button"
            class="button bg-blue-600 hover:bg-blue-500 rounded "
            on:click={() => startServer()}
          >
            <HeroiconsPlay20Solid />
          </button>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {i18n.foundryDirTip[$lang]}
        </div>
        {#if serverError.length > 1}
          <div class="mt-4 p-2 bg-slate-900 rounded-md">
            <p class="text-red-500 text-sm font-mono">{serverError}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
