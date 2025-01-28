<script>
import EmojiPanel from "@/components/EmojiPanel.vue";
import TagPanel from "@/components/TagPanel.vue";

export default {
  name: "CreatePost",
  components: {EmojiPanel, TagPanel},
  props: {
    message: String,
  },
  data() {
    return {
      theme: null,
      postText: "",
      isEmojiPanelOpen: false,
      isTagPanelOpen: false,
      tags: [],
      selectedTag: ""
    }
  },
  mounted() {
    this.setTheme()
  },
  computed: {
    srcEmoji() {
      return this.theme === 'light' ? '/src/assets/emoji-light.svg' : '/src/assets/emoji-dark.svg'
    },
    srcImage() {
      return this.theme === 'light' ? '/src/assets/image-light.svg' : '/src/assets/image-dark.svg'
    },
    srcTag() {
      return this.theme === 'light' ? '/src/assets/tag-light.svg' : '/src/assets/tag-dark.svg'
    },
  },
  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    openEmojiPanel() {
      this.isEmojiPanelOpen = !this.isEmojiPanelOpen
    },

    openTagPanel() {
      this.isTagPanelOpen = !this.isTagPanelOpen
    },

    addEmoji(emoji) {
      this.postText += emoji
    },

    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
    },

    selectTag(tag) {
      this.selectedTag = this.selectedTag === tag ? "" : tag
    },

    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    }
  },

}
</script>
<template>
  <div v-if="theme" class="mt-3 w-full flex flex-col p-3 bg-primary_back-light dark:bg-primary_back-dark rounded-2xl">
    <textarea v-model="postText" :placeholder="$t('post-placeholder')" class="mb-1 py-3 ps-3 pe-3 h-12 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"></textarea>

    <div v-if="tags.length > 0" class="flex flex-row flex-wrap my-1 ms-1">
      <template v-for="tag in tags">
        <div @click.prevent="selectTag(tag)"
             class="relative mx-2 px-2 p-1 text-primary_text-light dark:text-primary_text-dark bg-secondary_back-light dark:bg-secondary_back-dark hover:cursor-pointer rounded">
          {{ tag }}
          <div v-if="selectedTag === tag" @click.prevent="deleteTag(tag)" class="absolute px-2 left-5 bottom-8 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1 hover:underline">Удалить
          </div>
        </div>

      </template>
    </div>

    <div class="flex flex-row justify-between my-1">
      <div class="flex flex-row ms-1">

        <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcImage" alt="Image"
               class="image-class rounded ms-2"/>
        </div>

        <div @click.prevent="openTagPanel()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcTag" alt="Tag"
               class="image-class rounded ms-2"/>
        </div>

        <div @click.prevent="openEmojiPanel()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcEmoji" alt="Emoji"
               class="image-class rounded ms-2"/>
        </div>

        <div v-if="isTagPanelOpen" class="relative">
          <tag-panel @tag-selected="addTag"></tag-panel>
        </div>

        <div v-if="isEmojiPanelOpen" class="relative">
          <emoji-panel @emoji-selected="addEmoji"></emoji-panel>
        </div>

      </div>
      <input type="submit" :value="$t('post-btn')" class="w-40 me-3 mx-2 py-1 text-btn_text-light bg-btn_back-primary
        rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
    </div>

  </div>
</template>


