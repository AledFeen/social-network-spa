<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import ModalMessage from "@/components/ModalMessage.vue";

export default {
  name: 'Notifications',
  components: {LayoutWithSidebar},

  data() {
    return {
      requestCount: null
    }
  },

  mounted() {
    this.getSubRequestsCount()
  },

  methods: {
    getSubRequestsCount() {
      this.axios.get(this.$store.getters.serverPath + '/api/subscription-requests-count')
        .then(response => {
            this.requestCount = response.data.requestCount
            console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },

  }
}
</script>

<template>
  <LayoutWithSidebar :page="'Notifications'">

    <div class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">
      <div v-if="requestCount !== null" class="w-full">
        <div v-if="requestCount" class="flex flex-row justify-around mx-3">
          <div class="mt-2 text-primary_text-light dark:text-primary_text-dark">{{ $t('count-request-message') }} {{requestCount}}</div>
          <router-link to="/sub-requests" class="py-2 px-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md"> {{ $t('look-btn') }}
          </router-link>
        </div>
        <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-request-message') }}</div>
      </div>

    </div>

  </LayoutWithSidebar>
</template>
