<script>
export default {
  name: "Login",

  data() {
    return {
      email: null,
      message: ""
    }
  },

  methods: {
    forgot() {
      this.axios.post(this.$store.getters.serverPath + '/forgot-password', {email: this.email})
        .then(() => {
            this.message = this.$t('forgot-message')
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
    <input @click.prevent="forgot" type="submit" value="forgot">
    <p>{{ message }}</p>
  </main>

</template>

<style>

</style>
