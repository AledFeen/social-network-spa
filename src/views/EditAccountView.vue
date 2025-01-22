<script>
import LayoutWithSidebar from "/src/layouts/PageWithSidebarLayout.vue"

export default {
  name: 'edit-account',
  components: {LayoutWithSidebar},
  data() {
    return {
      user: null,
      account: null,
      image: null,
    }
  },

  mounted() {
    this.getUser()
    this.getAccount()
  },

  methods: {
    getUser() {
      setTimeout(() => {
        if (!this.user) {
          this.user = this.$store.getters.user
          if (!this.user) {
            this.getUser()
          }
        }
      }, 500);
    },

    getAccount() {
      this.axios.get(this.$store.getters.serverPath + '/api/my-account').then(res => {
        this.account = res.data.data
      }).catch(error => {
      })
    },

    updateAccount() {
      this.axios.put(this.$store.getters.serverPath + '/api/my-account', {
        'real_name': this.account.real_name,
        'location': this.account.location,
        'date_of_birth': this.account.date_of_birth,
        'about_me': this.account.about_me,
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

    handleFileChange() {
      if (this.$refs.fileInput) {
        this.image = this.$refs.fileInput.files[0]
      }
    },

    openLoadImageMenu() {
      this.$refs.fileInput.click();
    },

    updateImage() {
      if(this.image !== null) {
        const formData = new FormData()
        formData.append('image', this.image)
        this.axios.post(this.$store.getters.serverPath + '/api/profile-image', formData).then(res => {
          console.log(res)
          window.location.reload();
          this.$store.dispatch('updateProfileImage', this.account.image);
        }).catch(err => {
          console.log(err)
        })
      }

    },

    deleteImage() {
      this.axios.delete(this.$store.getters.serverPath + '/api/profile-image').then(res => {
        console.log(res)
        window.location.reload();
      }).catch(err => {
        console.log(err)
      })
    }


  }
}
</script>

<template>
  <LayoutWithSidebar :page="'_'">
    <div v-if="account"
         class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <div class="flex flex-col md:flex-row items-center md:items-start">
        <div class="flex flex-col w-1/2 px-5 py-5 items-center">
          <div class="flex flex-col">
            <div @click.prevent="openLoadImageMenu()" class="hover:opacity-75 hover:cursor-pointer">
              <img v-if="account.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                   alt="Круглое изображение"
                   class="w-64 h-64 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + account.image"
                   alt="Круглое изображение"
                   class="w-64 h-64 object-cover rounded-full"/>
            </div>

            <div class="flex flex-row mt-5">
              <div class="hidden">
                <input type="file" class="form-control" id="inputGroupFile" ref="fileInput" @change="handleFileChange">
              </div>
              <input @click.prevent="updateImage()" type="submit" :value="'Зберегти'"
                     class="w-full mb-5 py-3 ps-3 pe-3 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
              <input v-if="account.image !== 'default_avatar'" @click.prevent="deleteImage()"  type="submit" value="Видалити"
                     class="w-full  mb-5 py-3 ps-3 pe-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
            </div>
          </div>
        </div>

        <div class="flex flex-col w-1/2 px-5 py-5">
          Real name
          <input v-model="account.real_name" type="text"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          Date of birth
          <input v-model="account.date_of_birth" type="date"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          Location
          <input v-model="account.location" type="text"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          About_me
          <textarea v-model="account.about_me"
                    class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md"></textarea>
          <input @click.prevent="updateAccount()" type="submit" :value="'Зберегти'"
                 class="w-full mb-5 py-3 ps-3 pe-3 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">

        </div>

      </div>
    </div>
  </LayoutWithSidebar>
</template>
