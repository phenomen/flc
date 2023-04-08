<script lang="ts">
  import type { I18n } from "$lib/types";

  import { writable } from "svelte/store";
  import { localstore } from "$lib/util";

  import i18nJson from "$lib/data/i18n.json";

  import IconMoon from "~icons/heroicons/moon-20-solid";
  import IconSun from "~icons/heroicons/sun-20-solid";
  import IconShieldCheck from "~icons/heroicons/shield-check-20-solid";
  import IconShieldX from "~icons/heroicons/shield-exclamation-20-solid";

  const i18n: I18n = i18nJson;

  const theme = localstore(writable("light"), "theme");
  const lang = localstore(writable("en"), "lang");
  const skipCheck = localstore(writable(false), "skipcheck");

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

  function switchCheck() {
    $skipCheck = !$skipCheck;
    location.reload();
  }

  function switchLanguage() {
    if ($lang === "en") {
      $lang = "pt";
    } else if ($lang === "pt") {
      $lang = "ru";
    } else if ($lang === "ru") {
      $lang = "en";
    }

    location.reload();
  }

  setTheme();
</script>

<div class="text-lg text-slate-500 dark:text-slate-200 items-center space-x-2 flex">
  <button
    on:click={() => switchCheck()}
    title={i18n.toggleCheck[$lang]}
    class="p-1 hover:text-orange-500"
    class:text-red-600={$skipCheck}
    class:text-emerald-500={!$skipCheck}
  >
    {#if $skipCheck}
      <IconShieldX />
    {:else}
      <IconShieldCheck />
    {/if}
  </button>
  <button
    on:click={() => switchTheme()}
    title={i18n.toggleTheme[$lang]}
    class="p-1 hover:text-orange-500"
  >
    {#if $theme === "dark"}
      <IconMoon />
    {:else}
      <IconSun />
    {/if}
  </button>
  <button
    on:click={() => switchLanguage()}
    title={i18n.switchLanguage[$lang]}
    class="uppercase font-medium p-1 hover:text-orange-500"
  >
    <span>{$lang}</span>
  </button>
</div>
