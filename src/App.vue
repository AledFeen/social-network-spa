<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  },

  mounted() {
    this.checkTheme()
    this.checkToken()
    this.mount = true
  },

  data() {
    return {
      mount: false,
      hasConnect: true,
    };
  },

  methods: {
    checkTheme() {
      const theme = localStorage.getItem('theme')
      console.log(theme)
      if (theme !== null) {
        const htmlElement = document.documentElement;
        if (theme === 'dark') {
          htmlElement.classList.add('dark')
        } else {
          htmlElement.classList.remove('dark')
        }
      } else {
        localStorage.setItem('theme', 'light')
      }
    },

    checkToken() {
      this.axios.get(this.$store.getters.serverPath + '/api/checkAuth').then(res => {
        this.$store.commit('setToken', res.data.token)
        console.log('check token ' + res.data.token)
      }).catch(() => {
        this.hasConnect = false
      })
    },
  }
};
</script>

<template>

  <div class="min-h-screen w-full bg-primary_back-light dark:bg-primary_back-dark">
    <div v-if="!hasConnect" class="flex items-center justify-center min-h-screen">
      <div class="text-btn_back-primary">Connection error. Server does not respond.</div>
    </div>

    <div v-if="!mount" class="flex items-center justify-center min-h-screen">
      <img src="/src/assets/wait-dark.svg" alt="wait"/>
    </div>

    <main v-if="mount">
      <RouterView/>
    </main>

  </div>

</template>

<style>
</style>
