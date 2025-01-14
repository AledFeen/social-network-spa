<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";

export default {
  name: "Profile",
  components: {LayoutWithSidebar},
  props: ['id'],

  data() {
    return {
      profile: null
    }
  },

  mounted() {
    this.getProfile()
  },

  methods: {
    getProfile() {
      this.axios.get(this.$store.getters.serverPath + '/api/profile', {
        params: {
          'user_id': this.id
        }
      }).then(response => {
        if (response.status === 200) {
          this.profile = response.data.data
        } else {

        }
      })

    }
  }
}

</script>

<template>
  <LayoutWithSidebar :page="_">
    <main class="font-bold underline">
      <div v-if="id">{{ id }}</div>
    </main>
  </LayoutWithSidebar>
</template>

<style>

</style>
