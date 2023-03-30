<script lang="ts">
  import type { I18n } from "$lib/types";

  import { open } from "@tauri-apps/api/dialog";
  import { invoke } from "@tauri-apps/api/tauri";

  import { localstore } from "svu/store";

  import i18nJson from "$lib/data/i18n.json";

  import TablerFolder from "~icons/tabler/folder";
  import TablerPlayerPlay from "~icons/tabler/player-play";
  import TablerPlayerStop from "~icons/tabler/player-stop";

  export let checkAllServers: Function;

  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const foundryDir = localstore("foundrydir", "");

  let launched: boolean = false;
  let serverError: string = "";

  async function startServer() {
    if ($foundryDir === "" || $foundryDir === undefined) {
      launched = false;
      serverError = "------------ SELECT FOUNDRY VTT INSTALLATION DIRECTORY -----------";
      return;
    }

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
    } catch (error) {
      serverError = JSON.stringify(error) || "";
      console.error(error);
    }

    launched = false;
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

<section class="my-6">
  <div
    class="bg-slate-200 dark:bg-slate-800 p-2 rounded mx-auto text-center justify-center shadow-inner"
  >
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
            class="block w-full rounded text-slate-950 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500 text-sm bg-slate-50 dark:bg-slate-950"
            disabled
          />
        </div>

        <button
          type="button"
          class="button bg-slate-600 hover:bg-slate-500 rounded "
          on:click={() => selectDir()}
        >
          <TablerFolder />
        </button>

        {#if !launched}
          <button
            type="button"
            class="button bg-blue-600 hover:bg-blue-500 rounded "
            on:click={() => startServer()}
          >
            <TablerPlayerPlay />
          </button>
        {:else}
          <button
            type="button"
            class="button bg-red-600 hover:bg-red-500 rounded"
            on:click={() => {
              stopServer();
            }}
          >
            <TablerPlayerStop />
          </button>
        {/if}
      </div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {i18n.foundryDirTip[$lang]}
      </div>
      {#if serverError.length > 1}
        <div class="mt-4 p-2 bg-slate-950 rounded-md">
          <p class="text-red-500 text-sm font-mono">{serverError}</p>
        </div>
      {/if}
    </div>
  </div>
</section>
