<script>
  export default {
    name: "Sidebar",
    data(){
      return {
        emojis: ["😀", "😂", "😍", "😎", "😭", "👍", "🎉", "🔥"],
      }
    },

    methods: {
      addEmoji(emoji){
        this.$emit("emoji-selected", emoji);
      }
    }

  }
</script>
<template>

  <div class="absolute w-40 left-3 bottom-0 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
    <div class="flex flex-row flex-wrap">
      <template v-for="emoji in emojis">
        <div @click.prevent="addEmoji(emoji)" class="mx-0.5 text-xl text-primary_text-light hover:cursor-pointer hover:scale-110"><span>{{emoji}}</span></div>
      </template>
    </div>

  </div>
</template>


