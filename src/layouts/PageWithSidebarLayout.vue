<script>
import SidebarItem from "/src/components/ModalMessage.vue";

export default {
  name: "Sidebar",
  components: {SidebarItem},
  props: {
    page: String,
  },

  data() {
    return {
      isSidebarOpen: false,
      isDropdownOpen: false,
      theme: null,
      user: null,
      avatar: null,
      messagesCount: 0,
      chats: [],
      channels: []
    }
  },

  mounted() {
    this.setTheme()
    this.getUser()
    this.getAvatar()
    this.getUnreadMessagesCount()
  },

  beforeUnmount() {
    this.disconnectChannels()
  },

  computed: {
    srcBurger() {
      return this.theme === 'light' ? '/src/assets/burger.svg' : '/src/assets/burger-dark.svg'
    },
    srcClose() {
      return this.theme === 'light' ? '/src/assets/closeSidebar.svg' : '/src/assets/closeSidebar-dark.svg'
    },
    srcOpen() {
      return this.theme === 'light' ? '/src/assets/openSidebar.svg' : '/src/assets/openSidebar-dark.svg'
    },
    srcHome() {
      return this.theme === 'light' ? '/src/assets/home.svg' : '/src/assets/home-dark.svg'
    },
    srcSearch() {
      return this.theme === 'light' ? '/src/assets/search.svg' : '/src/assets/search-dark.svg'
    },
    srcNotifications() {
      return this.theme === 'light' ? '/src/assets/bell.svg' : '/src/assets/bell-dark.svg'
    },
    srcMessage() {
      return this.theme === 'light' ? '/src/assets/message.svg' : '/src/assets/message-dark.svg'
    },
    srcSettings() {
      return this.theme === 'light' ? '/src/assets/settings.svg' : '/src/assets/settings-dark.svg'
    },
    srcOption() {
      return this.theme === 'light' ? '/src/assets/options.svg' : '/src/assets/options-dark.svg'
    },
    srcAdmin() {
      return this.theme === 'light' ? '/src/assets/adminPanel.svg' : '/src/assets/adminPanel-dark.svg'
    },
  },


  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    getUser() {
      let user = this.$store.getters.user;
      if (user === undefined) {
        this.axios.get(this.$store.getters.serverPath + '/api/user').then(res => {
          this.$store.commit('setUser', res.data.data)
          this.user = res.data.data;
        }).catch(error => {
        })
      } else {
        this.user = user;
      }
    },

    getAvatar() {
      let avatar = this.$store.getters.avatar;
      if (avatar === undefined) {
        this.axios.get(this.$store.getters.serverPath + '/api/my-avatar').then(res => {
          this.$store.commit('setAvatar', res.data.data.image)
          this.avatar = res.data.data.image
        }).catch(error => {
        })
      } else {
        this.avatar = avatar;
      }
    },

    getUnreadMessagesCount() {
      this.disconnectChannels()
      this.axios.get(this.$store.getters.serverPath + '/api/unread-messages').then(res => {
        console.log(res)
        this.chats = res.data.data.chats
        this.messagesCount = res.data.data.count
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
        const channel = window.Echo.private(`chat.${chat}`)
          .listen('.message', (res) => {
            if (res.data.user_id !== this.user.id) {
              this.messagesCount += 1
            }
          })
          .listen('.deleted_message', (res) => {
            if (res.data.user_id !== this.user.id) {
              if(this.messagesCount > 0) {
                this.messagesCount -= 1
              }
            }
          })
          .listen('.read_messages', (res) => {
            if (res.data.user_id === this.user.id) {
              this.messagesCount -= parseInt(res.data.count)
              console.log(res.data.user_id + ' ' + res.data.count)
            }
          })
          .listen('.read_message', (res) => {
            if (res.data.user_id === this.user.id) {
              if(this.messagesCount > 0) {
                this.messagesCount -= 1
              }
            }
          })

        this.channels.push({
          chatId: chat,
          channel: channel,
        });
      });
      console.log('Connected to channels:', this.channels);
    },

    disconnectChannels() {
      this.channels.forEach(({chatId, channel}) => {
        channel.stopListening('.message');
        channel.stopListening('.deleted_message')
        channel.stopListening('.read_messages')
        channel.stopListening('.read_message')
        window.Echo.leave(`chat.${chatId}`)
      });
      this.channels = []; // Очищаем массив
      console.log('Disconnected from all channels')
    },

    openSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    openDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },

    logout() {
      this.axios.post(this.$store.getters.serverPath + '/logout').then(() => {
      }).then(() => {
        this.$store.commit('setToken', false);
        this.$store.commit('setUser', undefined)
        this.$store.commit('setAvatar', undefined)
        this.$router.push({name: 'login'})
      }).catch(err => {
        alert(err.response.data.message)
      })
    }
  }

}
</script>
<template>
  <div class="flex flex-col lg:flex-row md:flex-row min-h-screen">
    <div
      class="fixed w-full md:h-screen z-10 border border-gray-a9 border-solid dark:border-none bg-primary_back-light dark:bg-primary_back-dark md:bg-transparent"
      :class="{'md:w-60': isSidebarOpen, 'md:w-14': !isSidebarOpen}">
      <!-- Combined logo and navigation links in a single flex-row for mobile -->
      <div
        class="flex flex-row justify-around md:flex-col items-center md:items-stretch overflow-x-auto md:overflow-x-hidden">
        <!-- Logo -->
        <div class="my-2 text-primary_text-light dark:text-primary_text-dark mx-2 flex-shrink-0">
          Logo
        </div>
        <!-- Sidebar toggle (hidden in mobile) -->
        <div class="hidden md:block">
          <div class="h-px w-full bg-gray-a9 my-2"></div>
          <div class="flex flex-row justify-between items-center me-3 hover:cursor-pointer hover:opacity-75"
               @click.prevent="openSidebar" :class="{'hover:scale-110': !isSidebarOpen}">
            <div v-if="isSidebarOpen" class="ms-3 text-primary_text-light dark:text-primary_text-dark">
              {{ $t('turn-label') }}
            </div>
            <img v-if="isSidebarOpen" :src="srcOpen" alt="openSidebar"/>
            <img v-else :src="srcClose" alt="closeSidebar" class="ms-3"/>
          </div>
          <div class="h-px w-full bg-gray-a9 my-2"></div>
        </div>
        <!-- Navigation links -->
        <router-link to="/"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Home', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcHome" alt="Home"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('home-link') }}</div>
        </router-link>
        <router-link to="/search"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Search', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcSearch" alt="Search"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('search-link') }}</div>
        </router-link>
        <router-link to="/notifications"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Notifications', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcNotifications" alt="Bell"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('notification-link') }}</div>
        </router-link>
        <router-link to="/messenger"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded relative"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Messages', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcMessage" alt="Message"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('messenger-link') }}</div>
          <span v-if="messagesCount > 0"
                class="absolute -top-1 bg-btn_back-primary text-primary_text-dark font-bold px-1 py-0.5 rounded-full text-[10px]">
            {{ messagesCount }}
          </span>
        </router-link>
        <router-link to="/settings"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Settings', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcSettings" alt="Settings"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('settings-link') }}</div>
        </router-link>
        <router-link v-if="user && user.role === 'admin'" to="/admin-panel"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Admin', 'hover:scale-110': !isSidebarOpen}">
          <img :src="srcAdmin" alt="Admin"
               class="image-class rounded mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          <div v-if="isSidebarOpen" class="ms-3 hidden md:block">{{ $t('admin-panel-link') }}</div>
        </router-link>

        <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>


        <router-link v-if="user" :to="`/profile/${user.name}`"
                     class="flex flex-row items-center m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Profile'}">
          <template v-if="avatar != null">
            <img v-if="avatar === 'default_avatar'" src="/src/assets/default_avatar.png" alt="Круглое изображение"
                 class="w-7 h-6 ms-2 rounded-full object-cover" :class="{'ms-3': isSidebarOpen}"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + avatar" alt="Круглое изображение"
                 class="w-7 h-6 ms-2 rounded-full object-cover" :class="{'ms-3': isSidebarOpen}"/>
          </template>
          <div v-if="isSidebarOpen" class="ms-3">{{ user.name }}</div>
        </router-link>

        <div v-if="!isSidebarOpen" class="m-1 md:me-3" @click.prevent="openDropdown">
          <div class="hover:cursor-pointer hover:opacity-75">
            <img :src="srcOption" alt="Dropdown"
                 class="image-class rounded w-6 h-6 mx-2" :class="{'md:ms-3': isSidebarOpen}"/>
          </div>

          <div v-show="isDropdownOpen" class="rounded-md focus:outline-none">
            <ul class="text-primary_text-light dark:text-primary_text-dark">
              <li @click.prevent="logout">
                <div class="hover:cursor-pointer hover:underline hover:opacity-75 text-xs">
                  {{ $t('logout') }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="isSidebarOpen">
          <div @click.prevent="logout" class="text-primary_text-light dark:text-primary_text-dark block px-2 py-1 hover:cursor-pointer hover:underline hover:opacity-75 ms-12">
            {{ $t('logout') }}
          </div>
        </div>

      </div>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
    </div>

    <div class="flex flex-row justify-center w-full flex-grow mt-12"
         :class="{'md:ml-60 md:mt-0': isSidebarOpen, 'md:ml-14 md:mt-0': !isSidebarOpen}">
      <slot/>
    </div>
  </div>
</template>

