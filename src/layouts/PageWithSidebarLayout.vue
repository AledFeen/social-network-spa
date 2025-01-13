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
      theme: null
    }
  },
  mounted() {
    this.setTheme()
  },
  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    openSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }

}
</script>
<template>
  <div class="flex flex-col lg:flex-row md:flex-row min-h-screen">
    <div class="border border-gray-a9 border-solid dark:border-none" :class="{'lg:w-1/6 md:w-1/8': isSidebarOpen}">
      <div class="flex flex-row md:flex-col justify-between">
        <div class="my-2 text-primary_text-light dark:text-primary_text-dark ms-2">Logo</div>
        <div class="block" >
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
          <div class="hidden md:flex flex-row justify-between items-center me-3 hover:cursor-pointer hover:opacity-85" @click.prevent="openSidebar">
            <div v-if="isSidebarOpen" class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{$t('turn-label')}}</div>
            <img v-if="isSidebarOpen && theme === 'light'" src="/openSidebar.svg" alt="openSidebar"/>
            <img v-else-if="isSidebarOpen && theme === 'dark'" src="/openSidebar-dark.svg" alt="openSidebar"/>
            <img v-else-if="theme === 'light'" src="/closeSidebar.svg" alt="closeSidebar" class="ms-3"/>
            <img v-else src="/closeSidebar-dark.svg" alt="closeSidebar" class="ms-3"/>
          </div>
          <div class="block md:hidden">
            <img v-if="theme === 'light'" src="/burger.svg" alt="burger"
                 class="md:hidden image-class rounded my-2 me-2 hover:cursor-pointer hover:opacity-75"
                 @click.prevent="openSidebar"/>
            <img v-else src="/burger-dark.svg" alt="burger"
                 class="md:hidden image-class rounded my-2 me-2 hover:cursor-pointer hover:opacity-75"
                 @click.prevent="openSidebar"/>
          </div>
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
        </div>

      </div>

      <router-link to="/" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Home'}">
        <img v-if="theme === 'light'" src="/home.svg" alt="Home"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/home-dark.svg" alt="Home"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{$t('home-link')}}</div>
      </router-link>
      <router-link to="/" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Search'}">
        <img v-if="theme === 'light'" src="/search.svg" alt="Search"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/search-dark.svg" alt="Search"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{$t('search-link')}}</div>
      </router-link>
      <router-link to="/" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Notifications'}">
        <img v-if="theme === 'light'" src="/bell.svg" alt="Bell"
             class="hidden md:block image-class rounded  ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/bell-dark.svg" alt="Bell"
             class="hidden md:block image-class rounded  ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{$t('notification-link')}}</div>
      </router-link>
      <router-link to="/" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Messages'}">
        <img v-if="theme === 'light'" src="/message.svg" alt="Message"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/message-dark.svg" alt="Message"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{$t('messenger-link')}}</div>
      </router-link>
      <router-link to="/settings" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Settings'}">
        <img v-if="theme === 'light'" src="/settings.svg" alt="Settings"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <img v-else src="/settings-dark.svg" alt="Settings"
             class="hidden md:block image-class rounded ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">{{$t('settings-link')}}</div>
      </router-link>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
      <router-link to="/" class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75 rounded" :class="{'bg-secondary_back-light dark:bg-secondary_back-dark rounded': page === 'Profile'}">
        <img src="/public/favicon.ico" alt="Круглое изображение" class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}" />
        <div v-if="isSidebarOpen" class="ms-3">Нікнейм</div>
      </router-link>
      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
    </div>

    <div class="flex-item">
      <slot/>
    </div>

  </div>
</template>


