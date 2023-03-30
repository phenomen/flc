<script lang="ts">
  import { localstore } from "svu/store";

  import type { I18n } from "$lib/types";
  import i18nJson from "$lib/data/i18n.json";

  import TablerMoon from "~icons/tabler/moon";
  import TablerSun from "~icons/tabler/sun";
  import TablerShieldCheck from "~icons/tabler/shield-check";
  import TablerShieldX from "~icons/tabler/shield-x";

  const i18n: I18n = i18nJson;
  const theme = localstore("theme", "light");
  const lang = localstore("lang", "en");
  const skipCheck = localstore("skipcheck", false);

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
      $lang = "ru";
    } else {
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
    class="p-1 hover:text-orange-600"
  >
    {#if $skipCheck}
      <TablerShieldX />
    {:else}
      <TablerShieldCheck />
    {/if}
  </button>
  <button
    on:click={() => switchTheme()}
    title={i18n.toggleTheme[$lang]}
    class="p-1 hover:text-orange-600"
  >
    {#if $theme === "dark"}
      <TablerMoon />
    {:else}
      <TablerSun />
    {/if}
  </button>
  <button
    on:click={() => switchLanguage()}
    title={i18n.switchLanguage[$lang]}
    class="uppercase font-medium p-1 hover:text-orange-600"
  >
    <span>{$lang}</span>
  </button>
</div>
