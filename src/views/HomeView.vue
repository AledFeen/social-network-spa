<script>
  import LayoutWithSidebar from "/src/layouts/PageWithSidebarLayout.vue"
  import PostList from "@/components/PostList.vue";
  export default {
    name: 'Home',
    components: {PostList, LayoutWithSidebar },
    data() {
      return {
        path: this.$store.getters.serverPath,
        selectedPage: 'feed'
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

      selectPage(page) {
        this.selectedPage = page
      }
    }
  }
</script>

<template>
  <LayoutWithSidebar :page="'Home'">
    <div class="w-full md:w-3/4 my-3 md:my-5 mx-3 md:mx-5">
      <div class="flex flex-row items-center w-full">
        <div class="relative flex w-full bg-gray-200 rounded-full overflow-hidden">
          <button @click.prevent="selectPage('feed')" id="btn1" class="w-1/2 py-2 text-center font-medium text-btn_text-light bg-btn_back-primary
             hover:bg-btn_back-primary_hover hover:cursor-pointer" :class="{'underline underline-offset-4': selectedPage === 'feed'}">Для мене</button>
          <button @click.prevent="selectPage('recommendations')" id="btn2" class="w-1/2 py-2 text-center font-medium text-btn_text-dark
             bg-btn_back-secondary hover:bg-btn_back-secondary_hover" :class="{'underline underline-offset-4': selectedPage !== 'feed'}">Рекомендації</button>
        </div>
      </div>

      <div class="block w-full mx-1 my-4 md:my-8 rounded-lg shadow-lg border border-gray-a9 border-solid">
        <template v-if="selectedPage === 'feed'">
          <PostList :id="this.id" :page="'feed'" :isOwner="false"/>
        </template>
        <template v-else>
          <PostList :id="this.id" :page="'recommendations'" :isOwner="false"/>
        </template>
      </div>

    </div>





  </LayoutWithSidebar>
</template>
