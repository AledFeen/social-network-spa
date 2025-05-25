<script>
export default {
  name: "Login",

  data() {
    return {
      email: null,
      message: "",
      haveSent: false,
    }
  },

  methods: {
    forgot() {
      this.axios.post(this.$store.getters.serverPath + '/forgot-password', {email: this.email})
        .then(() => {
            this.message = this.$t('forgot-message')
            this.haveSent = true
        })
        .catch(err => {
          this.message = err.response.data.message
          this.haveSent = true
        })
    }

  }
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col sm:w-1/2 md:w-1/3 lg:w-1/4 pt-10 pb-10 ps-5 pe-5 rounded-lg shadow-md bg-secondary_back-light dark:bg-secondary_back-dark">
      <div class="text-xl text-center mb-5 text-primary_text-light dark:text-primary_text-dark">Вкажіть електронну адресу</div>
      <input v-model="email" type="email" :placeholder="$t('email-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input @click.prevent="forgot" type="submit" :value="$t('send-btn')" class="w-full py-3 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
      <div v-if="haveSent" class="mt-5 text-primary_text-light dark:text-primary_text-dark" >{{ message }}</div>
      <RouterLink to="/" class="text-center mt-5 text-link-light dark:text-link-dark hover:underline">{{$t('back-link')}}</RouterLink>
    </div>

  </div>

</template>

<style>

</style>
