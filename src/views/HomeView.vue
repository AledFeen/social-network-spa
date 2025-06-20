<script>
  import LayoutWithSidebar from "/src/layouts/PageWithSidebarLayout.vue"
  import PostList from "@/components/PostList.vue";
  import ModalMessage from "@/components/ModalMessage.vue";
  export default {
    name: 'Home',
    components: {ModalMessage, PostList, LayoutWithSidebar },
    data() {
      return {
        path: this.$store.getters.serverPath,
        selectedPage: 'feed',
        isModalVisible: false,
        modalMessage: null,
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
      },

      complaintSent(isSuccess) {
        if (isSuccess) {
          this.showModal(this.$t('success-request'))
        } else {
          this.showModal(this.$t('failed-request'))
        }
      },

      showModal(message) {
        this.modalMessage = message;
        this.isModalVisible = true;

        setTimeout(() => {
          this.isModalVisible = false;
        }, 500);
      },

    }
  }
</script>

<template>
  <LayoutWithSidebar :page="'Home'">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>

    <div class="w-full md:w-3/4 my-3 md:my-5 mx-3 md:mx-5">
      <div class="flex flex-row items-center w-full">
        <div class="relative flex w-full bg-gray-200 rounded-full overflow-hidden">
          <button @click.prevent="selectPage('feed')" id="btn1" class="w-1/2 py-2 text-center font-medium text-btn_text-light bg-btn_back-primary
             hover:bg-btn_back-primary_hover hover:cursor-pointer" :class="{'underline underline-offset-4': selectedPage === 'feed'}">
            {{ $t('for-me') }}</button>
          <button @click.prevent="selectPage('recommendations')" id="btn2" class="w-1/2 py-2 text-center font-medium text-btn_text-dark
             bg-btn_back-secondary hover:bg-btn_back-secondary_hover" :class="{'underline underline-offset-4': selectedPage !== 'feed'}">
            {{ $t('recommendations') }}</button>
        </div>
      </div>

      <div class="block w-full my-4 md:my-8 rounded-lg shadow-lg border border-gray-a9 border-solid">
        <template v-if="selectedPage === 'feed'">
          <PostList :page="'feed'" :isOwner="false" @complaint-sent="complaintSent"/>
        </template>
        <template v-else>
          <PostList :page="'recommendations'" :isOwner="false" @complaint-sent="complaintSent"/>
        </template>
      </div>

    </div>

  </LayoutWithSidebar>
</template>
