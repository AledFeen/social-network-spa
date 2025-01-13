<script>
export default {
  name: "Settings",
  data() {
    return {
      currentLocale: this.$i18n.locale, // Устанавливаем начальное значение локали
    };
  },

  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale; // Устанавливаем локаль
      localStorage.setItem('appLocale', locale); // Сохраняем выбор в localStorage
    },

    toggleTheme() {
      const theme = localStorage.getItem('theme')
      const htmlElement = document.documentElement
      if (theme === 'light') {
        htmlElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        htmlElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }
}

</script>

<template>
  <main>
    <button @click="toggleTheme">Тема</button>
    {{$t('test')}}
    <button @click="changeLocale">Язык</button>
    <div class="flex flex-row items-center">

      <div class="flex items-center">
        <label class="flex items-center space-x-2">
          <input
            type="radio"
            name="locale"
            value="en"
            :checked="currentLocale === 'en'"
            @change="() => changeLocale('en')"
            class="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <span>English</span>
        </label>
        <label class="flex items-center space-x-2 ms-2">
          <input
            type="radio"
            name="locale"
            value="ua"
            :checked="currentLocale === 'ua'"
            @change="() => changeLocale('ua')"
            class="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <span>Українська</span>
        </label>
      </div>

    </div>
  </main>
</template>

<style>

</style>
