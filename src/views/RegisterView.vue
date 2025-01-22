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

  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col sm:w-1/2 md:w-1/3 lg:w-1/4 pt-10 pb-10 ps-5 pe-5 rounded-lg shadow-md bg-secondary_back-light dark:bg-secondary_back-dark">
      <input v-model="name" type="text" :placeholder="$t('name-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="email" type="email" :placeholder="$t('email-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="password" type="password" :placeholder="$t('password-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="password_confirmation" type="password" :placeholder="$t('confirm-pass-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input @click.prevent="register" type="submit" :value="$t('register')" class="w-full py-3 mb-5 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
      <RouterLink to="/login" class="w-full py-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">{{$t('login-link')}}</RouterLink>
    </div>
  </div>

</template>

<style>

</style>
