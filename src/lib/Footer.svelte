<script lang="ts">
  import { open } from "@tauri-apps/api/shell";
  import { onMount } from "svelte";
  import { localStorageWritable } from "@babichjacob/svelte-localstorage";

  import HeroiconsSun20Solid from "~icons/heroicons/sun-20-solid";
  import HeroiconsMoon20Solid from "~icons/heroicons/moon-20-solid";

  async function openURL(url: string) {
    await open(url);
  }

  const theme = localStorageWritable("theme", "light");
  const lang = localStorageWritable("lang", "en");

  function setTheme() {
    if ($theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function switchTheme() {
    if ($theme === "dark") {
      $theme = "light";
    } else {
      $theme = "dark";
    }
    setTheme();
  }

  function switchLang() {
    if ($lang === "en") {
      $lang = "ru";
    } else {
      $lang = "en";
    }
    location.reload();
  }

  onMount(async () => {
    setTheme();
  });
</script>

<div class="text-center">
  <div class="mb-6 text-slate-500 dark:text-slate-200 items-center">
    <button on:click={() => switchTheme()}>
      {#if $theme === "dark"}
        <HeroiconsMoon20Solid />
      {:else}
        <HeroiconsSun20Solid />
      {/if}
    </button>
    <button on:click={() => switchLang()} class="uppercase font-medium">
      <svg />{$lang}
    </button>
  </div>
  <div class="text-sm text-slate-500 dark:text-slate-400">
    <button on:click={() => openURL("https://github.com/phenomen/flc")}>
      <span class="text-blue-500 dark:text-blue-300 hover:underline">Github</span></button
    >
  </div>
</div>
