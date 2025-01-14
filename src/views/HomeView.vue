<script>
  import LayoutWithSidebar from "/src/layouts/PageWithSidebarLayout.vue"
  export default {
    name: 'Home',
    components: { LayoutWithSidebar },
    data() {
      return {
        path: this.$store.getters.serverPath,
      }
    },

    mounted() {
     this.checkVerified()
    },

    methods: {
      checkVerified() {
        let user = this.$store.getters.user
        if(user) {
          if(!user.email_verified_at) {
            alert(this.$t('unverified_message'))
          }
        } else {
          setTimeout(() => {
            this.checkVerified();
          }, 500);
        }
      },

      logout() {
        this.axios.post(this.$store.getters.serverPath + '/logout').then(() => {
        }).then(() => {
          this.$store.commit('setToken', false);
          this.$store.commit('setUser', undefined)
          this.$router.push({name: 'login'})
        }).catch(err => {
          alert(err.response.data.message)
        })
      }
    }
  }
</script>

<template>
  <LayoutWithSidebar :page="'Home'">
    <main class="font-bold underline">
      Home {{ path }}, {{$t('test')}}
      <input @click.prevent="logout" type="submit" value="logout">
    </main>
  </LayoutWithSidebar>
</template>
