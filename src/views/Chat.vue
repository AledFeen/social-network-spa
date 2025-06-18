<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import dayjs from "dayjs";
import EmojiPanel from "@/components/EmojiPanel.vue";
import ModalComplaint from "@/components/ModalComplaint.vue";

export default {
  name: 'Chat',
  components: {ModalComplaint, EmojiPanel, LayoutWithSidebar},
  props: ['id'],

  data() {
    return {
      observer: null,
      channel: null,
      chatId: null,
      theme: localStorage.getItem('theme'),
      messages: [],
      users: [],
      lastPage: 1,
      page_id: 0,
      link_id: null,
      isEmojiPanelOpen: false,
      postText: "",
      files: [],
      urls: [],
      allowedTypes: [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'application/pdf', 'text/plain',
        'application/json', 'application/xml', 'text/xml', 'application/zip', 'application/x-zip-compressed'
      ],
      selectedIndex: null,
      companion: null,
      selectedMessage: null,
      editMessage: false,
      editedMessage: "",
      selectedMessageId: null,
      modalComplaint: false
    }
  },

  beforeMount() {
    if (/^n_\d+$/.test(this.id)) {
      this.chatId = this.id.slice(2)
      this.createChat()
    } else {
      this.chatId = this.id
      this.readMessages()
    }
  },

  beforeUnmount() {
    if (this.channel ) {
      this.channel.stopListening('.message')
      this.channel.stopListening('.deleted_message')
      this.channel.stopListening('.edited_message')
      this.channel.stopListening('.read_message')
      this.channel.stopListening('.read_messages')
      window.Echo.leave(`chat.${this.id}`)
    }
  },

  computed: {
    srcEmoji() {
      return this.theme === 'light' ? '/src/assets/emoji-light.svg' : '/src/assets/emoji-dark.svg'
    },
    srcImage() {
      return this.theme === 'light' ? '/src/assets/image-light.svg' : '/src/assets/image-dark.svg'
    },
    srcSend() {
      return this.theme === 'light' ? '/src/assets/send.svg' : '/src/assets/send-dark.svg'
    },
    srcOptions() {
      return this.theme === 'light' ? '/src/assets/options.svg' : '/src/assets/options-dark.svg'
    },
  },

  methods: {
    connectChannel() {
      if (!this.channel) {
        this.channel = window.Echo.private('chat.' + this.chatId)
          .listen('.message', (res) => {
            this.messages.unshift(res.data.message)
            this.observeMessages()
          })
          .listen('.deleted_message', (res) => {
            const index = this.messages.findIndex(msg => msg.id === Number(res.data.deleted_message))
            if (index !== -1) {
              this.messages.splice(index, 1);
              this.observeMessages()
            }
          })
          .listen('.edited_message', (res) => {
            const index = this.messages.findIndex(msg => msg.id === Number(res.edited_message.id))
            this.messages[index].text = res.edited_message.text
          })
          .listen('.read_message', (res) => {
            console.log(res)
            const index = this.messages.findIndex(msg => msg.id === Number(res.data.read_message))
            this.messages[index].is_read = true
          })
          .listen('.read_messages', (res) => {
            console.log(res)
            this.messages.forEach(msg => {
              if (msg.link_id === this.link_id && this.link_id !== Number(res.data.link_messages)) {
                msg.is_read = true
              }
            })
          })
      }
    },

    createChat() {
      this.axios.post(this.$store.getters.serverPath + '/api/chat', {
        'user_id': this.chatId
      }).then(res => {
        if (res.data.success) {
          this.getChatId()
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        }
      )
    },

    getChatId() {
      this.axios.get(this.$store.getters.serverPath + '/api/chatId', {
        params: {
          'user_id': this.chatId,
        }
      })
        .then(response => {
          this.chatId = response.data.data.id
          this.readMessages()
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getLinkIdCurrentUser() {
      this.axios.get(this.$store.getters.serverPath + '/api/user').then(res => {
        let usr = res.data.data
        for (const user of this.users) {
          if (user.user.id === usr.id) {
            this.link_id = user.id
            this.getMessages()
          } else {
            this.companion = user
          }
        }
      })
    },

    readMessages() {
      this.axios.put(this.$store.getters.serverPath + '/api/messages-read', {
        'chat_id': this.chatId
      }).then(res => {
        if (res.data.success) {
          this.getUsers()
          this.connectChannel()
        }
      }).catch(async err => {
        console.log(err)
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        }
      )
    },

    getUsers() {
      this.axios.get(this.$store.getters.serverPath + '/api/chat-users', {
        params: {
          'chat_id': this.chatId,
        }
      })
        .then(response => {
          this.users = response.data.data
          this.getLinkIdCurrentUser()
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getMessages() {
      this.axios.get(this.$store.getters.serverPath + '/api/messages', {
        params: {
          'chat_id': this.chatId,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.messages) {
              this.messages = response.data.data
            } else {
              this.messages.push(...response.data.data)
            }
            this.observeMessages()
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    observeMessages() {
      this.stopObserving();
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const messageId = Number(entry.target.dataset.messageId);
              const message = this.messages.find(msg => msg.id === messageId);
              if(message && !message.is_read && message.link_id !== this.link_id) {
                console.log('MessageId:', messageId);
                console.log('Message:', message);
                this.readMessage(message)
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      this.$nextTick(() => {
        document.querySelectorAll('.message').forEach(el => {
          this.observer.observe(el);
        });
      });
    },

    stopObserving() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },

    readMessage(message) {
      this.axios.put(this.$store.getters.serverPath + '/api/message-read', {
        'message_id': message.id
      }).then(res => {
        if (res.data.success) {
          message.is_read = true
        }
      }).catch(async err => {
          console.log(err)
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        }
      )
    },

    formatDate(date) {
      const formattedDate = dayjs(date);
      const today = dayjs().startOf("day");

      if (formattedDate.isSame(today, "day")) {
        return formattedDate.format("HH:mm");
      }

      return formattedDate.format("DD.MM.YYYY HH:mm");
    },

    openEmojiPanel() {
      this.isEmojiPanelOpen = !this.isEmojiPanelOpen
      this.isTagPanelOpen = false
      this.isLocationPanelOpen = false
    },

    addEmoji(emoji) {
      this.postText += emoji
    },

    openLoadFileMenu() {
      this.$refs.fileInput.click();
    },

    handleFileChange() {
      if (this.$refs.fileInput) {
        if (this.urls.length < 10) {
          let file = this.$refs.fileInput.files[0];
          if (!file) return;

          console.log('MIME-тип файла:', file.type);

          if (file.size >= 25 * 1024 * 1024) {
            alert(this.$t('big-file-message'));
            return;
          }

          if (!this.allowedTypes.includes(file.type)) {
            alert(this.$t('uncorrected-format-message'));
            return;
          }

          let fileType = this.getFileType(file);
          this.files.push(file);

          let url = URL.createObjectURL(file);
          this.urls.push({url, type: fileType, name: file.name});
        } else {
          alert(this.$t('file-limit-message'));
        }
      }
    },

    getFileType(file) {
      const type = file.type;

      if (type.startsWith('image')) return 'image';
      if (type.startsWith('video')) return 'video';
      if (type.startsWith('audio')) return 'audio';
      if (type === 'application/pdf') return 'document';
      if (type === 'text/plain') return 'document';
      if (['application/json', 'application/xml', 'text/xml'].includes(type)) return 'document';
      if (['application/zip', 'application/x-zip-compressed'].includes(type)) return 'document';

      return 'other';
    },

    toggleSelection(index) {
      if (this.selectedIndex === index) {
        this.selectedIndex = null;
      } else {
        this.selectedIndex = index;
      }
    },

    deleteFile(index) {
      this.urls.splice(index, 1)
      this.files.splice(index, 1)
      this.selectedIndex = null;
    },

    sendMessage() {

      const formData = new FormData()

      formData.append('text', this.postText)
      formData.append('chat_id', this.chatId)
      this.files.forEach(file => {
        formData.append('files[]', file);
      });

      this.axios.post(this.$store.getters.serverPath + '/api/message', formData).then(res => {
        //console.log(res)
        this.postText = ''
        this.files = []
        this.urls = []
        this.tags = []
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        console.log(err)
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

    srcCheck(was_read) {
      if (!was_read) {
        return this.theme === 'light' ? '/src/assets/check.svg' : '/src/assets/check-dark.svg'
      } else return '/src/assets/check-read.svg'
    },

    selectMessage(msg) {
      this.selectedMessage = this.selectedMessage === msg ? null : msg
    },

    deleteMessage(msg) {
      this.axios.delete(this.$store.getters.serverPath + '/api/message', {
        params: {
          'message_id': msg.id
        }
      }).then(res => {
        if (res.data.success) {
          this.messages.splice(this.messages.indexOf(msg), 1)
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    changeEditMessage(msgText) {
      this.editMessage = !this.editMessage
      this.editedMessage = msgText
    },

    updateMessage() {

      this.axios.put(this.$store.getters.serverPath + '/api/message', {
        'message_id': this.selectedMessage.id,
        'text': this.editedMessage,
      }).then(res => {
        if (res.data.success) {
          let messageNumber = this.messages.indexOf(this.selectedMessage)
          this.messages[messageNumber].text = this.editedMessage
          this.selectedMessage = null
          this.editMessage = false
          this.editedMessage = ""
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        }
      )

    },

    CheckSendComplaint() {
      this.modalComplaint = false
    },

    complain(id) {
      this.selectedMessageId = id
      this.modalComplaint = !this.modalComplaint
    },

  }
}
</script>

<template>
  <LayoutWithSidebar :page="''">
    <template v-if="modalComplaint">
      <ModalComplaint :id="selectedMessageId" :user_id="companion.user.id" :type="'message'" @complaint-sent="CheckSendComplaint"></ModalComplaint>
    </template>

    <div class="hidden">
      <input type="file" class="form-control" id="inputGroupFile" ref="fileInput" @change="handleFileChange">
    </div>
    <div class="flex flex-col w-full mx-1 md:w-2/4 my-4" :style="{ height: 'calc(100vh - 7rem)' }">
      <router-link :to="'/profile/' + companion.user.name" v-if="companion"
                   class="flex flex-row items-center justify-center rounded-full mb-3 border border-gray-a9 border-solid hover:opacity-75 cursor-pointer">
        <div class="flex flex-col justify-center items-center py-1">
          <img v-if="companion.user.image === 'default_avatar'" src="/src/assets/default_avatar.png"
               alt="Круглое изображение"
               class="w-10 h-10 object-cover rounded-full"/>
          <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + companion.user.image"
               alt="Круглое изображение"
               class="w-10 h-10 object-cover rounded-full"/>
        </div>
        <div class="ms-4 flex flex-row justify-center items-center py-3">
          <div class="text-primary_text-light dark:text-primary_text-dark font-bold">{{ companion.user.name }}</div>
        </div>
      </router-link>

      <div class="h-full rounded-lg shadow-lg border border-gray-a9 border-solid pt-3 pb-16 relative flex flex-col">
        <!-- Контейнер сообщений -->
        <div class="flex flex-col items-center space-y-2 p-3 flex-grow overflow-hidden">
          <div class="w-full overflow-y-auto flex flex-col-reverse p-2 rounded-2xl flex-grow">

            <div v-for="msg in messages" :key="msg.id" :data-message-id="msg.id" class="message flex flex-row text-white px-4 py-2 rounded-lg w-full"
                 :class="{'justify-end' : msg.link_id === link_id}">
              <div
                class="px-3 py-1 rounded bg-secondary_back-light dark:bg-secondary_back-dark flex flex-col max-w-72 lg:max-w-96"
                :class="{'bg-opacity-50' : msg.link_id !== link_id}">

                <div v-for="(file, index) in msg.files" :key="index">
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

                <div v-if="editMessage && selectedMessage.id === msg.id" class="flex flex-col">
                  <textarea v-model="editedMessage" id="edited-textarea"
                            class="w-64 bg-transparent text-primary_text-light dark:text-primary_text-dark"></textarea>
                  <div @click.prevent="updateMessage()" type="submit"
                       class="w-1/3 mt-1 text-btn_text-light bg-btn_back-primary rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md text-center">
                    {{ $t('save-btn') }}
                  </div>

                </div>
                <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ msg.text }}</div>


                <div class="flex flex-row" :class="{'justify-end' : msg.link_id === link_id}">
                  <img :src="srcOptions" :alt="'Options ' + msg.text" :id="'msg' + msg.id"
                       @click.prevent="selectMessage(msg)" class="w-8 h-8 md:block image-class rounded
                    hover:opacity-75 hover:cursor-pointer hover:scale-110"/>
                  <img v-if="msg.link_id === link_id" :src="srcCheck(msg.is_read)" alt="Tag"
                       class="image-class rounded"/>
                  <div class="my-1 italic text-secondary_text-light dark:text-secondary_text-dark text-sm break-words">
                    <div v-if="msg.created_at === msg.updated_at">
                      {{ this.formatDate(msg.created_at) }}
                    </div>
                    <div v-else class="flex flex-col">
                      <div> {{ this.formatDate(msg.created_at) }}</div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedMessage && selectedMessage.id === msg.id" class="flex flex-row justify-between">
                  <template v-if="msg.link_id === link_id">
                    <div @click.prevent="deleteMessage(msg)"
                         class="text-btn_back-primary hover:underline hover:cursor-pointer">{{ $t('delete-btn') }}
                    </div>
                    <div @click.prevent="changeEditMessage(msg.text)"
                         class="text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
                      {{ $t('edit-btn') }}
                    </div>
                  </template>
                  <template v-else>
                    <div @click.prevent="complain(msg.id)"
                         class="text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
                      {{ $t('complaint-btn') }}
                    </div>
                  </template>
                </div>

              </div>
            </div>
            <div v-if="messages.length > 0 && this.lastPage >= this.page_id + 1" @click.prevent="getMessages()"
                 class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
              {{ $t('download-btn') }}
            </div>
          </div>
        </div>

        <!-- Фиксированный блок -->
        <div class="absolute bottom-0 left-0 w-full rounded shadow-md p-1 border border-gray-a9 border-solid">
          <div class="flex flex-row items-center">
            <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
              <img @click.prevent="openLoadFileMenu()" :src="srcImage" alt="Image"
                   class="image-class rounded ms-2"/>
            </div>

            <div @click.prevent="openEmojiPanel()"
                 class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
              <img :src="srcEmoji" alt="Emoji"
                   class="image-class rounded ms-2 me-4"/>
            </div>

            <div v-if="isEmojiPanelOpen && urls.length <= 0" class="relative">
              <emoji-panel @emoji-selected="addEmoji"></emoji-panel>
            </div>

            <textarea v-model="postText" :placeholder="$t('post-placeholder')" maxlength="1024" class="w-full mt-3 mb-1 ps-3 pe-3 h-8 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
            bg-transparent placeholder-gray-a9 focus:outline-none resize-none"></textarea>

            <div @click.prevent="sendMessage()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
              <img :src="srcSend" alt="Send"
                   class="image-class rounded ms-2 me-4"/>
            </div>

          </div>

        </div>
      </div>
    </div>

    <div v-if="urls.length > 0" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-20">
      <div class="bg-secondary_back-light dark:bg-secondary_back-dark p-6 rounded-lg shadow-lg text-center max-w-lg w-full">
        <!-- Устанавливаем фиксированную высоту контейнера с прокруткой -->
        <div class="w-full p-2 flex flex-col max-h-[70vh] overflow-y-auto">
          <div v-for="(file, index) in urls" :key="index" class="w-full p-2 flex flex-row justify-center relative" @click="toggleSelection(index)">
            <div class="relative" :class="{'bg-gray-700 opacity-75': selectedIndex === index}">
              <!-- Изображения -->
              <div v-if="file.type === 'image'">
                <img :src="file.url" :alt="'Media ' + (index + 1)" class="w-full max-h-64 object-cover rounded-lg">
              </div>

              <!-- Видео -->
              <div v-else-if="file.type === 'video'">
                <video :src="file.url" controls class="w-full max-h-64 object-cover rounded-lg"></video>
              </div>

              <!-- Аудио -->
              <div v-else-if="file.type === 'audio'" class="flex flex-col items-center w-64 text-white">
                🎵
                <audio :src="file.url" controls class="w-full"></audio>
                <span class="text-xs truncate">{{ file.name }}</span>
              </div>

              <!-- Другие файлы -->
              <div v-else class="text-lg text-white flex flex-col items-center">
                📁 FILE <span class="text-xs truncate">{{ file.name }}</span>
              </div>

              <!-- Кнопка удаления -->
              <div v-if="selectedIndex === index" class="absolute inset-0 flex justify-center items-center rounded-lg bg-black bg-opacity-25">
                <button @click.stop="deleteFile(index)" class="text-btn_text-light bg-btn_back-primary rounded-2xl px-4 py-2 mx-2 hover:scale-105">
                  {{ $t('delete-btn') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center">
          <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
            <img @click.prevent="openLoadFileMenu()" :src="srcImage" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>

          <div @click.prevent="openEmojiPanel()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
            <img :src="srcEmoji" alt="Emoji"
                 class="image-class rounded ms-2 me-4"/>
          </div>

          <div v-if="isEmojiPanelOpen" class="relative">
            <emoji-panel @emoji-selected="addEmoji"></emoji-panel>
          </div>

          <textarea v-model="postText" :placeholder="$t('post-placeholder')" class="w-full mt-3 mb-1 ps-3 pe-3 h-8 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
            bg-transparent placeholder-gray-a9 focus:outline-none resize-none"></textarea>

          <div @click.prevent="sendMessage()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
            <img :src="srcSend" alt="Send-cover"
                 class="image-class rounded ms-2 me-4"/>
          </div>
        </div>
      </div>
    </div> <!-- Load files -->



  </LayoutWithSidebar>
</template>
