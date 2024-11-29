<script>
  export default {
    name: 'Home',

    data() {
      return {
        path: this.$store.getters.serverPath
      }
    },

    methods: {
      logout() {
        this.axios.post(this.$store.getters.serverPath + '/logout').then(r => {
        }).then(r => {
          this.$store.commit('setToken', false);
          this.$router.push({name: 'login'})
        }).catch(err => {
          alert(err.response.data.message)
        })
      }
    }
  }
</script>

<template>
  <main class="font-bold underline">
    Home {{ path }}, {{$t('test')}}
    <input @click.prevent="logout" type="submit" value="logout">
  </main>
</template>
