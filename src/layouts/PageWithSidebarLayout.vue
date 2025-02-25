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
      avatar: null
    }
  },

  mounted() {
    this.setTheme()
    this.getUser()
    this.getAvatar()
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
      <div class="flex flex-row md:flex-col justify-between">
        <div class="my-2 text-primary_text-light dark:text-primary_text-dark ms-2">Logo</div>
        <div class="block">
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
          <div class="hidden md:flex flex-row justify-between items-center me-3 hover:cursor-pointer hover:opacity-75"
               @click.prevent="openSidebar" :class="{'hover:scale-110': !isSidebarOpen}">
            <div v-if="isSidebarOpen" class="ms-3 text-primary_text-light dark:text-primary_text-dark">
              {{ $t('turn-label') }}
            </div>
            <img v-if="isSidebarOpen" :src="srcOpen" alt="openSidebar"/>
            <img v-else :src="srcClose" alt="closeSidebar" class="ms-3"/>
          </div>
          <div class="block md:hidden">
            <img :src="srcBurger" alt="burger"
                 class="md:hidden image-class rounded my-2 me-2 hover:cursor-pointer hover:opacity-75 , hover:scale-110"
                 @click.prevent="openSidebar"/>
          </div>
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
        </div>

      </div>

      <router-link to="/"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Home', 'hover:scale-110': !isSidebarOpen}">
        <img :src="srcHome" alt="Home"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('home-link') }}</div>
      </router-link>
      <router-link to="/search"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Search', 'hover:scale-110': !isSidebarOpen}">
        <img :src="srcSearch" alt="Search"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('search-link') }}</div>
      </router-link>
      <router-link to="/notifications"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Notifications', 'hover:scale-110': !isSidebarOpen }">
        <img :src="srcNotifications" alt="Bell"
             class="hidden md:block image-class rounded  ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('notification-link') }}</div>
      </router-link>
      <router-link to="/messenger"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Messages', 'hover:scale-110': !isSidebarOpen}">
        <img :src="srcMessage" alt="Message"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('messenger-link') }}</div>
      </router-link>
      <router-link to="/settings"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Settings', 'hover:scale-110': !isSidebarOpen}">
        <img :src="srcSettings" alt="Settings"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>

        <div v-if="isSidebarOpen" class="ms-3">{{ $t('settings-link') }}</div>
      </router-link>

      <router-link v-if="user && user.role === 'admin'" to="/admin-panel"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Admin', 'hover:scale-110': !isSidebarOpen}">
        <img :src="srcAdmin" alt="Admin"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>

        <div v-if="isSidebarOpen" class="ms-3">{{ $t('admin-panel-link') }}</div>
      </router-link>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>

      <div class="flex flex-row md:justify-between">
        <router-link v-if="user" :to="`/profile/${user.name}`"
                     class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Profile'}">
          <template v-if="avatar != null">
            <img v-if="avatar === 'default_avatar'" src="/src/assets/default_avatar.jpg" alt="Круглое изображение"
                 class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + avatar" alt="Круглое изображение"
                 class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}"/>
          </template>
          <div v-if="isSidebarOpen" class="ms-3">{{ user.name }}</div>
        </router-link>

        <div v-if="isSidebarOpen" class="relative md:m-1 md:me-3 " @click.prevent="openDropdown">
          <div class="hover:cursor-pointer hover:opacity-75">
            <img :src="srcOption" alt="Settings"
                 class="md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
          </div>

          <div v-show="isDropdownOpen" class="absolute md:top-10 w-40 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark">
            <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
              <li @click.prevent="logout">
                <div class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                  {{ $t('logout') }}
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
    </div>

    <div class="flex flex-row justify-center w-full flex-grow mt-8"
         :class="{'md:ml-60 md:mt-0': isSidebarOpen, 'md:ml-14 md:mt-0': !isSidebarOpen}">
      <slot/>
    </div>
  </div>
</template>


