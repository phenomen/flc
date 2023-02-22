<script lang="ts">
  import { getClient, ResponseType } from "@tauri-apps/api/http";
  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";

  import { localStorageWritable } from "@babichjacob/svelte-localstorage";

  import HeroiconsPlusCircle20Solid from "~icons/heroicons/plus-circle-20-solid";
  import HeroiconsMinusCircle20Solid from "~icons/heroicons/minus-circle-20-solid";
  import HeroiconsArrowPath20Solid from "~icons/heroicons/arrow-path-20-solid";
  import HeroiconsArrowRightCircle20Solid from "~icons/heroicons/arrow-right-circle-20-solid";

  type Server = {
    id: string;
    host: string;
    status: string;
    active: boolean;
    users: number;
    system: string;
    systemVersion: string;
  };

  const defaultStorage: Server[] = [];

  const storage = localStorageWritable("storage", defaultStorage);

  let loading: boolean = false;
  let url: string = "";
  let host: string = "";
  let message: string = "";

  function generateUUID(): string {
    let uuid = window.crypto.randomUUID();
    return uuid;
  }

  function isValid(url: string): boolean {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
      host = new URL(url).origin;
      return true;
    } catch (error) {
      message = "Please enter a valid IP or URL";
      return false;
    }
  }

  // function setTitle(title: string) {
  //   appWindow.setTitle(title);
  // }

  async function addServer(url: string) {
    if (isValid(url)) {
      const uuid = generateUUID();
      let newServer = { id: uuid, host: host, status: "Offline", active: false };
      let servers = $storage;
      servers.push(newServer);
      $storage = servers;
      checkServer(uuid);
      cleanUp();
    }
  }

  function cleanUp() {
    url = "";
    host = "";
  }

  async function removeServer(id: string) {
    let filtered = $storage.filter((item: Server) => item.id !== id);
    $storage = filtered;
  }

  async function checkServer(id: string) {
    loading = true;
    const server = $storage.find((item: Server) => item.id === id);
    const index = $storage.findIndex((item: Server) => item.id === id);

    let data;

    if (
      server.host.includes("forge-vtt.com") ||
      server.host.includes("moltenhosting.com") ||
      server.host.includes("foundryserver.com")
    ) {
      data = {
        active: true,
        status: "Hosting",
      };
    } else {
      let api = {};

      try {
        const client = await getClient();
        const api = await client.get(server.host + "/api/status", {
          timeout: 3,
          responseType: ResponseType.JSON,
        });

        data = {
          active: api.data.active,
          status: api.data.active ? "Active" : "Inactive",
          users: api.data.users,
          system: api.data.system,
          systemVersion: api.data.systemVersion,
        };
      } catch (error) {
        console.log(error);
        data = {
          active: false,
          status: "Offline",
        };
      } finally {
        data = {
          ...data,
          ...api,
        };
      }
    }

    if (index !== -1) {
      $storage[index] = { ...$storage[index], ...data };
    }

    loading = false;
  }

  async function joinServer(host: string) {
    appWindow.maximize();
    window.location.href = host;
  }

  onMount(async () => {
    $storage.forEach((item: Server) => {
      checkServer(item.id);
    });
  });
</script>

<div class="my-8">
  <label
    for="url"
    class="block mb-2 text-sm font-medium text-center text-slate-500 dark:text-slate-100"
    >Enter Foundry server IP or URL</label
  >
  <div id="add" class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
    <input
      type="text"
      id="url"
      bind:value={url}
      class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 text-sm rounded block w-full p-2.5"
      placeholder="https://192.168.0.1:30000 or https://server.com/"
    />
    <button
      type="button"
      class="button bg-orange-600 hover:bg-orange-500 rounded"
      on:click={() => addServer(url)}
    >
      <HeroiconsPlusCircle20Solid /> <span>Add</span>
    </button>
  </div>
  <p class="mt-1 text-center text-slate-500 dark:text-slate-300">
    &nbsp;{message}&nbsp;
  </p>
</div>

<ul class="my-8 grid grid-cols-1 gap-4">
  {#each $storage.slice().reverse() as server (server.id)}
    <li class="col-span-1 items-center flex">
      <div class=" text-slate-400 hover:text-red-500 items-center">
        <button type="button" on:click={() => removeServer(server.id)}>
          <HeroiconsMinusCircle20Solid />
        </button>
      </div>

      <div
        class="flex flex-1 items-center justify-between truncate rounded-l border-l border-t border-b border-slate-200 bg-slate-50 dark:bg-slate-600 dark:border-slate-600 shadow-sm"
      >
        <div class="flex-1 truncate px-4 py-2 text-sm items-center">
          <span class="font-medium text-slate-900 dark:text-slate-50">{server.host}</span>
          <p class="text-slate-500 dark:text-slate-300 truncate flex items-center">
            {#if server.status == "Hosting"}
              Server is hosted on the official Foundry hosting partner.
            {:else if server.status === "Offline"}
              Server is offline or unreachable. Update the status &nbsp; <HeroiconsArrowPath20Solid
              />
            {:else if server.status === "Inactive"}
              Server is online but World is not loaded.
            {:else}
              Server is online | Users: {server.users} | System: {server.system}
              {server.systemVersion}
            {/if}
          </p>
        </div>
      </div>

      {#if server.status === "Offline"}
        {#if loading}
          <button
            type="button"
            class="button bg-blue-500 hover:bg-blue-400 rounded-r hover:cursor-not-allowed"
          >
            <HeroiconsArrowPath20Solid class="animate-spin" />
          </button>
        {:else}
          <button
            type="button"
            class="button bg-amber-500 hover:bg-amber-400 rounded-r"
            on:click={() => checkServer(server.id)}
          >
            <HeroiconsArrowPath20Solid />
          </button>
        {/if}
      {:else}
        <button
          type="button"
          class="button bg-emerald-500 hover:bg-emerald-400 rounded-none rounded-r"
          on:click={() => joinServer(server.host)}
        >
          <HeroiconsArrowRightCircle20Solid />
        </button>
      {/if}
    </li>
  {/each}
</ul>
