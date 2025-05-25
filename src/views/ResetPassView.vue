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
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    }

  }
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col sm:w-1/2 md:w-1/3 lg:w-1/4 pt-10 pb-10 ps-5 pe-5 rounded-lg shadow-md bg-secondary_back-light dark:bg-secondary_back-dark">
      <input v-model="email" type="email" :placeholder="$t('email-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="password" type="password" :placeholder="$t('password-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="password_confirmation" type="password" :placeholder="$t('confirm-pass-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input @click.prevent="reset" type="submit" :value="$t('reset')" class="w-full py-3 mb-5 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
      <div class="text-primary_text-light dark:text-primary_text-dark">{{ message }}</div>
    </div>
  </div>
</template>

<style>

</style>
