<script>
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },

  mounted() {
    this.checkTheme()
    this.checkToken()
  },

  data() {
    return {
      hasConnect: true
    };
  },

  methods: {

    checkTheme() {
      const theme = localStorage.getItem('theme');
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
        this.$store.commit('setToken', res.data.token);
      }).catch(err => {
        this.hasConnect = false;
        console.log(err.response.data.message)
      })
    },
  }
};
</script>

<template>

  <div class="min-h-screen w-full bg-primary_back-light dark:bg-primary_back-dark">

    <div v-if="!hasConnect" class="text-btn_back-primary">Connection error</div>
    <main>
      <RouterView/>
    </main>

  </div>

</template>

<style>
</style>
