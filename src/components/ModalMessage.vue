<script>
  export default {
    name: "Sidebar",
    props: {
      message: String,
    },

  }
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div class="bg-secondary_back-light dark:bg-secondary_back-dark p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
      <p class="text-primary_text-light dark:text-secondary_text-dark">{{ message }}</p>
    </div>
  </div>
</template>


