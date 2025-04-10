<script>
import LayoutWithSidebar from "/src/layouts/PageWithSidebarLayout.vue"
import ModalMessage from "/src/components/ModalMessage.vue";
import {data} from "autoprefixer";

export default {
  name: 'edit-account',
  components: {LayoutWithSidebar, ModalMessage},
  data() {
    return {
      user: null,
      account: null,
      image: null,
      imageUrl: null,
      isModalVisible: false,
      modalMessage: null
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
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
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
        if(res.data.success === true) {
          this.showModal(this.$t('success-request'))
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    handleFileChange() {
      if (this.$refs.fileInput) {
        this.image = this.$refs.fileInput.files[0]
        this.imageUrl = URL.createObjectURL(this.image);
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
        }).catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
      }
    },

    deleteImage() {
      this.axios.delete(this.$store.getters.serverPath + '/api/profile-image').then(res => {
        console.log(res)
        window.location.reload();
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    reloadImage() {
      this.image = null
      this.imageUrl = null
    },

    showModal(message) {
      this.modalMessage = message;
      this.isModalVisible = true;

      setTimeout(() => {
        this.isModalVisible = false;
      }, 1000);
    },
  }
}
</script>

<template>
  <LayoutWithSidebar :page="'_'">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage" />
    </template>
    <div v-if="account"
         class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <div class="flex flex-col md:flex-row items-center md:items-start">
        <div class="flex flex-col w-1/2 px-5 py-5 items-center">
          <div class="flex flex-col">

            <div v-if="!image" @click.prevent="openLoadImageMenu()" class="hover:opacity-75 hover:cursor-pointer">
              <img v-if="account.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                   alt="Круглое изображение"
                   class="w-64 h-64 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + account.image"
                   alt="Круглое изображение"
                   class="w-64 h-64 object-cover rounded-full"/>
            </div>
            <div v-else @click.prevent="openLoadImageMenu()" class="hover:opacity-75 hover:cursor-pointer">
              <img :src="imageUrl"
                   alt="Круглое изображение"
                   class="w-64 h-64 object-cover rounded-full"/>
            </div>

            <div class="flex flex-row mt-5">
              <div class="hidden">
                <input type="file" class="form-control" id="inputGroupFile" ref="fileInput" @change="handleFileChange">
              </div>
              <input @click.prevent="updateImage()" id="updateImageBtn" type="submit" :value="$t('save-btn')"
                     class="w-full mx-2 mb-5 py-3 ps-3 pe-3 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
              <input v-if="account.image !== 'default_avatar' && !image" @click.prevent="deleteImage()" id="deleteImageBtn" type="submit" :value="$t('delete-btn')"
                     class="w-full mx-2 mb-5 py-3 ps-3 pe-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
              <input v-if="image" @click.prevent="reloadImage()"  type="submit" :value="$t('reset-btn')"
                     class="w-full mx-2 mb-5 py-3 ps-3 pe-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
            </div>
          </div>
        </div>

        <div class="flex flex-col w-1/2 px-5 py-5">
          <div class="text-secondary_text-light dark:text-secondary_text-dark mb-1">{{$t('profile-real-name')}}</div>
          <input v-model="account.real_name" type="text" id="real_name"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          <div class="text-secondary_text-light dark:text-secondary_text-dark mb-1">{{$t('profile-date')}}</div>
          <input v-model="account.date_of_birth" type="date" id="date"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          <div class="text-secondary_text-light dark:text-secondary_text-dark mb-1">{{$t('profile-location')}}</div>
          <input v-model="account.location" type="text" id="location"
                 class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">
          <div class="text-secondary_text-light dark:text-secondary_text-dark mb-1">{{$t('profile-about')}}</div>
          <textarea v-model="account.about_me" id="about_me"
                    class="mb-5 py-3 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md"></textarea>
          <input @click.prevent="updateAccount()" type="submit" :value="$t('save-btn')" id="updateAccountBtn"
                 class="w-full mb-5 py-3 ps-3 pe-3 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
        </div>

      </div>
    </div>
  </LayoutWithSidebar>
</template>
