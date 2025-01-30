<script>
import EmojiPanel from "@/components/EmojiPanel.vue";
import TagPanel from "@/components/TagPanel.vue";
import LocationPanel from "@/components/LocationPanel.vue";

export default {
  name: "CreatePost",
  components: {EmojiPanel, TagPanel, LocationPanel},
  props: {
    message: String,
  },
  data() {
    return {
      theme: null,
      postText: "",
      isEmojiPanelOpen: false,
      isTagPanelOpen: false,
      isLocationPanelOpen: false,
      tags: [],
      selectedTag: "",
      location: "",
      selectedLocation: "",
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
      files: [],
      urls: [],
      selectedIndex: null
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
    srcLocation() {
      return this.theme === 'light' ? '/src/assets/location-light.svg' : '/src/assets/location-dark.svg'
    },

  },
  methods: {
    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    closeAllPanels() {
      this.isEmojiPanelOpen = false
      this.isTagPanelOpen = false
      this.isLocationPanelOpen = false
    },

    openEmojiPanel() {
      this.isEmojiPanelOpen = !this.isEmojiPanelOpen
      this.isTagPanelOpen = false
      this.isLocationPanelOpen = false
    },

    openTagPanel() {
      this.isTagPanelOpen = !this.isTagPanelOpen
      this.isEmojiPanelOpen = false
      this.isLocationPanelOpen = false
    },

    openLocationPanel() {
      this.isLocationPanelOpen = !this.isLocationPanelOpen
      this.isEmojiPanelOpen = false
      this.isTagPanelOpen = false
    },

    addEmoji(emoji) {
      this.postText += emoji
    },

    addLocation(location) {
      this.location = location
    },

    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
    },

    selectTag(tag) {
      this.selectedTag = this.selectedTag === tag ? "" : tag
    },

    selectLocation() {
      this.selectedLocation = this.selectedLocation === this.location ? "" : this.location
    },

    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    deleteLocation() {
      this.location = ''
    },

    openLoadFileMenu() {
      this.$refs.fileInput.click();
    },

    handleFileChange() {
      if (this.$refs.fileInput) {
        if(this.urls.length < 4) {
          let file = this.$refs.fileInput.files[0]
          if (!file) return

          if (file.size >= 25 * 1024 * 1024) {
            alert('Файл слишком большой')
            return
          }

          if (!this.allowedTypes.includes(file.type)) {
            alert('Недопустимый формат файла')
            return
          }

          // Определение типа файла (изображение или видео)
          let fileType = file.type.startsWith('image') ? 'image' : 'video'

          // Сохранение файла
          this.files.push(file)

          // Генерация URL
          let url = URL.createObjectURL(file)
          this.urls.push({url, type: fileType})
        } else {
          alert('Превышен лимит файлов')
        }
      }
    },

    toggleSelection(index) {
      if (this.selectedIndex === index) {
        this.selectedIndex = null; // Снимаем выделение, если кликнули по уже выбранному файлу
      } else {
       this.selectedIndex = index; // Выбираем новый файл
      }
    },

    deleteFile(index) {
      this.urls.splice(index, 1)
      this.files.splice(index, 1)
      this.selectedIndex= null;
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
        <div
          v-for="(file, index) in urls"
          :key="index"
          class="p-2 flex flex-row justify-center relative"
          :class="{'md:w-5/12': urls.length > 1}"
          @click="toggleSelection(index)"
        >
          <!-- Контейнер для медиа -->
          <div
            class="relative w-full h-24 md:h-64"
            :class="{'bg-gray-700 opacity-75': selectedIndex === index}">
            <!-- Медиафайл: изображение или видео -->
            <img
              v-if="file.type === 'image'"
              :src="file.url"
              :alt="'Media ' + (index + 1)"
              class="w-full h-full object-cover rounded-lg shadow-md"
            >
            <video
              v-else
              :src="file.url"
              controls
              class="w-full h-full object-cover rounded-lg shadow-md"
            ></video>

            <!-- Кнопки (Удалить и Отмена), только если элемент выбран -->
            <div v-if="selectedIndex === index" class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <button @click.stop="deleteFile(index)" class="bg-red-500 text-white px-4 py-2 rounded-lg mx-2">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="location !== ''" @click.prevent="selectLocation()"
         class="relative my-1 mx-3 w-full text-secondary_text-light dark:text-secondary_text-dark hover:cursor-pointer underline">
      {{ location }}
      <div v-if="selectedLocation === location" @click.prevent="deleteLocation()" class="absolute px-2 left-5 bottom-5 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1 hover:underline">Удалить
      </div>
    </div>

    <textarea v-model="postText" :placeholder="$t('post-placeholder')" class="mb-1 py-3 ps-3 pe-3 h-12 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"></textarea>

    <div v-if="tags.length > 0" class="flex flex-row flex-wrap my-1 ms-1">
      <template v-for="tag in tags">
        <div @click.prevent="selectTag(tag)"
             class="relative mx-2 px-3 p-1 text-primary_text-light dark:text-primary_text-dark bg-secondary_back-light dark:bg-secondary_back-dark hover:cursor-pointer rounded-2xl">
          {{ tag }}
          <div v-if="selectedTag === tag" @click.prevent="deleteTag(tag)" class="absolute px-2 left-5 bottom-8 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1 hover:underline">
            {{ $t('delete-btn') }}
          </div>
        </div>
      </template>
    </div>

    <div class="flex flex-row justify-between my-1">
      <div class="flex flex-row ms-1">

        <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img @click.prevent="openLoadFileMenu()" :src="srcImage" alt="Image"
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

        <div @click.prevent="openLocationPanel()" class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcLocation" alt="Emoji"
               class="image-class rounded ms-2"/>
        </div>

        <div v-if="isTagPanelOpen" class="relative">
          <tag-panel @tag-selected="addTag"></tag-panel>
        </div>

        <div v-if="isEmojiPanelOpen" class="relative">
          <emoji-panel @emoji-selected="addEmoji"></emoji-panel>
        </div>

        <div v-if="isLocationPanelOpen" class="relative">
          <location-panel @location-selected="addLocation"></location-panel>
        </div>

      </div>
      <input type="submit" :value="$t('post-btn')" class="w-40 me-3 mx-2 py-1 text-btn_text-light bg-btn_back-primary
        rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">
    </div>

  </div>
</template>


