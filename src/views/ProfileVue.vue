<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import ModalMessage from "@/components/ModalMessage.vue";
import CreatePost from "@/components/CreatePost.vue";
import PostList from "@/components/PostList.vue";
import UserListChild from "@/components/UserList.vue";
import ModalComplaint from "@/components/ModalComplaint.vue";

export default {
  name: "Profile",
  components: {UserListChild, PostList, ModalMessage, LayoutWithSidebar, CreatePost, ModalComplaint},
  props: ['username'],

  data() {
    return {
      profile: null,
      theme: localStorage.getItem('theme'),
      isDropdownOpen: false,
      subscriber: null,
      isSubscriber: null,
      banned: null,
      isBanned: null,
      wasRequestSent: null,
      isModalVisible: false,
      modalMessage: null,
      modalComplaint: false,
      postsVisible: false,
      postsKey: 0,
      chat: null
    }
  },

  watch: {
    $route(to, from) {
      this.getProfile()
    }
  },

  beforeMount() {
    this.getProfile()
  },

  mounted() {

  },

  computed: {
    isMyProfile() {
      return this.profile.name === this.$store.getters.user.name;
    },

    shouldDisplaySubs() {
      return this.isMyProfile || !this.isBanned && this.profile.accountType === 'public' || this.profile.accountType === 'private' && this.subscriber
    },

    srcOptions() {
      return this.theme === 'light' ? '/src/assets/options.svg' : '/src/assets/options-dark.svg'
    },

    computedCanMessage() {
      if(this.profile) {
        if(this.isMyProfile) {
          return false
        } else {
          switch (this.profile.whoCanMessage)
          {
            case 'all':
              return true
            case 'only_subscribers':
              return this.subscriber
            case 'only_my_subscriptions':
              return this.isSubscriber
            case 'none':
              return false
            default:
              return false
          }
        }
      }
    }

  },

  methods: {
    getProfile() {
      this.axios.get(this.$store.getters.serverPath + '/api/profile', {
        params: {
          'username': this.username
        }
      }).then(response => {
        if (response.status === 200) {
          this.profile = response.data.data
          this.checkRelations()
          if(!this.isMyProfile) {
            this.getChatId()
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

    getChatId() {
      this.axios.get(this.$store.getters.serverPath + '/api/chatId', {
        params: {
          'user_id': this.profile.id,
        }
      })
        .then(response => {
          this.chat = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    openDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },

    checkRelations() {
      this.axios.get(this.$store.getters.serverPath + '/api/check-relations', {
        params: {
          'user_id': this.profile.id
        }
      })
        .then(response => {
          this.subscriber = response.data.subscription
          this.isSubscriber = response.data.subscriber
          this.wasRequestSent = response.data.request
          this.banned = response.data.banned
          this.isBanned = response.data.isBanned
          this.postsVisible = true
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    subscribe() {
      this.axios.post(this.$store.getters.serverPath + '/api/subscribe', {
        'user_id': this.profile.id,
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    unsubscribe() {
      this.axios.delete(this.$store.getters.serverPath + '/api/unsubscribe', {
        params: {
          'user_id': this.profile.id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    sendSubscribeRequest() {
      this.axios.post(this.$store.getters.serverPath + '/api/subscribe-request', {
        'user_id': this.profile.id,
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    deleteSubscriber() {
      this.axios.delete(this.$store.getters.serverPath + '/api/delete-subscriber', {
        params: {
          'user_id': this.profile.id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    blockUser() {
      this.axios.post(this.$store.getters.serverPath + '/api/block-user', {
        'user_id': this.profile.id,
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    unblockUser() {
      this.axios.delete(this.$store.getters.serverPath + '/api/unblock-user', {
        params: {
          'user_id': this.profile.id
        }
      }).then(res => {
        if (res.data.success) {
          this.showModal(this.$t('success-request'))
          this.getProfile()
        } else {
          this.showModal(this.$t('failed-request'))
        }
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

    createPost(isSuccess) {
      if (isSuccess) {
        this.showModal(this.$t('success-request'))
        this.postsKey++
      } else {
        this.showModal(this.$t('failed-request'))
      }
    },

    deletePost(isSuccess) {
      if (isSuccess) {
        this.showModal(this.$t('success-request'))
      } else {
        this.showModal(this.$t('failed-request'))
      }
    },

    complain() {
      this.modalComplaint = !this.modalComplaint
    },

    CheckSendComplaint(isSuccess) {
      if (isSuccess) {
        this.modalComplaint = false
        this.showModal(this.$t('success-request'))
      } else {
        this.modalComplaint = false
      }
    }

  }
}

</script>

<template>
  <LayoutWithSidebar :page="''">
    <template v-if="isModalVisible">
      <ModalMessage :message="modalMessage"/>
    </template>

    <template v-if="modalComplaint">
      <ModalComplaint :id="this.profile.id" :user_id="this.profile.id" :type="'user'"  @complaint-sent="CheckSendComplaint"></ModalComplaint>
    </template>

    <div class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark">
        <div v-if="profile" class="w-full p-3 rounded-lg">
          <div class="w-full p-1 rounded-lg bg-primary_back-light dark:bg-primary_back-dark">
            <div class="flex flex-row">
              <div class="w-1/3 flex flex-col justify-center items-center py-3">
                <img v-if="profile.image === 'default_avatar'" src="/src/assets/default_avatar.png"
                     alt="Круглое изображение"
                     class="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"/>
                <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + profile.image"
                     alt="Круглое изображение"
                     class="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"/>
              </div>
              <div class="w-1/3 flex flex-col py-3 px-1 justify-center">
                <div v-if="profile.name"
                     class="mt-2 mb-1 font-semibold text-primary_text-light dark:text-primary_text-dark break-words">
                  {{ profile.name }}
                </div>
                <div v-if="profile.realName"
                     class="my-1 text-primary_text-light dark:text-primary_text-dark break-words">{{ profile.realName }}
                </div>
                <div v-if="profile.birthday"
                     class="my-1 text-secondary_text-light dark:text-secondary_text-dark break-words">
                  {{ profile.birthday }}
                </div>
                <div v-if="profile.location"
                     class="my-1 italic text-secondary_text-light dark:text-secondary_text-dark break-words">
                  {{ profile.location }}
                </div>

              </div>

              <div class="w-1/3 flex flex-col justify-center">
                <div class="flex flex-row justify-between">
                  <div>
                    <div v-if="shouldDisplaySubs" class="mb-2 mt-3 p-1 md:px-3 bg-btn_back-primary rounded-lg">
                      <router-link :to="`/subscriptions/${profile.id}`"
                                   class="text-primary_text-dark font-semibold hover:cursor-pointer hover:underline">
                        {{ $t('subscriptions-label') }}:
                        {{ profile.countFollowings }}
                      </router-link>
                      <div>
                        <router-link :to="`/subscribers/${profile.id}`"
                                     class="text-primary_text-dark font-semibold hover:cursor-pointer hover:underline">
                          {{ $t('subscribers-label') }}:
                          {{ profile.countFollowers }}
                        </router-link>
                      </div>
                    </div>

                    <div v-if="!isBanned">
                      <div v-if="isMyProfile" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">
                        <router-link to="/edit-account">{{ $t('edit-btn') }}</router-link>
                      </div>
                      <template v-else>
                        <div v-if="!subscriber && profile.accountType === 'private' && !wasRequestSent"
                             @click.prevent="sendSubscribeRequest()" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{ $t('subscribe-btn') }}
                        </div>
                        <div v-else-if="!subscriber && profile.accountType === 'private' && wasRequestSent" @click.prevent="unsubscribe()" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl cursor-pointer
                   drop-shadow-md">{{ $t('sent-request-message') }}
                        </div>
                        <div v-else-if="!subscriber" @click.prevent="subscribe()" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{ $t('subscribe-btn') }}
                        </div>
                        <div v-else @click.prevent="unsubscribe()" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{ $t('unsubscribe-btn') }}
                        </div>
                      </template>
                    </div>
                    <div v-if="banned" class="text-btn_back-primary my-1">{{ $t('user-banned-message') }}</div>
                  </div>
                </div>
              </div>
              <div v-if="profile">
                <div class="relative" @click.prevent="openDropdown">
                  <img :src="srcOptions" alt="profileSettings"
                       class="w-8 h-8 md:block image-class rounded  hover:opacity-75 hover:cursor-pointer hover:scale-110"/>

                  <div v-show="isDropdownOpen" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
                    <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
                      <li>
                        <div v-if="isSubscriber" @click.prevent="deleteSubscriber()"
                             class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                          {{ $t('delete-subscriber-btn') }}
                        </div>
                        <div v-if="!banned && !isMyProfile" @click.prevent="blockUser()"
                             class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                          {{ $t('ban-btn') }}
                        </div>
                        <div v-else-if="!isMyProfile" @click.prevent="unblockUser()"
                             class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                          {{ $t('unban-btn') }}
                        </div>
                        <router-link to="/blocked-list" v-if="isMyProfile" @click.prevent="deleteSubscriber()"
                                     class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                          {{ $t('blocked-btn') }}
                        </router-link>
                        <template v-if="computedCanMessage">
                          <div v-if="chat">
                            <router-link :to="`/chat/${chat.id}`"  class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                              {{ $t('message-btn') }}
                            </router-link>
                          </div>
                          <div v-else>
                            <router-link :to="`/chat/n_${profile.id}`"  class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                              {{ $t('message-btn') }}
                            </router-link>
                          </div>
                        </template>
                        <div v-if="!isMyProfile" @click.prevent="complain()"
                             class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                          {{ $t('complaint-btn') }}
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
            <div class="flex flex-row mb-2">
              <div v-if="profile.about"
                   class="w-2/3 ms-2 mt-1 mb-2 text-primary_text-light dark:text-primary_text-dark break-words">
                {{ profile.about }}
              </div>
            </div>

          </div>
          <div v-if="isMyProfile">
            <CreatePost @post-created="createPost"/>
          </div>
        </div>
      </div>

      <template v-if="postsVisible">
        <div v-if="shouldDisplaySubs">
          <PostList :key="postsKey" :id="profile.id" :page="'profile'" :is-owner="isMyProfile" @post-deleted="deletePost" @complaint-sent="deletePost"/>
        </div>
        <div v-else class="m-5 w-full flex flex-row justify-center"><h1
          class="text-lg text-primary_text-light dark:text-primary_text-dark">{{$t('nothing')}}</h1></div>
      </template>
    </div>
  </LayoutWithSidebar>

</template>

<style>

</style>
