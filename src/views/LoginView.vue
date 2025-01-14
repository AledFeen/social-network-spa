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
            this.axios.get(this.$store.getters.serverPath + '/api/user').then(res => {
              this.$store.commit('setUser', res.data.data)
            })
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

  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col sm:w-1/2 md:w-1/3 lg:w-1/4 pt-10 pb-10 ps-5 pe-5 rounded-lg shadow-md bg-secondary_back-light dark:bg-secondary_back-dark">
      <input v-model="email" type="email" :placeholder="$t('email-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input v-model="password" type="password" :placeholder="$t('password-placeholder')" class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
      <input @click.prevent="login" type="submit" :value="$t('login')" class="w-full py-3 mb-5 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover drop-shadow-md">
      <RouterLink to="/register" class="w-full py-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">{{$t('register')}}</RouterLink>
      <div class="flex justify-center">
        <hr class="w-[90%] border-t-1 border-gray-a9 my-10">
      </div>
      <RouterLink to="/forgot-password" class="text-center text-link-light dark:text-link-dark hover:underline">{{$t('forgot-link')}}</RouterLink>
    </div>
  </div>

</template>

<style>
</style>
