<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import ModalMessage from "@/components/ModalMessage.vue";

export default {
  name: 'SubRequests',
  components: {LayoutWithSidebar, ModalMessage},

  data() {
    return {
      path: this.$store.getters.serverPath,
      users: null,
      lastPage: 1,
      page_id: 0,
      isModalVisible: false,
      modalMessage: null
    }
  },

  mounted() {
    this.getSubRequests()
  },

  methods: {
    getSubRequests() {
      this.axios.get(this.$store.getters.serverPath + '/api/subscription-requests', {
        params: {
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.users = response.data.data
            } else {
              this.users.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    accept(id) {
      this.axios.post(this.$store.getters.serverPath + '/api/accept-request', {
        'id': id,
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.page_id -= 1
          this.users = null
          this.getSubRequests()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(err => {
        console.log(err)
      })
    },

    decline(id) {
      this.axios.delete(this.$store.getters.serverPath + '/api/decline-request', {
        params: {
          'id': id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.page_id -= 1
          this.users = null
          this.getSubRequests()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(err => {
        console.log(err)
      })
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
  <LayoutWithSidebar :page="''">

    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>

    <div v-if="users && users.length > 0"
         class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">

      <template v-if="users" v-for="obj in users">
        <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark mb-1">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col justify-center items-center py-2 ms-10">
              <img v-if="obj.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                   alt="Круглое изображение"
                   class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + obj.user.image"
                   alt="Круглое изображение"
                   class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
            </div>

            <div
              class="flex flex-col justify-center items-center py-3 text-primary_text-light dark:text-primary_text-dark">
              {{ obj.user.name }}
            </div>
            <router-link :to="`/profile/${obj.user.name}`"
                         class="w-20 me-5 mx-2 my-4 py-1 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
              <div>{{ $t('look-btn') }}</div>
            </router-link>
            <div>
              <input @click.prevent="accept(obj.id)" type="submit" :value="$t('accept-btn')"
                     class="w-20 me-5 mx-2 my-4 py-1 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
              <input @click.prevent="decline(obj.id)" type="submit"  :value="$t('decline-btn')" class="w-20 mx-2 my-4 py-1 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">
            </div>

          </div>
        </div>
      </template>

      <div v-if="this.lastPage >= this.page_id + 1" @click.prevent="getSubRequests"
           class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
        {{$t('download-btn') }}
      </div>

    </div>
    <div v-if="users && users.length < 1">
      <div
        class="h-screen flex flex-col justify-center items-center text-primary_text-light dark:text-primary_text-dark">
        {{$t('nothing-found') }}
      </div>
    </div>

  </LayoutWithSidebar>
</template>
