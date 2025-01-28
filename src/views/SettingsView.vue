<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import router from "@/router/index.js";

export default {
  name: "Settings",
  components: {LayoutWithSidebar},
  data() {
    return {
      currentLocale: this.$i18n.locale,
      currentTheme: localStorage.getItem('theme')
    };
  },

  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale; // Устанавливаем локаль
      localStorage.setItem('appLocale', locale); // Сохраняем выбор в localStorage
    },

    changeTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('theme', theme)
      location.reload();
    }

  }
}

</script>

<template>
  <LayoutWithSidebar :page="'Settings'">
    <div
      class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">
      <div class="flex flex-row items-center">
        <div class="flex items-center text-primary_text-light dark:text-primary_text-dark">
          <label class="flex items-center space-x-2 hover:cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              :checked="currentTheme === 'light'"
              @change="() => changeTheme('light')"
              class=" bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span>Світла</span>
          </label>
          <label class="flex items-center space-x-2 ms-2 hover:cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              :checked="currentTheme=== 'dark'"
              @change="() => changeTheme('dark')"
              class="bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span>Темна</span>
          </label>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <div class="relative">
          <label for="locale-select" class="sr-only">Choose language</label>
          <select
            id="locale-select"
            class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
            v-model="currentLocale"
            @change="changeLocale(currentLocale)">

            <option value="en" class="hover:cursor-pointer hover:opacity-75">English</option>
            <option value="ua" class="hover:cursor-pointer hover:opacity-75">Українська</option>
          </select>
        </div>
      </div>


    </div>
  </LayoutWithSidebar>
</template>

<style>

</style>
