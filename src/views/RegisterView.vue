<script>
export default {
  name: "Registration",

  data() {
    return {
      name:null,
      email: null,
      password: null,
      password_confirmation: null
    }
  },

  methods: {
    register() {
      this.axios.get(this.$store.getters.serverPath + '/sanctum/csrf-cookie').then(response => {
        this.axios.post(this.$store.getters.serverPath + '/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        }).then(() => {
          this.$store.commit('setToken', true);
          this.$router.push('/')
        }).catch(err => {
          alert(err.response.data.message)
        })
      })
    }
  }
}
</script>

<template>
  <main>
    <input v-model="name" type="text" placeholder="name">
    <input v-model="email" type="email" placeholder="email">
    <input v-model="password" type="password" placeholder="password">
    <input v-model="password_confirmation" type="password" placeholder="password">
    <input @click.prevent="register" type="submit" value="registration">
  </main>

</template>

<style>

</style>
