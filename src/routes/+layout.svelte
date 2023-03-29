<script lang="ts">
  import "../app.css";
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
</script>

<main class="max-w-xl py-6 px-2 mx-auto w-full h-full flex flex-col">
  <Header />
  <slot />
  <Footer />
</main>
