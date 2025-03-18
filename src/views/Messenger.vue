<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import dayjs from "dayjs";

export default {
  name: 'Messenger',
  components: {LayoutWithSidebar},

  data() {
    return {
      chats: [],
      theme: localStorage.getItem('theme'),
      channels: []
    }
  },


  beforeMount() {
    this.getChats()
  },

  beforeUnmount() {
    this.disconnectChannels()
  },

  methods: {
    getChats() {
      this.disconnectChannels()
      this.axios.get(this.$store.getters.serverPath + '/api/chats').then(res => {
        this.chats = res.data.data
        this.connectChannels()
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    connectChannels() {
      this.channels = [];
      this.chats.forEach(chat => {
        const channel = window.Echo.private(`chat.${chat.id}`)
          .listen('.message', () => {
            this.getLastMessage(chat.id)
          })
          .listen('.deleted_message', () => {
            this.getLastMessage(chat.id)
          })
          .listen('.edited_message', () => {
            this.getLastMessage(chat.id)
          })
          .listen('.read_message', () => {
            this.getLastMessage(chat.id)
          })
          .listen('.read_messages', () => {
            this.getLastMessage(chat.id)
          });

        this.channels.push({
          chatId: chat.id,
          channel: channel,
        });
      });
      console.log('Connected to channels:', this.channels);
    },

    disconnectChannels() {
      this.channels.forEach(({chatId, channel}) => {
        channel.stopListening('.message');
        channel.stopListening('.deleted_message');
        channel.stopListening('.edited_message');
        channel.stopListening('.read_message');
        channel.stopListening('.read_messages');
        window.Echo.leave(`chat.${chatId}`);
      });
      this.channels = []; // Очищаем массив
      console.log('Disconnected from all channels');
    },

    getLastMessage(id) {
      this.axios.get(this.$store.getters.serverPath + '/api/last-message', {
        params: {
          'chat_id': id,
        }
      }).then(res => {
        const index = this.chats.findIndex(chat => chat.id === id)
        this.chats[index] = res.data.data
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    formatDate(date) {
      const formattedDate = dayjs(date);
      const today = dayjs().startOf("day");

      if (formattedDate.isSame(today, "day")) {
        return formattedDate.format("HH:mm");
      }

      return formattedDate.format("DD.MM.YYYY HH:mm");
    },

    srcCheck(was_read) {
      if (!was_read) {
        return this.theme === 'light' ? '/src/assets/check.svg' : '/src/assets/check-dark.svg'
      } else return '/src/assets/check-read.svg'
    },
  },
}
</script>

<template>
  <LayoutWithSidebar :page="''">
    <div v-if="chats && chats.length > 0"
         class="flex flex-col w-full md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">

      <template v-if="chats" v-for="chat in chats">
        <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark mb-1 hover:opacity-75">
          <router-link :to="`/chat/${chat.id}`">
            <div class="flex flex-row">
              <div class="flex flex-row w-2/3">
                <div class="flex flex-col justify-center items-center py-2 ms-10">
                  <img v-if="chat.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                       alt="Круглое изображение"
                       class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
                  <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + chat.user.image"
                       alt="Круглое изображение"
                       class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
                </div>
                <div class="ms-5 flex flex-col justify-center py-3 w-1/2">
                  <div class="text-primary_text-light dark:text-primary_text-dark font-bold truncate">{{
                      chat.user.name
                    }}
                  </div>
                  <div class="flex flex-row ">
                    <div v-if="chat.user.id !== chat.last_message.user.id"
                         class="text-secondary_text-light dark:text-secondary_text-dark me-1">
                      {{ $t('you') }}
                    </div>
                    <div class="text-primary_text-light dark:text-primary_text-dark truncate">
                      {{ chat.last_message.text }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-row w-1/3 justify-end items-center">
                <div v-if="chat.count_unread > 0"
                     class="flex flex-row justify-center items-center me-5 bg-gray-a9 rounded-full w-6 h-6 text-primary_text-light">
                  {{ chat.count_unread }}
                </div>
                <div v-else>
                  <img :src="srcCheck(chat.last_message.is_read)" alt="Tag"
                       class="image-class rounded me-5"/>
                </div>

                <div class="my-1 italic text-secondary_text-light dark:text-secondary_text-dark break-words me-10">
                  {{ this.formatDate(chat.last_message.created_at) }}
                </div>
              </div>
            </div>
          </router-link>

        </div>
      </template>
    </div>
    <div v-if="chats && chats.length === 0" class="flex flex-col justify-center">
      {{ $t('nothing-found') }}
    </div>

  </LayoutWithSidebar>
</template>
