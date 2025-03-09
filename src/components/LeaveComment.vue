<script>
import EmojiPanel from "@/components/EmojiPanel.vue";
import TagPanel from "@/components/TagPanel.vue";
import LocationPanel from "@/components/LocationPanel.vue";
import ModalMessage from "@/components/ModalMessage.vue";

export default {
  name: "LeaveComment",
  components: { EmojiPanel, TagPanel},
  props: ['post_id', 'reply_id'],

  data() {
    return {
      theme: null,
      postText: "",
      isEmojiPanelOpen: false,
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
      files: [],
      urls: [],
      selectedIndex: null
    }
  },

  beforeMount() {
    this.setTheme()
  },

  mounted() {

  },

  computed: {
    srcEmoji() {
      return this.theme === 'light' ? '/src/assets/emoji-light.svg' : '/src/assets/emoji-dark.svg'
    },
    srcImage() {
      return this.theme === 'light' ? '/src/assets/image-light.svg' : '/src/assets/image-dark.svg'
    },
  },
  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    openEmojiPanel() {
      this.isEmojiPanelOpen = !this.isEmojiPanelOpen
      this.isTagPanelOpen = false
      this.isLocationPanelOpen = false
    },

    addEmoji(emoji) {
      this.postText += emoji
    },

    openLoadFileMenu() {
      this.$refs.fileInput.click();
    },

    handleFileChange() {
      if (this.$refs.fileInput) {
        if(this.urls.length < 2) {
          let file = this.$refs.fileInput.files[0]
          if (!file) return

          if (file.size >= 25 * 1024 * 1024) {
            alert(this.$t('big-file-message'))
            return
          }

          if (!this.allowedTypes.includes(file.type)) {
            alert(this.$t('uncorrected-format-message'))
            return
          }

          let fileType = 'image'

          this.files.push(file)

          let url = URL.createObjectURL(file)
          this.urls.push({url, type: fileType})
        } else {
          alert(this.$t('file-limit-message'))
        }
      }
    },

    toggleSelection(index) {
      if (this.selectedIndex === index) {
        this.selectedIndex = null;
      } else {
       this.selectedIndex = index;
      }
    },

    deleteFile(index) {
      this.urls.splice(index, 1)
      this.files.splice(index, 1)
      this.selectedIndex= null;
    },

    saveComment() {
      const formData = new FormData()

      formData.append('post_id', this.post_id)
      this.reply_id ? formData.append('reply_id', this.reply_id) : formData.append('reply_id', "")
      formData.append('text', this.postText)
      this.files.forEach(file => {
        formData.append('files[]', file);
      });

      this.axios.post(this.$store.getters.serverPath + '/api/comment', formData).then(res => {
        console.log(res)
        this.postText = ''
        this.files = []
        this.urls = []
        if(this.reply_id) {
          this.$emit("comment-created", true, this.reply_id);
        } else
        this.$emit("comment-created", true, null);
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.$emit("comment-created", false, null);
      })
    }

  },
}
</script>
<template>
  <div v-if="theme" class="mt-3 w-full flex flex-col p-3 bg-primary_back-light dark:bg-primary_back-dark rounded-2xl">

    <div class="hidden">
      <input type="file" class="form-control" id="inputGroupFile" ref="fileInput" @change="handleFileChange">
    </div>

    <template v-if="urls.length > 0">
      <div class="flex flex-wrap justify-center gap-1 items-center">
        <div v-for="(file, index) in urls" :key="index" class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': urls.length > 1}"
             @click="toggleSelection(index)">
          <div class="relative w-full h-64 md:h-80" :class="{'bg-gray-700 opacity-75': selectedIndex === index, 'h-36 md:h-44': this.urls.length > 1 }">

            <img :src="file.url" :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">

            <div v-if="selectedIndex === index" class="absolute inset-0 flex justify-center items-center rounded-lg bg-black bg-opacity-25">
              <button @click.stop="deleteFile(index)" class="text-btn_text-light bg-btn_back-primary
                rounded-2xl px-4 py-2 mx-2 hover:scale-105">{{$t('delete-btn')}}</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <textarea v-model="postText" :placeholder="$t('post-placeholder')" class="mb-1 py-3 ps-3 pe-3 h-12 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"></textarea>

    <div class="flex flex-row justify-between my-1">
      <div class="flex flex-row ms-1">

        <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img @click.prevent="openLoadFileMenu()" :src="srcImage" alt="Image"
               class="image-class rounded ms-2"/>
        </div>

        <div @click.prevent="openEmojiPanel()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcEmoji" alt="Emoji"
               class="image-class rounded ms-2"/>
        </div>

        <div v-if="isEmojiPanelOpen" class="relative">
          <emoji-panel @emoji-selected="addEmoji"></emoji-panel>
        </div>

      </div>
      <input @click.prevent="saveComment()" type="submit" :value="$t('comment-btn')" class="w-40 me-3 mx-2 py-1 text-btn_text-light bg-btn_back-primary
        rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
    </div>

  </div>
</template>


