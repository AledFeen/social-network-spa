<script>
export default {
  name: "Login",

  data() {
    return {
      email: null,
      password: null
    }
  },

  methods: {
    login() {
      this.axios.get(this.$store.getters.serverPath + '/sanctum/csrf-cookie').then(() => {
        this.axios.post(this.$store.getters.serverPath + '/login', {email: this.email, password: this.password})
          .then(() => {
            this.$store.commit('setToken', true);
            this.$router.push('/')
          })
          .catch(err => {
            alert(err.response.data.message)
          })
      });
    },

  }
}

</script>

<template>
  <main>
    <input v-model="email" type="email" placeholder="email">
    <input v-model="password" type="password" placeholder="password">
    <input @click.prevent="login" type="submit" value="login">
  </main>

</template>

<style>

</style>
