<script>
  export default {
    data() {
      return {
        path: this.$store.getters.serverPath
      }
    }
  }
</script>

<template>
  <main class="font-bold underline">
    Home {{ path }}, {{$t('test')}}
  </main>
</template>
