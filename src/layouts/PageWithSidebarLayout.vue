<script>
import SidebarItem from "/src/components/SidebarItem.vue";

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

  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    getUser() {
      let user = this.$store.getters.user;

      if (user) {
        this.user = user;
      } else {
        setTimeout(() => {
          this.getUser();
        }, 500);
      }
    },

    getAvatar() {
      let avatar = this.$store.getters.avatar;
      if (avatar) {
        this.avatar = avatar;
      } else {
        setTimeout(() => {
          this.getAvatar();
        }, 500);
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
    <div class="border border-gray-a9 border-solid dark:border-none" :class="{'lg:w-1/6 md:w-1/8': isSidebarOpen}">
      <div class="flex flex-row md:flex-col justify-between">
        <div class="my-2 text-primary_text-light dark:text-primary_text-dark ms-2">Logo</div>
        <div class="block">
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
          <div class="hidden md:flex flex-row justify-between items-center me-3 hover:cursor-pointer hover:opacity-85"
               @click.prevent="openSidebar">
            <div v-if="isSidebarOpen" class="ms-3 text-primary_text-light dark:text-primary_text-dark">
              {{ $t('turn-label') }}
            </div>
            <img v-if="isSidebarOpen && theme === 'light'" src="/src/assets/openSidebar.svg" alt="openSidebar"/>
            <img v-else-if="isSidebarOpen && theme === 'dark'" src="/src/assets/openSidebar-dark.svg"
                 alt="openSidebar"/>
            <img v-else-if="theme === 'light'" src="/src/assets/closeSidebar.svg" alt="closeSidebar" class="ms-3"/>
            <img v-else src="/src/assets/closeSidebar-dark.svg" alt="closeSidebar" class="ms-3"/>
          </div>
          <div class="block md:hidden">
            <img v-if="theme === 'light'" src="/src/assets/burger.svg" alt="burger"
                 class="md:hidden image-class rounded my-2 me-2 hover:cursor-pointer hover:opacity-75"
                 @click.prevent="openSidebar"/>
            <img v-else src="/src/assets/burger-dark.svg" alt="burger"
                 class="md:hidden image-class rounded my-2 me-2 hover:cursor-pointer hover:opacity-75"
                 @click.prevent="openSidebar"/>
          </div>
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
        </div>

      </div>

      <router-link to="/"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Home'}">
        <img v-if="theme === 'light'" src="/src/assets/home.svg" alt="Home"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/src/assets/home-dark.svg" alt="Home"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('home-link') }}</div>
      </router-link>
      <router-link to="/"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Search'}">
        <img v-if="theme === 'light'" src="/src/assets/search.svg" alt="Search"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/src/assets/search-dark.svg" alt="Search"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('search-link') }}</div>
      </router-link>
      <router-link to="/"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Notifications'}">
        <img v-if="theme === 'light'" src="/src/assets/bell.svg" alt="Bell"
             class="hidden md:block image-class rounded  ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/src/assets/bell-dark.svg" alt="Bell"
             class="hidden md:block image-class rounded  ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('notification-link') }}</div>
      </router-link>
      <router-link to="/"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Messages'}">
        <img v-if="theme === 'light'" src="/src/assets/message.svg" alt="Message"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/src/assets/message-dark.svg" alt="Message"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('messenger-link') }}</div>
      </router-link>
      <router-link to="/settings"
                   class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                   :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Settings'}">
        <img v-if="theme === 'light'" src="/src/assets/settings.svg" alt="Settings"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/src/assets/settings-dark.svg" alt="Settings"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{ $t('settings-link') }}</div>
      </router-link>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>

      <div class="flex flex-row md:justify-between">
        <router-link v-if="user" :to="`/profile/${user.id}`"
                     class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded"
                     :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Profile'}">
          <template v-if="avatar">
            <img v-if="avatar === 'default_avatar'" src="/src/assets/default_avatar.png" alt="Круглое изображение"
                 class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + avatar" alt="Круглое изображение"
                 class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}"/>
          </template>
          <div v-if="isSidebarOpen" class="ms-3">{{ user.name }}</div>
        </router-link>

        <div v-if="isSidebarOpen" class="relative md:m-1 md:me-3 " @click.prevent="openDropdown">
          <div class="hover:cursor-pointer hover:opacity-75">
            <img v-if="theme === 'light'" src="/src/assets/options-light.svg" alt="Settings"
                 class="md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
            <img v-else src="/src/assets/options-dark.svg" alt="Settings"
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

    <div class="flex-item">
      <slot/>
    </div>

  </div>
</template>


