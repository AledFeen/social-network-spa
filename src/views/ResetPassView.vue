<script>
export default {
  name: "Verify",
  props: ['token'],

  data() {
    return {
      message: "",
      email: "",
      password: "",
      password_confirmation: ""
    }
  },

  mounted() {

  },

  methods: {

    reset() {
      this.axios.post(this.$store.getters.serverPath + '/reset-password', {
        email: this.email,
        token: this.token,
        password: this.password,
        password_confirmation: this.password_confirmation
      })
        .then(() => {
          this.message = this.$t('reset-password-message')
        })
        .catch(err => {
          console.log(err)
          //alert(err)
        })
    }

  }
}

</script>

<template>
  <main>
    <input v-model="email" type="email" placeholder="email">
    <input v-model="password" type="password" placeholder="password">
    <input v-model="password_confirmation" type="password" placeholder="password">
    <input @click.prevent="reset" type="submit" value="reset">
    <p>{{ message }}</p>
  </main>

</template>

<style>

</style>
