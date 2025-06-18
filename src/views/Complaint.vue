<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import dayjs from "dayjs";
import ModalMessage from "@/components/ModalMessage.vue";

export default {
  name: 'Complaint',
  components: {ModalMessage, LayoutWithSidebar},
  props: ['id'],

  beforeMount() {
    this.getComplaint()
  },

  data() {
    return {
      complaint: null,
      message: null,
      comment: null,
      profile: null,
      measure_status: '',
      measure: '',
      isModalVisible: false,
      modalMessage: null,
    }
  },

  methods: {
    getComplaint() {
      this.axios.get(this.$store.getters.serverPath + '/api/complaint', {
        params: {
          'complaint_id': this.id,
        }
      })
        .then(response => {
          this.complaint = response.data.data
          this.check()
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },

    check() {
      if (this.complaint.comment_id) {
        this.getComment()
      } else if (this.complaint.message_id) {
        this.getMessage()
      } else if (this.complaint.post_id) { } else {
        this.getProfile()
      }
    },

    getComment() {
      this.axios.get(this.$store.getters.serverPath + '/api/comment-admin', {
        params: {
          'comment_id': this.complaint.comment_id,
        }
      })
        .then(response => {
          this.comment = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getMessage() {
      this.axios.get(this.$store.getters.serverPath + '/api/message-admin', {
        params: {
          'message_id': this.complaint.message_id,
        }
      })
        .then(response => {
          this.message = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getProfile() {
      this.axios.get(this.$store.getters.serverPath + '/api/profile-admin', {
        params: {
          'user_id': this.complaint.user_id,
        }
      })
        .then(response => {
          this.profile = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    downloadFile(file) {
      this.axios.get(this.$store.getters.serverPath + '/api/message-file/' + file.filename, {
        responseType: 'blob'
      })
        .then(response => {
          const blob = new Blob([response.data]);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = file.name || file.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          alert("File loading error:" + err);
        });
    },

    updateComplaint() {
      this.axios.put(this.$store.getters.serverPath + '/api/complaint', {
        'complaint_id': this.complaint.id,
        'measure_status': this.measure_status,
        'measure': this.measure
      }).then(res => {
        if(res.data.success) {
          this.measure = ''
          this.measure_status = ''
          this.showModal()
          this.getComplaint()
        } else {
          console.log(res)
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    blockUser() {
      this.axios.post(this.$store.getters.serverPath + '/api/ban', {
        'user_id': this.complaint.user_id
      }).then(res => {
        if(res.data.success) {
          this.showModal()
        } else {
          console.log(res)
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    deleteContent() {
      if (this.complaint.comment_id) {
        this.deleteComment()
      } else if (this.complaint.message_id) {
        this.deleteMessage()
      } else if(this.complaint.post_id) {
        this.deletePost()
      } else {
        this.deleteProfile()
      }
    },

    deleteComment() {
      this.axios.delete(this.$store.getters.serverPath + '/api/comment', {
        params: {
          'comment_id': this.comment.id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal()
          this.comment = null
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    deleteMessage() {
      this.axios.delete(this.$store.getters.serverPath + '/api/message', {
        params: {
          'message_id': this.message.id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal()
          this.message = null
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    deleteProfile() {
      this.deleteImage()
      this.updateAccount()
    },

    deleteImage() {
      this.axios.delete(this.$store.getters.serverPath + '/api/profile-image-admin', {
        params: {
          'user_id': this.complaint.user_id
        }
      }).then(res => {
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

    updateAccount() {
      this.axios.put(this.$store.getters.serverPath + '/api/my-account', {
        'user_id': this.complaint.user_id
      }).then(res => {
        console.log(res)
        if(res.data.success === 'true') {
          this.showModal(this.$t('success-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    deletePost() {
      this.axios.delete(this.$store.getters.serverPath + '/api/post', {
        params: {
          'post_id': this.complaint.post_id
        }
      }).then(res => {
        if (res.data.success) {
         this.showModal()
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    showModal() {
      this.modalMessage = this.$t('success-request');
      this.isModalVisible = true;

      setTimeout(() => {
        this.isModalVisible = false;
      }, 500);
    },

  },

}
</script>

<template>
  <LayoutWithSidebar :page="'Admin'">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>
    <div class="flex flex-col w-1/2">
      <div class="overflow-x-auto mt-3">
        <table v-if="complaint" class="min-w-full border border-gray-300 rounded-lg shadow-sm">
          <tbody>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium ">ID</td>
            <td class="px-4 py-2">{{ complaint.id }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Sender ID</td>
            <td class="px-4 py-2">{{ complaint.sender_id }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">User ID</td>
            <td class="px-4 py-2">{{ complaint.user_id ?? '—' }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Post ID</td>
            <td class="px-4 py-2 " :class="{'hover:cursor-pointer hover:underline': complaint.post_id}">
              <router-link :to="'/post/' + complaint.post_id">{{ complaint.post_id ?? '—' }}</router-link>
            </td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Comment ID</td>
            <td class="px-4 py-2">{{ complaint.comment_id ?? '—' }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Message ID</td>
            <td class="px-4 py-2">{{ complaint.message_id ?? '—' }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium t">Text</td>
            <td class="px-4 py-2">{{ complaint.text }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Status</td>
            <td class="px-4 py-2">{{ complaint.status }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Created At</td>
            <td class="px-4 py-2">{{ formatDate(complaint.created_at) }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Updated At</td>
            <td class="px-4 py-2">{{ formatDate(complaint.updated_at) }}</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 font-medium">Measure</td>
            <td class="px-4 py-2">{{ complaint.measure ?? '—' }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Measure Status</td>
            <td class="px-4 py-2">{{ complaint.measure_status ?? '—' }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="message" class="flex flex-col"> <!-- Message -->
        <div class="text-primary_text-light dark:text-primary_text-dark">{{ message.text }}</div>

        <div v-for="(file, index) in message.files" :key="index">
          <div v-if="file.type === 'photo'">
            <img :src="$store.getters.serverPath + '/api/message-image/' + file.filename"
                 :alt="'Media ' + (index + 1)"
                 class="w-full h-full object-cover rounded-lg">
          </div>

          <div v-else-if="file.type === 'video'">
            <video :src="$store.getters.serverPath + '/api/message-video/' + file.filename" controls
                   class="w-full h-full object-cover rounded-lg"></video>
          </div>

          <div v-else-if="file.type === 'audio'" class="flex flex-col items-center w-64 text-white mt-1">
            <audio :src="$store.getters.serverPath + '/api/message-audio/' + file.filename" controls
                   class="w-full"></audio>
            <span class="text-xs truncate text-secondary_text-light dark:text-secondary_text-dark">{{
                file.name
              }}</span>
          </div>

          <div v-else class="text-lg text-white flex flex-row items-center cursor-pointer hover:opacity-75"
               @click.prevent="downloadFile(file)">
            🗂️ <span class="text-xs truncate text-secondary_text-light dark:text-secondary_text-dark">{{
              file.name
            }}</span>
          </div>

        </div>
      </div> <!-- Message -->


      <div v-if="comment" class="flex flex-row justify-between items-center mx-3 my-3"> <!-- Comment -->
        <div class="flex flex-row w-full">
          <div class="items-center flex flex-col">
            <router-link :to="'/profile/' + comment.user.name">
              <img v-if="comment.user.image === 'default_avatar'" src="/src/assets/default_avatar.png"
                   alt="Круглое изображение"
                   class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + comment.user.image"
                   alt="Круглое изображение"
                   class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
            </router-link>
            <div v-if="comment.lastPage" class="mt-2 mb-2 block w-px h-full bg-gray-a9 "></div>
          </div>

          <div class="flex flex-col justify-start w-full"> <!-- Content col -->
            <div class="flex flex-row items-center justify-between">

              <div class="flex flex-row">
                <router-link :to="'/profile/' + comment.user.name" class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark
                      break-words hover:underline hover:cursor-pointer">
                  {{ comment.user.name }}
                </router-link>
                <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">
                  {{ formatDate(comment.updated_at) }}
                </div>
              </div>
            </div>

            <template v-if="comment.files.length > 0"><!-- Media row -->
              <div class="ms-5 flex flex-wrap justify-start gap-1 items-center">
                <div v-for="(file, index) in comment.files" :key="index"
                     class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': comment.files.length > 1}">
                  <div class="relative w-full h-20 md:h-28" :class="{' h-12 md:h-16' : comment.files.length > 1 }">
                    <img :src="$store.getters.serverPath + '/api/comment-image/' + file.filename"
                         :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
                  </div>
                </div>
              </div>
            </template><!-- Media row -->

            <div class="ms-5 mt-3 mb-1 text-primary_text-light dark:text-primary_text-dark break-words">{{
                comment.text
              }}
            </div>
          </div>
        </div>
      </div> <!-- Comment -->

      <div v-if="profile" class="flex flex-row"> <!-- Profile -->
        <div class="w-1/3 flex flex-col justify-center items-center py-3">
          <img v-if="profile.image === 'default_avatar'" src="/src/assets/default_avatar.png"
               alt="Круглое изображение"
               class="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"/>
          <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + profile.image"
               alt="Круглое изображение"
               class="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"/>
        </div>
        <div class="w-1/3 flex flex-col py-3 px-1 justify-center">
          <div v-if="profile.name"
               class="mt-2 mb-1 font-semibold text-primary_text-light dark:text-primary_text-dark break-words">
           <router-link :to="'/profile/' + profile.name">{{ profile.name }}</router-link>
          </div>
          <div v-if="profile.realName"
               class="my-1 text-primary_text-light dark:text-primary_text-dark break-words">{{ profile.realName }}
          </div>
          <div v-if="profile.birthday"
               class="my-1 text-secondary_text-light dark:text-secondary_text-dark break-words">
            {{ profile.birthday }}
          </div>
          <div v-if="profile.location"
               class="my-1 italic text-secondary_text-light dark:text-secondary_text-dark break-words">
            {{ profile.location }}
          </div>

        </div>
      </div><!-- Profile -->

      <textarea v-model="measure" :placeholder="$t('complain-placeholder')" class="mb-1 py-3 ps-3 pe-3 h-12 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"></textarea>

      <div class="flex flex-row justify-around mb-5"> <!-- Update panel -->
        <div class="flex flex-row items-center  justify-center"> <!-- measure_status -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{
                $t('measure-status-text')
              }}
            </div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Measure status</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="measure_status">
                <option value="" class="hover:cursor-pointer hover:opacity-75">{{ $t('nothing-option') }}</option>
                <option value="accepted" class="hover:cursor-pointer hover:opacity-75">{{ $t('accepted-option') }}
                </option>
                <option value="rejected" class="hover:cursor-pointer hover:opacity-75">{{ $t('rejected-option') }}
                </option>
              </select>
            </div>
          </div>
        </div> <!-- measure_status -->

        <input @click.prevent="updateComplaint()" type="submit" :value="$t('save-btn')" class="mt-7 me-3 px-2 py-1 text-btn_text-light bg-btn_back-primary
        rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">

        <input @click.prevent="deleteContent()" type="submit" :value="$t('delete-btn')" class="mt-7 me-3 px-2 py-1 text-btn_text-dark bg-btn_back-secondary
        rounded-2xl hover:bg-btn_back-secondary_hover hover:cursor-pointer drop-shadow-md">

        <input @click.prevent="blockUser()" type="submit" :value="$t('block-btn')" class="mt-7 me-3 px-2 py-1 text-btn_text-light bg-red-500
        rounded-2xl hover:bg-red-600 hover:cursor-pointer drop-shadow-md">
      </div><!-- Update panel -->
    </div>

  </LayoutWithSidebar>
</template>
