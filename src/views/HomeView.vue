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
    }
  }
</script>

<template>
  <LayoutWithSidebar :page="'Home'">
    <main class="font-bold underline">
      Home {{ path }}, {{$t('test')}}
    </main>
  </LayoutWithSidebar>
</template>
