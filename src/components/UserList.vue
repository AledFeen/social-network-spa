<script>
export default {
  name: 'UserList',
  props: ['page', 'typeId', 'id'],
  data() {
    return {
      users: null,
      lastPage: 1,
      page_id: 0
    }
  },

  mounted() {
    this.get()
  },

  methods: {

    get() {
      if (this.typeId === 'user') {
        if (this.page === 'subscriptions') {
          this.getSubscriptions()
        } else {
          this.getSubscribers()
        }
      } else {
        if(this.page === 'likes') {
          this.getLikes()
        } else if(this.page === 'search') {
          this.getSearchProfiles()
        }
      }
    },

    getSearchProfiles() {
      this.axios.get(this.$store.getters.serverPath + '/api/search-profile', {
        params: {
          'search_request': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if(this.lastPage >= this.page_id) {
            if(!this.users) {
              this.users = response.data.data
            } else {
              this.users.push(...response.data.data)
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

    getSubscriptions() {
      this.axios.get(this.$store.getters.serverPath + '/api/subscriptions', {
        params: {
          'user_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if(this.lastPage >= this.page_id) {
            if(!this.users) {
              this.users = response.data.data
            } else {
              this.users.push(...response.data.data)
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

    getSubscribers() {
      this.axios.get(this.$store.getters.serverPath + '/api/subscribers', {
        params: {
          'user_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if(this.lastPage >= this.page_id) {
            if(!this.users) {
              this.users = response.data.data
            } else {
              this.users.push(...response.data.data)
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

    getLikes() {
      this.axios.get(this.$store.getters.serverPath + '/api/likes', {
        params: {
          'post_id': this.id,
          'page_id': this.page_id += 1
        }
      })
        .then(response => {
          this.lastPage = response.data.last_page
          if(this.lastPage >= this.page_id) {
            if(!this.users) {
              this.users = response.data.data
            } else {
              this.users.push(...response.data.data)
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
    }

  }
}
</script>

<template>
  <div v-if="users && users.length > 0"
       class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3" :class="{'md:w-full': this.page === 'search'}">

    <template v-if="users" v-for="user in users">
      <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark mb-2">
        <div class="flex flex-row items-center justify-between py-2 px-4">
          <!-- Avatar container: square dimensions to prevent squashing -->
          <div class="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
            <img v-if="user.image === 'default_avatar'" src="/src/assets/default_avatar.png"
                 alt="Profile"
                 class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + user.image"
                 alt="Profile"
                 class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
          </div>
          <!-- User name: flexible width, centered text -->
          <div class="flex-grow text-center text-sm md:text-base text-primary_text-light dark:text-primary_text-dark">
            {{ user.name }}
          </div>
          <!-- Profile link button -->
          <router-link :to="`/profile/${user.name}`"
                       class="flex-shrink-0 w-24 md:w-32 py-1 px-3 text-sm md:text-base text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
            {{ $t('look-btn') }}
          </router-link>
        </div>
      </div>
    </template>

    <div v-if="this.lastPage >= this.page_id + 1" @click.prevent="get()" class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
      {{$t('download-btn') }}</div>

  </div>
  <div v-if="!users || users.length === 0">
    <div class="h-screen flex flex-col justify-center items-center text-primary_text-light dark:text-primary_text-dark">{{$t('nothing-found')}}</div>
  </div>
</template>
