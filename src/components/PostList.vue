<script>
import dayjs from "dayjs";

export default {
  name: 'PostList',
  props: ['page', 'id'],
  data() {
    return {
      theme: localStorage.getItem('theme'),
      posts: null,
      lastPage: 1,
      page_id: 0,
      selectedDropdown: '',
    }
  },

  mounted() {
    if(this.page === 'profile') {
      this.getProfilePosts()
    }
  },

  computed: {
    srcLike() {
      return this.theme === 'light' ? '/src/assets/heart.svg' : '/src/assets/heart-dark.svg'
    },

    srcRepost() {
      return this.theme === 'light' ? '/src/assets/repost.svg' : '/src/assets/repost-dark.svg'
    },

    srcMakeRepost() {
      return this.theme === 'light' ? '/src/assets/makeRepost.svg' : '/src/assets/makeRepost-dark.svg'
    },

    srcComment() {
      return this.theme === 'light' ? '/src/assets/comment.svg' : '/src/assets/comment-dark.svg'
    },

    srcOptions() {
      return this.theme === 'light' ? '/src/assets/options.svg' : '/src/assets/options-dark.svg'
    },

  },

  methods: {
    getProfilePosts() {
      this.axios.get(this.$store.getters.serverPath + '/api/posts', {
        params: {
          'user_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if(this.lastPage >= this.page_id) {
            if(!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },

    openDropdown(post) {
      this.selectedDropdown = this.selectedDropdown === post ? "" : post
    },

  }
}
</script>

<template>
  <div v-if="posts" class="pt-1 rounded-lg">

    <div v-if="posts.length === 0" class="m-5 w-full flex flex-row justify-center"><h1
      class="text-lg text-primary_text-light dark:text-primary_text-dark">Тут нічого немає</h1></div>

    <div v-else class="md:block h-px w-full bg-gray-a9 my-2"></div>

    <div v-for="post in posts">
      <div class="flex flex-row justify-between items-center mx-3 my-3"> <!-- First row -->
        <div class="flex flex-row items-center">
          <div>
            <img v-if="post.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + post.user.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
          </div>
          <div class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark break-words">{{post.user.name}}</div>
          <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">{{formatDate(post.updated_at)}}</div>
          <div v-if="post.location" class="ms-5 italic text-secondary_text-light dark:text-secondary_text-dark break-words">{{post.location}}</div>
        </div>

        <div class="relative" @click.prevent="openDropdown(post.id)">
          <img :src="srcOptions" alt="Settings"
               class="w-8 h-8 md:block image-class rounded  hover:opacity-75 hover:cursor-pointer hover:scale-110"/>

          <div v-show="selectedDropdown === post.id" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
            <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
              <li>
                <div class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">Кнопка</div>
              </li>
            </ul>
          </div>
        </div>
      </div> <!-- First row -->

      <div class="ms-3 text-primary_text-light dark:text-primary_text-dark break-words">{{post.text}}</div>

      <template v-if="post.files.length > 0"><!-- Media row -->
        <div class="flex flex-wrap justify-center gap-1 items-center">
          <div v-for="(file, index) in post.files" :key="index" class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': post.files.length > 1}">
            <div class="relative w-full h-64 md:h-80" :class="{'h-36 md:h-64': post.files.length > 1 }">
              <img v-if="file.type === 'image'" :src="$store.getters.serverPath + '/api/post-image/' + file.filename" :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
              <video v-else :src="$store.getters.serverPath + '/api/post-video/' + file.filename" controls class=" w-full h-full object-cover rounded-lg shadow-md"></video>
            </div>
          </div>
        </div>
      </template><!-- Media row -->

      <div v-if="post.tags.length > 0" class="flex flex-row flex-wrap my-1 ms-1"><!-- Tags row -->
        <template v-for="tag in post.tags">
          <div class="mx-2 px-3 p-1 text-primary_text-light dark:text-primary_text-dark bg-secondary_back-light dark:bg-secondary_back-dark hover:cursor-pointer rounded-2xl">
            {{ tag.name }}
          </div>
        </template>
      </div><!-- Tags row -->

      <div v-if="post.main_post"> <!-- Main post -->
        <div class="ms-3 me-3 pt-1 my-3 rounded-lg shadow-lg border border-gray-a9 md:w-3/4">

          <div class="flex flex-row justify-between items-center mx-3 my-1"> <!-- First row -->
            <div class="flex flex-row items-center">
              <div>
                <img v-if="post.main_post.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                     alt="Круглое изображение"
                     class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
                <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + post.main_post.user.image"
                     alt="Круглое изображение"
                     class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
              </div>
              <div class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark break-words">{{post.main_post.user.name}}</div>
              <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">{{formatDate(post.main_post.updated_at)}}</div>
              <div v-if="post.main_post.location" class="ms-5 italic text-secondary_text-light dark:text-secondary_text-dark break-words">{{post.main_post.location}}</div>
            </div>
            <div class="italic text-secondary_text-light dark:text-secondary_text-dark">Reply to</div>
          </div> <!-- First row -->

          <div class="ms-3 text-primary_text-light dark:text-primary_text-dark break-words">{{post.main_post.text}}</div>

          <template v-if="post.main_post.files.length > 0"><!-- Media row -->
            <div class="flex flex-wrap justify-center gap-1 items-center">
              <div v-for="(file, index) in post.main_post.files" :key="index" class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': post.files.length > 1}">
                <div class="relative w-full h-40 md:h-48" :class="{'h-48 md:h-64': post.files.length > 1 }">
                  <img v-if="file.type === 'image'" :src="$store.getters.serverPath + '/api/post-image/' + file.filename" :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
                  <video v-else :src="$store.getters.serverPath + '/api/post-video/' + file.filename" controls class=" w-full h-full object-cover rounded-lg shadow-md"></video>
                </div>
              </div>
            </div>
          </template><!-- Media row -->
        </div>
      </div> <!-- Main post -->

      <div class="my-2 flex flex-row ms-1"> <!-- Buttons row -->
        <div class="flex flex-row items-center">
          <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
            <img @click.prevent="" :src="srcLike" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <div class="ms-1 hover:cursor-pointer hover:opacity-75 hover:scale-110 hover:underline rounded text-primary_text-light dark:text-primary_text-dark">
            {{post.like_count}}
          </div>
        </div>

        <div class="flex flex-row items-center hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcComment" alt="Image"
               class="image-class rounded ms-2"/>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{post.comment_count}}</div>
        </div>

        <div class="flex flex-row items-center hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcRepost" alt="Image"
               class="image-class rounded ms-2"/>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{post.repost_count}}</div>
        </div>
        <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img @click.prevent="" :src="srcMakeRepost" alt="Image"
               class="image-class rounded ms-2"/>
        </div>

      </div> <!-- Buttons row -->

      <div class="md:block h-px w-full bg-gray-a9 my-2"></div>

    </div>
  </div>
</template>
