<script>
export default {
  name: "Settings",

  methods: {
    toggleTheme() {
      const theme = localStorage.getItem('theme')
      const htmlElement = document.documentElement;
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
  </main>
</template>

<style>

</style>
