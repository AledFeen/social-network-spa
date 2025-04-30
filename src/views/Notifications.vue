<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import ModalMessage from "@/components/ModalMessage.vue";
import dayjs from "dayjs";

export default {
  name: 'Notifications',
  components: {LayoutWithSidebar, ModalMessage},

  data() {
    return {
      requestCount: null,
      followers: [],
      likes: [],
      comments: [],
      replies: [],
      reposts: [],
      isModalVisible: false,
      modalMessage: null,
      selectedMenu: 'like'
    }
  },

  mounted() {
    this.getSubRequestsCount()
    this.getFollowers()
    this.getLikes()
    this.getComments()
    this.getReplies()
    this.getReposts()
  },

  computed: {
    srcRepost() {
      return this.theme === 'light' ? '/src/assets/repost.svg' : '/src/assets/repost-dark.svg'
    },

    srcComment() {
      return this.theme === 'light' ? '/src/assets/comment.svg' : '/src/assets/comment-dark.svg'
    },

    srcLike() {
      return this.theme === 'light' ? '/src/assets/heart.svg' : '/src/assets/heart-dark.svg'
    },

    srcSub() {
      return this.theme === 'light' ? '/src/assets/sub.svg' : '/src/assets/sub-dark.svg'
    },

  },

  methods: {
    getSubRequestsCount() {
      this.axios.get(this.$store.getters.serverPath + '/api/subscription-requests-count')
        .then(response => {
          this.requestCount = response.data.requestCount
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    getFollowers() {
      this.axios.get(this.$store.getters.serverPath + '/api/notification/followers')
        .then(response => {
          this.followers = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deleteFollowers() {
      this.axios.delete(this.$store.getters.serverPath + '/api/notification/followers').then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.followers = []
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.showModal(this.$t('failed-request'))
      })
    },

    getLikes() {
      this.axios.get(this.$store.getters.serverPath + '/api/notification/likes')
        .then(response => {
          this.likes = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deleteLikes() {
      this.axios.delete(this.$store.getters.serverPath + '/api/notification/likes').then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.likes = []
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.showModal(this.$t('failed-request'))
      })
    },

    getComments() {
      this.axios.get(this.$store.getters.serverPath + '/api/notification/comments')
        .then(response => {
          this.comments = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deleteComments() {
      this.axios.delete(this.$store.getters.serverPath + '/api/notification/comments').then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.comments = []
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.showModal(this.$t('failed-request'))
      })
    },

    getReplies() {
      this.axios.get(this.$store.getters.serverPath + '/api/notification/comment-replies')
        .then(response => {
          this.replies = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deleteCommentReplies() {
      this.axios.delete(this.$store.getters.serverPath + '/api/notification/comment-replies').then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.replies = []
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.showModal(this.$t('failed-request'))
      })
    },

    getReposts() {
      this.axios.get(this.$store.getters.serverPath + '/api/notification/reposts')
        .then(response => {
          this.reposts = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    deleteReposts() {
      this.axios.delete(this.$store.getters.serverPath + '/api/notification/reposts').then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.reposts = []
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
        this.showModal(this.$t('failed-request'))
      })
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },

    showModal(message) {
      this.modalMessage = message;
      this.isModalVisible = true;

      setTimeout(() => {
        this.isModalVisible = false;
      }, 500);
    },

    selectMenu(name) {
      this.selectedMenu = name
    }

  }
}
</script>

<template>
  <LayoutWithSidebar :page="'Notifications'">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>

    <div class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">


      <div class="flex flex-row justify-center">

        <div @click.prevent="selectMenu('like')" class="flex flex-row items-center rounded hover:opacity-75 hover:cursor-pointer ms-5 me-5" :class="{'bg-btn_back-primary': selectedMenu === 'like'}">
          <div class="rounded">
            <img :src="srcLike" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <div class="ms-1 me-3 text-primary_text-light dark:text-primary_text-dark">
            {{likes.length}}
          </div>
        </div>

        <div @click.prevent="selectMenu('sub')" class="flex flex-row items-center rounded hover:opacity-75 hover:cursor-pointer ms-5 me-5" :class="{'bg-btn_back-primary': selectedMenu === 'sub'}">
          <div class="rounded">
            <img :src="srcSub" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <div class="ms-1 me-3 text-primary_text-light dark:text-primary_text-dark">
            {{requestCount + followers.length}}
          </div>
        </div>

        <div @click.prevent="selectMenu('comment')" class="flex flex-row items-center rounded hover:opacity-75 hover:cursor-pointer ms-5 me-5" :class="{'bg-btn_back-primary': selectedMenu === 'comment'}">
          <div class="rounded">
            <img :src="srcComment" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <div class="ms-1 me-3 text-primary_text-light dark:text-primary_text-dark">
            {{ comments.length + replies.length }}
          </div>
        </div>

        <div @click.prevent="selectMenu('repost')" class="flex flex-row items-center rounded hover:opacity-75 hover:cursor-pointer ms-5 me-5" :class="{'bg-btn_back-primary': selectedMenu === 'repost'}">
          <div class="rounded">
            <img :src="srcRepost" alt="Image"
                 class="image-class rounded ms-2"/>
          </div>
          <div class="ms-1 me-3 text-primary_text-light dark:text-primary_text-dark">
            {{ reposts.length }}
          </div>
        </div>
      </div>

      <div v-if="selectedMenu === 'sub' && requestCount !== null" class="w-full mt-3">
        <div v-if="requestCount" class="flex flex-row justify-between mx-3">
          <div class="mt-2 text-primary_text-light dark:text-primary_text-dark">{{ $t('count-request-message') }}
            {{ requestCount }}
          </div>
          <router-link to="/sub-requests" class="py-1 px-3 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md"> {{ $t('look-btn') }}
          </router-link>
        </div>
        <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-request-message') }}</div>
      </div>

      <div v-if="selectedMenu === 'sub'" class="flex flex-col">
        <div class="flex flex-row justify-end" v-if="followers.length > 0">
          <div @click.prevent="deleteFollowers"
               class="me-3 mt-3 text-end text-secondary_text-light dark:text-secondary_text-dark hover:underline hover:cursor-pointer">
            {{ $t('clear-btn') }}
          </div>
        </div>
        <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-notifications-message') }}</div>

        <div v-for="follow in followers" class="flex flex-row items-center mt-1">
          <router-link :to="`/profile/${follow.follower.name}`">
            <img v-if="follow.follower.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + follow.follower.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
          </router-link>

          <router-link :to="`/profile/${follow.follower.name}`"
                       class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
            {{ follow.follower.name }}
          </router-link>
          <div class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{ formatDate(follow.created_at) }}
          </div>
        </div>
      </div>

      <div v-if="selectedMenu === 'like'" class="flex flex-col">
        <div class="flex flex-row justify-end" v-if="likes.length > 0">
          <div @click.prevent="deleteLikes"
               class="me-3 mt-3 text-end text-secondary_text-light dark:text-secondary_text-dark hover:underline hover:cursor-pointer">
            {{ $t('clear-btn') }}
          </div>
        </div>
        <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-notifications-message') }}</div>

        <div v-for="like in likes" class="flex flex-row items-center mt-1">
          <router-link :to="`/profile/${like.user.name}`">
            <img v-if="like.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + like.user.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
          </router-link>

          <router-link :to="`/profile/${like.user.name}`"
                       class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
            {{ like.user.name }}
          </router-link>
          <router-link :to="`/post/${like.post_id}`"
                       class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
            {{$t('liked-post')}} <b>{{ like.post_id }}</b></router-link>
          <div class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{ formatDate(like.created_at) }}</div>
        </div>
      </div>

      <div v-if="selectedMenu === 'repost'" class="flex flex-col">
        <div class="flex flex-row justify-end" v-if="reposts.length > 0">
          <div @click.prevent="deleteReposts"
               class="me-3 mt-3 text-end text-secondary_text-light dark:text-secondary_text-dark hover:underline hover:cursor-pointer">
            {{ $t('clear-btn') }}
          </div>
        </div>
        <div v-else class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-notifications-message') }}</div>

        <div v-for="repost in reposts" class="flex flex-row items-center mt-1">
          <router-link :to="`/profile/${repost.user.name}`">
            <img v-if="repost.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + repost.user.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 object-cover rounded-full"/>
          </router-link>

          <router-link :to="`/profile/${repost.user.name}`"
                       class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
            {{ repost.user.name }}
          </router-link>
          <router-link :to="`/post/${repost.post_id}`"
                       class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
            {{$t('make-repost')}} <b>{{ repost.post_id }}</b></router-link>
          <div class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{ formatDate(repost.created_at) }}
          </div>
        </div>
      </div>

      <div v-if="selectedMenu === 'comment'" class="flex flex-col">
        <div class="flex flex-row justify-end" v-if="comments.length > 0">
          <div @click.prevent="deleteComments"
               class="me-3 mt-3 text-end text-secondary_text-light dark:text-secondary_text-dark hover:underline hover:cursor-pointer">
            {{ $t('clear-btn') }}
          </div>
        </div>

        <div v-for="comment in comments" class="flex flex-col mt-1">
          <div class="flex flex-row mb-1  items-center">
            <router-link :to="`/profile/${comment.user.name}`">
              <img v-if="comment.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                   alt="Круглое изображение"
                   class="w-8 h-8 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + comment.user.image"
                   alt="Круглое изображение"
                   class="w-8 h-8 object-cover rounded-full"/>
            </router-link>

            <router-link :to="`/profile/${comment.user.name}`"
                         class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
              {{ comment.user.name }}
            </router-link>
            <router-link :to="`/post/${comment.post_id}`"
                         class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
              {{$t('for-post')}}<b>{{ comment.post_id }}</b></router-link>
            <div class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{ formatDate(comment.created_at) }}
            </div>
          </div>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{ comment.text }}</div>
        </div>
      </div>

      <div v-if="selectedMenu === 'comment'" class="flex flex-col">
        <div class="flex flex-row justify-end" v-if="replies.length > 0">
          <div @click.prevent="deleteCommentReplies"
               class="me-3 mt-3 text-end text-secondary_text-light dark:text-secondary_text-dark hover:underline hover:cursor-pointer">
            {{ $t('clear-btn') }}
          </div>
        </div>
        <div v-if="comments.length + replies.length === 0" class="text-primary_text-light dark:text-primary_text-dark">{{ $t('no-notifications-message') }}</div>

        <div v-for="reply in replies" class="flex flex-col mt-1">
          <div class="flex flex-row mb-1  items-center">
            <router-link :to="`/profile/${reply.user.name}`">
              <img v-if="reply.user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                   alt="Круглое изображение"
                   class="w-8 h-8 object-cover rounded-full"/>
              <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + reply.user.image"
                   alt="Круглое изображение"
                   class="w-8 h-8 object-cover rounded-full"/>
            </router-link>

            <router-link :to="`/profile/${reply.user.name}`"
                         class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
              {{ reply.user.name }}
            </router-link>
            <router-link :to="`/post/${reply.post_id}`"
                         class="ms-3 text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
              {{$t('for-post')}} <b>{{ reply.post_id }}</b></router-link>
            <div class="ms-3 text-primary_text-light dark:text-primary_text-dark">{{ formatDate(reply.created_at) }}
            </div>
          </div>
          <div class="text-primary_text-light dark:text-primary_text-dark">{{ reply.text }}</div>
        </div>
      </div>

    </div>

  </LayoutWithSidebar>
</template>
