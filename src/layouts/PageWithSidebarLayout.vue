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
      isSidebarOpen: false
    }
  },
  methods: {
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
        <div class="block">
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
          <div class="hidden md:flex flex-row justify-between items-center me-3">
            <div v-if="isSidebarOpen" class="ms-3 text-primary_text-light dark:text-primary_text-dark">Згорнути</div>
            <img v-if="isSidebarOpen" src="/openSidebar.svg" alt="openSidebar"
                 class="image-class dark:bg-secondary_back-light hover:cursor-pointer hover:bg-secondary_back-light dark:hover:opacity-85 rounded" @click.prevent="openSidebar"/>
            <img v-else src="/closeSidebar.svg" alt="closeSidebar"
                 class="image-class dark:bg-secondary_back-light hover:cursor-pointer hover:bg-secondary_back-light dark:hover:opacity-85 rounded ms-3"
                 @click.prevent="openSidebar"/>
          </div>
          <div class="block md:hidden">
            <img src="/burger.svg" alt="burger"
                 class="md:hidden image-class dark:bg-secondary_back-light rounded my-2 me-2"
                 @click.prevent="openSidebar"/>
          </div>
          <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
        </div>

      </div>

      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded" :class="{'bg-gray-a9 rounded dark:text-primary_text-light': page === 'Home'}">
        <img src="/home.svg" alt="Home"
             class="hidden md:block image-class rounded dark:bg-secondary_back-light ms-2" :class="{'ms-3': isSidebarOpen, 'dark:bg-transparent': page === 'Home'}"/>
        <div v-if="isSidebarOpen" class="ms-3">Додому</div>
      </div>
      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded" :class="{'bg-gray-a9 rounded dark:text-primary_text-light': page === 'Search'}">
        <img src="/search.svg" alt="Search"
             class="hidden md:block image-class rounded dark:bg-secondary_back-light ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">Пошук</div>
      </div>
      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded" :class="{'bg-gray-a9 rounded dark:text-primary_text-light': page === 'Notifications'}">
        <img src="/bell.svg" alt="Bell"
             class="hidden md:block image-class rounded dark:bg-secondary_back-light ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">Сповіщення</div>
      </div>
      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded" :class="{'bg-gray-a9 rounded dark:text-primary_text-light': page === 'Messages'}">
        <img src="/message.svg" alt="Message"
             class="hidden md:block image-class rounded dark:bg-secondary_back-light ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">Повідомлення</div>
      </div>
      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded" :class="{'bg-gray-a9 rounded dark:text-primary_text-light': page === 'Settings'}">
        <img src="/settings.svg" alt="Settings"
             class="hidden md:block image-class rounded dark:bg-secondary_back-light ms-2" :class="{'ms-3': isSidebarOpen}"/>
        <div v-if="isSidebarOpen" class="ms-3">Налаштування</div>
      </div>

      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>
      <div class="flex flex-row items-center md:m-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:bg-secondary_back-light dark:hover:text-primary_text-light dark:hover:opacity-85 rounded">
        <img src="/public/favicon.ico" alt="Круглое изображение" class="w-7 h-6 md:ms-2 rounded-full object-cover hidden md:block" :class="{'md:ms-3': isSidebarOpen}" />
        <div v-if="isSidebarOpen" class="ms-3">Профіль</div>
      </div>
      <div class="hidden md:block h-px w-full bg-gray-a9 md:my-2"></div>

    </div>

    <div class="flex-item">
      <slot/>
    </div>

  </div>
</template>


