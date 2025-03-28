<script>
import dayjs from "dayjs";
import CreatePost from "@/components/CreatePost.vue";
import ModalComplaint from "@/components/ModalComplaint.vue";

export default {
  name: 'PostList',
  components: {ModalComplaint, CreatePost},
  props: ['page', 'id', 'isOwner', 'searchRequest'],
  data() {
    return {
      theme: localStorage.getItem('theme'),
      posts: null,
      lastPage: 1,
      page_id: 0,
      selectedDropdown: '',
      selectedRepost: null,
      modalComplaint: false,
      selectedPostId: null,
      selectedUserId: null
    }
  },

  mounted() {
    this.get()
  },

  computed: {
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

    srcBack() {
      return this.theme === 'light' ? '/src/assets/back.svg' : '/src/assets/back-dark.svg'
    },

  },

  methods: {
    get() {
      switch (this.page) {
        case 'profile':
          this.getProfilePosts();
          break;

        case 'reposts':
          this.getReposts()
          break;

        case 'tag':
          this.getTagPosts()
          break;

        case 'feed':
         this.getFeedPosts()
          break;

        case 'recommendations':
          this.getRecommendations()
          break;

        case 'search':
          this.getSearchPosts()
          break;

        default:
          console.warn('Неизвестная страница:', this.page);
      }
    },

    getSearchPosts() {
      this.axios.get(this.$store.getters.serverPath + '/api/search-posts', {
        params: {
          'page_id': this.page_id += 1,
          'user': this.searchRequest.user,
          'text': this.searchRequest.text,
          'location': this.searchRequest.location,
          'tags[]': this.searchRequest.tags
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getProfilePosts() {
      this.axios.get(this.$store.getters.serverPath + '/api/posts', {
        params: {
          'user_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            //console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getReposts() {
      this.axios.get(this.$store.getters.serverPath + '/api/reposts', {
        params: {
          'post_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.posts) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getTagPosts() {
      this.axios.get(this.$store.getters.serverPath + '/api/posts-by-tag', {
        params: {
          'tag': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getFeedPosts() {
      this.axios.get(this.$store.getters.serverPath + '/api/feed-posts', {
        params: {
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            //console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getRecommendations() {
      this.axios.get(this.$store.getters.serverPath + '/api/recommended-posts', {
        params: {
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.users) {
              this.posts = response.data.data
            } else {
              this.posts.push(...response.data.data)
            }
            console.log(response)
          }
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deletePost(id) {
      this.axios.delete(this.$store.getters.serverPath + '/api/post', {
        params: {
          'post_id': id
        }
      }).then(res => {
        if (res.data.success) {
          this.$emit("post-deleted", true);
          this.posts = this.posts.filter(post => post.id !== id);
        } else {
          this.$emit("post-deleted", false);
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.$emit("post-deleted", false);
      })
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },

    openDropdown(post) {
      this.selectedDropdown = this.selectedDropdown === post ? "" : post
    },

    srcLike(isLiked) {
      if (isLiked) {
        return '/src/assets/heart-liked.svg'
      } else return this.theme === 'light' ? '/src/assets/heart.svg' : '/src/assets/heart-dark.svg'
    },

    likeUser(id) {
      this.axios.post(this.$store.getters.serverPath + '/api/like', {
        'post_id': id
      }).then(res => {
        if(res.data.success) {
          const index = this.posts.findIndex(pst => pst.id === id)
          if(this.posts[index].is_liked) {
            this.posts[index].is_liked = false
            this.posts[index].like_count -= 1
          } else {
            this.posts[index].is_liked = true
            this.posts[index].like_count += 1
          }
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    selectRepost(post) {
      this.selectedRepost = post
    },

    unselectRepost() {
      this.selectedRepost = null
    },

    createRepost(success) {
      if (success) {
        this.unselectRepost()
        if(this.isOwner && this.page === 'profile') {
          this.page_id -= 1
          this.getProfilePosts()
        }
      } else {
        this.$emit("post-deleted", false)
      }
    },

    complain(id, user_id) {
      this.selectedPostId = id
      this.selectedUserId = user_id
      this.modalComplaint = !this.modalComplaint
    },

    CheckSendComplaint (success) {
      if (success) {
        this.modalComplaint = false
        this.selectedPostId = null
        this.selectedUserId = null
        this.$emit("complaint-sent", true)
      } else this.modalComplaint = false
    },

  }
}
</script>

<template>
  <template v-if="modalComplaint">
    <ModalComplaint :id="selectedPostId" :user_id="selectedUserId" :type="'post'"  @complaint-sent="CheckSendComplaint"></ModalComplaint>
  </template>

  <div v-if="posts" class="pt-1 rounded-lg">

    <div v-if="selectedRepost" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-20">
      <div class="bg-secondary_back-light dark:bg-secondary_back-dark p-6 rounded-lg shadow-lg w-5/6 md:w-1/2 max-h-[80vh] overflow-y-auto">
        <div @click.prevent="unselectRepost" class="flex flex-row justify-end hover:cursor-pointer rounded">
          <img :src="srcBack" alt="Image" class="image-class rounded ms-2 hover:opacity-75 hover:scale-110"/>
        </div>
        <create-post @post-created="createRepost" :repost_id="selectedRepost"/>
      </div>
    </div>

    <div v-if="posts.length === 0" class="m-5 w-full flex flex-row justify-center"><h1
      class="text-lg text-primary_text-light dark:text-primary_text-dark">{{$t('nothing-found')}}</h1></div>

    <div v-else class="md:block h-px w-full bg-gray-a9 mt-1 mb-2"></div>

    <div v-for="post in posts">
      <div class="flex flex-row justify-between items-center mx-3 my-3"> <!-- First row -->
        <div class="flex flex-row items-center">
          <router-link :to="'/profile/' + post.user.name">
            <img v-if="post.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + post.user.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
          </router-link>
          <router-link :to="'/profile/' + post.user.name" class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark break-words hover:underline hover:cursor-pointer">
            {{ post.user.name }}
          </router-link>
          <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">
            {{ formatDate(post.updated_at) }}
          </div>
          <div v-if="post.location"
               class="ms-5 italic text-secondary_text-light dark:text-secondary_text-dark break-words">
            {{ post.location }}
          </div>
        </div>

        <div class="relative" @click.prevent="openDropdown(post.id)">
          <img :src="srcOptions" alt="Settings"
               class="w-8 h-8 md:block image-class rounded  hover:opacity-75 hover:cursor-pointer hover:scale-110"/>

          <div v-show="selectedDropdown === post.id" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
            <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
              <li>
                <div @click.prevent="deletePost(post.id)" v-if="isOwner"
                     class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                  {{ $t('delete-btn') }}
                </div>
              </li>
              <li>
                <router-link :to="`/edit-post/${post.id}`" @click.prevent="" v-if="isOwner"
                     class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                  {{ $t('edit-btn') }}
                </router-link>
              </li>
              <li>
                <div @click.prevent="complain(post.id, post.user.id)"
                     class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                  {{ $t('complaint-btn') }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div> <!-- First row -->

      <div class="ms-3 text-primary_text-light dark:text-primary_text-dark break-words">{{ post.text }}</div>

      <template v-if="post.files.length > 0"><!-- Media row -->
        <div class="flex flex-wrap justify-center gap-1 items-center">
          <div v-for="(file, index) in post.files" :key="index" class="p-2 flex flex-row justify-center relative"
               :class="{'md:w-5/12': post.files.length > 1}">
            <div class="relative w-full h-64 md:h-80" :class="{'h-36 md:h-64': post.files.length > 1 }">
              <img v-if="file.type === 'image'" :src="$store.getters.serverPath + '/api/post-image/' + file.filename"
                   :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
              <video v-else :src="$store.getters.serverPath + '/api/post-video/' + file.filename" controls
                     class=" w-full h-full object-cover rounded-lg shadow-md"></video>
            </div>
          </div>
        </div>
      </template><!-- Media row -->

      <div v-if="post.tags.length > 0" class="flex flex-row flex-wrap my-1 ms-1"><!-- Tags row -->
        <template v-for="tag in post.tags">
          <div class="mx-2 px-3 p-1 text-primary_text-light dark:text-primary_text-dark bg-secondary_back-light dark:bg-secondary_back-dark hover:cursor-pointer rounded-2xl">
            <router-link :to="`/posts-by-tag/${tag.name}`">{{ tag.name }}</router-link>
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
              <div class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark break-words">
                {{ post.main_post.user.name }}
              </div>
              <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">
                {{ formatDate(post.main_post.updated_at) }}
              </div>
              <div v-if="post.main_post.location"
                   class="ms-5 italic text-secondary_text-light dark:text-secondary_text-dark break-words">
                {{ post.main_post.location }}
              </div>
            </div>
            <router-link :to="'/post/' + post.main_post.id" class="italic text-secondary_text-light dark:text-secondary_text-dark hover:underline">{{$t('replied-to')}}</router-link>
          </div> <!-- First row -->

          <div class="ms-3 text-primary_text-light dark:text-primary_text-dark break-words">{{ post.main_post.text }}
          </div>

          <template v-if="post.main_post.files.length > 0"><!-- Media row -->
            <div class="flex flex-wrap justify-center gap-1 items-center">
              <div v-for="(file, index) in post.main_post.files" :key="index"
                   class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': post.files.length > 1}">
                <div class="relative w-full h-40 md:h-48" :class="{'h-48 md:h-64': post.files.length > 1 }">
                  <img v-if="file.type === 'image'"
                       :src="$store.getters.serverPath + '/api/post-image/' + file.filename"
                       :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
                  <video v-else :src="$store.getters.serverPath + '/api/post-video/' + file.filename" controls
                         class=" w-full h-full object-cover rounded-lg shadow-md"></video>
                </div>
              </div>
            </div>
          </template><!-- Media row -->
        </div>
      </div> <!-- Main post -->

      <div class="my-2 flex flex-row ms-1"> <!-- Buttons row -->
        <div class="flex flex-row items-center">
          <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
            <img @click.prevent="likeUser(post.id)" :src="srcLike(post.is_liked)" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <router-link :to="`/post-likes/${post.id}`"
                       class="ms-1 hover:cursor-pointer hover:opacity-75 hover:scale-110 hover:underline rounded text-primary_text-light dark:text-primary_text-dark">
            {{ post.like_count }}
          </router-link>
        </div>

        <router-link :to="'/post/' + post.id" class="flex flex-row items-center hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcComment" alt="Image"
               class="image-class rounded ms-2"/>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{ post.comment_count }}</div>
        </router-link>

        <router-link :to="`/reposts/${post.id}`" class="flex flex-row items-center hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img :src="srcRepost" alt="Image"
               class="image-class rounded ms-2"/>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{ post.repost_count }}</div>
        </router-link>

        <div class="hover:cursor-pointer hover:opacity-75 hover:scale-110 rounded">
          <img @click.prevent="selectRepost(post.id)" :src="srcMakeRepost" alt="Image"
               class="image-class rounded ms-2"/>
        </div>

      </div> <!-- Buttons row -->

      <div class="md:block h-px w-full bg-gray-a9 my-2"></div>

      <div v-if="this.lastPage >= this.page_id + 1" @click.prevent="getProfilePosts" class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
        {{$t('download-btn') }}
      </div>



    </div>
  </div>
</template>
