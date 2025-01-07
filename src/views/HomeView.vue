<script>
  export default {
    name: 'Home',

    data() {
      return {
        path: this.$store.getters.serverPath
      }
    },

    mounted() {
      this.checkVerified()
    },

    methods: {
      checkVerified() {
        this.axios.get(this.$store.getters.serverPath + '/api/user').then(r => {
          //console.log(r)
          if(r.data.email_verified_at) {
            // maybe will variable to protect routes
          } else {
            alert(this.$t('unverified_message'))
          }
        })
      },

      logout() {
        this.axios.post(this.$store.getters.serverPath + '/logout').then(() => {
        }).then(() => {
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
