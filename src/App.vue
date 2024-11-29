<script>
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },

  mounted() {
    this.checkToken()
  },

  methods: {

    checkToken() {
      this.axios.get(this.$store.getters.serverPath + '/api/checkAuth').then(res => {
        this.$store.commit('setToken', res.data.token);
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }

  }
};
</script>

<template>
  <header>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </nav>

  </header>

  <RouterView/>
</template>

<style>
</style>
