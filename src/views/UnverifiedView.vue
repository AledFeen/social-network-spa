<script>
export default {
  name: "Unverified",

  data() {
    return {
      message: ""
    }
  },

  mounted() {
  },

  methods: {
    logout() {
      this.axios.post(this.$store.getters.serverPath + '/logout').then(() => {
      }).then(() => {
        this.$store.commit('setToken', false);
        this.$store.commit('setUser', undefined)
        this.$store.commit('setAvatar', undefined)
        this.$router.push({name: 'login'})
      }).catch(err => {
        alert(err.response.data.message)
      })
    },

    resend() {
      this.axios.post(this.$store.getters.serverPath + '/email/verification-notification').then(() => {
        this.message = 'We already sent email.'
      }).catch(err => {
        alert(err.response.data.message)
      })
    }
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="flex flex-col w-1/2 md:w-1/5">
      <div class="text-primary_text-light dark:text-primary_text-dark text-lg my-3">Your account is unverified. Check your email.</div>
      <div @click.prevent="logout" class="w-full py-3 mb-5 text-btn_text-dark bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover hover:cursor-pointer drop-shadow-md text-center">{{$t('logout')}}</div>
      <div @click.prevent="resend" class="w-full py-3 mb-5 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md text-center">{{$t('Resend email')}}</div>
      <div class="text-btn_back-secondary">{{ message }}</div>
    </div>

  </div>
</template>

<style>

</style>
