<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import dayjs from "dayjs";
import LeaveComment from "@/components/LeaveComment.vue";
import CreatePost from "@/components/CreatePost.vue";
import ModalComplaint from "@/components/ModalComplaint.vue";
import ModalMessage from "@/components/ModalMessage.vue";

export default {
  name: 'Post',
  components: {ModalMessage, ModalComplaint, CreatePost, LeaveComment, LayoutWithSidebar},
  props: ['id'],

  beforeMount() {
    this.setTheme()
    this.connectChannel()
  },

  mounted() {
    this.getPost()
    this.getComments()
  },

  beforeUnmount() {
    if (this.channel) {
      this.channel.stopListening('.like')
      this.channel.stopListening('.dislike')
      this.channel.stopListening('.comment')
      this.channel.stopListening('.deleted_comment')
      window.Echo.leave(`post.${this.id}`)
    }
  },

  watch: {
    $route(to, from) {
      this.page_id = 0
      this.lastPage = 1
      this.comments = []
      this.getPost()
      this.getComments()
      this.connectChannel()
    }
  },

  data() {
    return {
      channel: null,
      theme: null,
      post: null,
      selectedDropdown: '',
      selectedCommentDropdown: '',
      selectedRepost: null,
      lastPage: 1,
      page_id: 0,
      comments: [],
      selectedComment: null,
      modalComplaint: false,
      modalComplaintComment: false,
      selectedCommentId: null,
      selectedCommentUserId: null,
      isModalVisible: false,
      modalMessage: null,
    }
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

    isOwner() {
      return this.post.user.name === this.$store.getters.user.name
    },

  },

  methods: {
    isOwnerComment(id) {
      return Number(id) === this.$store.getters.user.id
    },

    connectChannel() {
      if (!this.channel) {
        this.channel = window.Echo.private('post.' + this.id)
          .listen('.like', (res) => {
            console.log('like')
            console.log(res)
            this.post.like_count += 1
            if(Number(res.like) === this.$store.getters.user.id) {
              this.post.is_liked = true
            }
          })
          .listen('.dislike', (res) => {
            console.log('dislike')
            console.log(res)
            this.post.like_count -= 1
            if(Number(res.dislike) === this.$store.getters.user.id) {
              this.post.is_liked = false
            }
          })
          .listen('.comment', (res) => {
            console.log('comment')
            console.log(res)

            this.getComment(Number(res.comment))
          })
          .listen('.deleted_comment', (res) => {
            console.log('comment')
            console.log(res)


            if(res.comment['reply']) {
              const index = this.comments.findIndex(cnt => cnt.id === Number(res.comment['reply']))
              this.comments[index].has_replies -= 1
              if(this.comments[index].replies) {
                const comIndex = this.comments[index].replies.findIndex(cnt => cnt.id === Number(res.comment['id']))
                this.comments[index].replies.splice(comIndex, 1)
              }
            } else {
              const index = this.comments.findIndex(cnt => cnt.id === Number(res.comment['id']))
              this.comments.splice(index, 1)
              this.post.comment_count -= 1
            }
          })

      }
    },

    setTheme() {
      this.theme = localStorage.getItem('theme')
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },

    openDropdown(post) {
      this.selectedDropdown = this.selectedDropdown === post ? "" : post
    },

    openCommentDropdown(post) {
      this.selectedCommentDropdown = this.selectedCommentDropdown === post ? "" : post
    },

    srcLike(isLiked) {
      if (isLiked) {
        return '/src/assets/heart-liked.svg'
      } else return this.theme === 'light' ? '/src/assets/heart.svg' : '/src/assets/heart-dark.svg'
    },

    getPost() {
      this.axios.get(this.$store.getters.serverPath + '/api/post', {
        params: {
          'post_id': this.id,
        }
      })
        .then(response => {
          this.post = response.data.data
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
          this.$router.push(`/profile/` + this.post.user.name);
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    getComment(id) {
      this.axios.get(this.$store.getters.serverPath + '/api/comment', {
        params: {
          'comment_id': id
        }
      })
        .then(response => {
          const comment = response.data.data
          if(comment.reply_id) {
            const index = this.comments.findIndex(cnt => cnt.id === comment.reply_id)
            this.comments[index].hasReplies += 1
            if(this.comments[index].replies) {
              this.comments[index].replies.push(comment)
            }
          } else {
            this.comments.push(comment)
            this.post.comment_count += 1
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

    deleteComment(id) {
      this.axios.delete(this.$store.getters.serverPath + '/api/comment', {
        params: {
          'comment_id': id
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    ignoreTags(id) {
      this.axios.delete(this.$store.getters.serverPath + '/api/ignoreTag', {
        params: {
          'post_id': id
        }
      }).then(() => {
        alert(this.$t('success-request'))
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage)
      })
    },

    getComments() {
      this.axios.get(this.$store.getters.serverPath + '/api/comments', {
        params: {
          'post_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if (this.lastPage >= this.page_id) {
            if (!this.comments) {
              this.comments = response.data.data
            } else {
              this.comments.push(...response.data.data)
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

    downloadReplies(commentId) {
      const foundComment = this.comments.find(comment => comment.id === commentId);
      let page;
      if(foundComment.currentPage) {
        page = foundComment.currentPage + 1
      } else page = 1
      this.axios.get(this.$store.getters.serverPath + '/api/comment-replies', {
        params: {
          'reply_id': commentId,
          'page_id': page
        }
      })
        .then(response => {
          foundComment.lastPage = response.data.last_page
          foundComment.currentPage = response.data.current_page
          foundComment.total = response.data.total
          if(foundComment.replies) {
            foundComment.replies.push(...response.data.data)
          } else foundComment.replies = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    selectReplyComment(commentId) {
      commentId === this.selectedComment ? this.selectedComment = null : this.selectedComment = commentId
    },

    complain() {
      this.modalComplaint = !this.modalComplaint
    },

    complainComment(id, userId) {
      this.selectedCommentId = id
      this.selectedCommentUserId = userId
      this.modalComplaintComment = !this.modalComplaintComment
    },

    CheckSendComplaint (success) {
      if (success) {
        this.modalComplaint = false
        this.modalComplaintComment = false
        this.selectedCommentId = null
        this.selectedCommentUserId = null
        this.showModal(this.$t('success-request'))
      } else {
        this.modalComplaint = false
        this.modalComplaintComment = false
      }
    },

    likeUser(id) {
      this.axios.post(this.$store.getters.serverPath + '/api/like', {
        'post_id': id
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    showModal(message) {
      this.modalMessage = message;
      this.isModalVisible = true;

      setTimeout(() => {
        this.isModalVisible = false;
      }, 500);
    },

  }
}
</script>

<template>
  <LayoutWithSidebar :page="''">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>

    <template v-if="modalComplaint">
      <ModalComplaint :id="post.id" :user_id="post.user.id" :type="'post'"  @complaint-sent="CheckSendComplaint"></ModalComplaint>
    </template>

    <template v-if="modalComplaintComment">
      <ModalComplaint :id="selectedCommentId" :user_id="selectedCommentUserId" :type="'comment'"  @complaint-sent="CheckSendComplaint"></ModalComplaint>
    </template>

    <div class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <div v-if="!post" class="m-5 w-full flex flex-row justify-center"><h1
        class="text-lg text-primary_text-light dark:text-primary_text-dark">{{$t('nothing-found')}}</h1></div>
      <template v-if="post">
        <div v-if="selectedRepost" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-20">
          <div class="bg-secondary_back-light dark:bg-secondary_back-dark p-6 rounded-lg shadow-lg w-5/6 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div @click.prevent="unselectRepost" class="flex flex-row justify-end hover:cursor-pointer rounded">
              <img :src="srcBack" alt="Image" class="image-class rounded ms-2 hover:opacity-75 hover:scale-110"/>
            </div>
            <create-post @post-created="createRepost" :repost_id="selectedRepost"/>
          </div>
        </div>

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
            <img :src="srcOptions" alt="openPostDropdown"
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
                  <div @click.prevent="ignoreTags(post.id)" v-if="post.tags.length > 0"
                       class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                    {{ $t('ignore-same-btn') }}
                  </div>
                </li>
                <li>
                  <router-link :to="`/edit-post/${post.id}`" @click.prevent="" v-if="isOwner"
                               class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                    {{ $t('edit-btn') }}
                  </router-link>
                </li>
                <li>
                  <div @click.prevent="complain()"
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
              <img @click.prevent="likeUser(post.id)" :src="srcLike(post.is_liked)" alt="Like"
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
            <img @click.prevent="selectRepost(post.id)" :src="srcMakeRepost" alt="make-repost"
                 class="image-class rounded ms-2"/>
          </div>
        </div> <!-- Buttons row -->
        <div class="md:block h-px w-full bg-gray-a9 my-2"></div>

        <LeaveComment @comment-created="commentCreated" :post_id="id"/>

        <div class="md:block h-px w-full bg-gray-a9 my-2"></div>

        <template v-for="comment in comments"> <!-- Comment -->
          <div class="flex flex-row justify-between items-center mx-3 my-3"> <!-- First row -->
            <div class="flex flex-row w-full">
              <div class="items-center flex flex-col">
                <router-link :to="'/profile/' + comment.user.name">
                  <img v-if="comment.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                       alt="Круглое изображение"
                       class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
                  <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + comment.user.image"
                       alt="Круглое изображение"
                       class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
                </router-link>
                <div v-if="comment.lastPage" class="mt-2 mb-2 block w-px h-full bg-gray-a9 "></div>
              </div>

              <div class="flex flex-col justify-start w-full"> <!-- Content col -->
                <div class="flex flex-row items-center justify-between">

                  <div class="flex flex-row">
                    <router-link :to="'/profile/' + comment.user.name" class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark
                      break-words hover:underline hover:cursor-pointer">
                      {{ comment.user.name }}
                    </router-link>
                    <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">
                      {{ formatDate(comment.updated_at) }}
                    </div>
                  </div>

                  <div>
                    <div class="relative flex flex-row" @click.prevent="openCommentDropdown(comment.id)">
                      <img :src="srcOptions" alt="openCommentMenu"
                           class="w-8 h-8 md:block rounded  hover:opacity-75 hover:cursor-pointer hover:scale-110"/>

                      <div v-show="selectedCommentDropdown === comment.id" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
                        <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
                          <li>
                            <div v-if="!isOwnerComment(comment.user.id)" @click.prevent="complainComment(comment.id, comment.user.id)" id="openComplaint"
                                 class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                              {{ $t('complaint-btn') }}
                            </div>
                            <div v-if="isOwnerComment(comment.user.id) || isOwner" @click.prevent="deleteComment(comment.id)"
                                 class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                              {{ $t('delete-btn') }}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <template v-if="comment.files.length > 0"><!-- Media row -->
                  <div class="ms-5 flex flex-wrap justify-start gap-1 items-center">
                    <div v-for="(file, index) in comment.files" :key="index"
                         class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12': comment.files.length > 1}">
                      <div class="relative w-full h-20 md:h-28" :class="{' h-12 md:h-16' : comment.files.length > 1 }">
                        <img :src="$store.getters.serverPath + '/api/comment-image/' + file.filename"
                             :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
                      </div>
                    </div>
                  </div>
                </template><!-- Media row -->

                <div class="ms-5 mt-3 mb-1 text-primary_text-light dark:text-primary_text-dark break-words">{{ comment.text }}</div>

                <div @click.prevent="selectReplyComment(comment.id)" class="ms-5 mt-3 italic
                  text-secondary_text-light dark:text-secondary_text-dark break-words hover:underline hover:cursor-pointer">
                  {{$t('make-answer')}}
                </div>

                <div v-if="this.selectedComment === comment.id">
                  <leave-comment @comment-created="commentCreated" :post_id="id" :reply_id="comment.id"/>
                </div>

                <div v-if="comment.lastPage" class="md:block h-px w-full bg-gray-a9 my-1"></div>

                <template v-for="reply in comment.replies"> <!-- Replied Comment -->
                  <div class="flex flex-row justify-between items-center mx-3 my-3"> <!-- First row -->
                    <div class="flex flex-row w-full">
                      <div class="items-center">
                        <router-link :to="'/profile/' + reply.user.name">
                          <img v-if="reply.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                               alt="Круглое изображение"
                               class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
                          <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + reply.user.image"
                               alt="Круглое изображение"
                               class="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"/>
                        </router-link>
                      </div>

                      <div class="flex flex-col justify-start w-full"> <!-- Content col -->
                        <div class="flex flex-row items-center justify-between">

                          <div class="flex flex-row">
                            <router-link :to="'/profile/' + reply.user.name" class="ms-5 font-semibold text-primary_text-light dark:text-primary_text-dark
                      break-words hover:underline hover:cursor-pointer">
                              {{ reply.user.name }}
                            </router-link>
                            <div class="ms-5 text-primary_text-light dark:text-primary_text-dark break-words">
                              {{ formatDate(reply.updated_at) }}
                            </div>
                          </div>

                          <div>
                            <div class="relative flex flex-row" @click.prevent="openCommentDropdown(reply.id)">
                              <img :src="srcOptions" alt="openReplyMenu"
                                   class="w-8 h-8 md:block rounded  hover:opacity-75 hover:cursor-pointer hover:scale-110"/>

                              <div v-show="selectedCommentDropdown === reply.id" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
                                <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
                                  <li>
                                    <div v-if="!isOwnerComment(comment.user.id)" @click.prevent="complainComment(comment.id)"
                                         class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                                      {{ $t('complaint-btn') }}
                                    </div>
                                    <div v-if="isOwner || isOwnerComment(comment.user.id)" @click.prevent="deleteComment(reply.id)" id="delete-reply-btn"
                                         class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                                      {{ $t('delete-btn') }}
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <template v-if="reply.files.length > 0"><!-- Media row -->
                          <div class="ms-5 flex flex-wrap justify-start gap-1 items-center">
                            <div v-for="(file, index) in reply.files" :key="index"
                                 class="p-2 flex flex-row justify-center relative" :class="{'md:w-5/12':  reply.files.length > 1}">
                              <div class="relative w-full h-20 md:h-28" :class="{' h-12 md:h-16' :  reply.files.length > 1 }">
                                <img :src="$store.getters.serverPath + '/api/comment-image/' + file.filename"
                                     :alt="'Media ' + (index + 1)" class="w-full h-full object-cover rounded-lg shadow-md">
                              </div>
                            </div>
                          </div>
                        </template><!-- Media row -->

                        <div class="ms-5 mt-3 text-primary_text-light dark:text-primary_text-dark break-words">{{ reply.text }}</div>

                      </div> <!-- Content col -->
                    </div>
                  </div>

                  <div class="md:block h-px w-full bg-gray-a9 my-2"></div>
                </template> <!-- Replied Comment -->
                <div @click.prevent="downloadReplies(comment.id)" v-if="comment.hasReplies > 0 && !comment.lastPage" class="ms-5 mt-3 italic
                  text-secondary_text-light dark:text-secondary_text-dark break-words hover:underline hover:cursor-pointer">
                  {{ $t('have-answers') }} {{comment.hasReplies}}
                </div>
                <div @click.prevent="downloadReplies(comment.id)" v-else-if="comment.lastPage > comment.currentPage" class="ms-5 mt-3 italic
                  text-secondary_text-light dark:text-secondary_text-dark break-words hover:underline hover:cursor-pointer">>
                  {{ $t('load-more') }} {{ comment.total - comment.replies.length }}
                </div>
              </div> <!-- Content col -->
            </div>
          </div>

          <div class="md:block h-px w-full bg-gray-a9 my-2"></div>
        </template> <!-- Comment -->

        <div v-if="this.lastPage >= this.page_id + 1" @click.prevent="getComments()" class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
          {{$t('download-btn') }}
        </div>
      </template>
    </div>
  </LayoutWithSidebar>
</template>
