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
        }
      }
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
        .catch(err => {
          console.log(err)
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
        .catch(err => {
          console.log(err)
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
        .catch(err => {
          console.log(err)
        })
    }

  }
}
</script>

<template>
  <div v-if="users && users.length > 0"
       class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">

    <template v-if="users" v-for="user in users">
      <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark mb-1">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-center items-center py-2 ms-10">
            <img v-if="user.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
            <img v-else :src="$store.getters.serverPath + '/api/profile-image/' + user.image"
                 alt="Круглое изображение"
                 class="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full"/>
          </div>
          <div class="flex flex-col justify-center items-center py-3 text-primary_text-light dark:text-primary_text-dark">{{ user.name }}</div>
          <router-link :to="`/profile/${user.name}`" class="w-40 me-10 mx-2 my-4 py-1 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover drop-shadow-md">
            <div>{{$t('look-btn')}}</div>
          </router-link>
        </div>
      </div>
    </template>

    <div v-if="this.lastPage >= this.page_id + 1" @click.prevent="get()" class="flex justify-center text-primary_text-light dark:text-primary_text-dark hover:underline hover:cursor-pointer">
      {{$t('download-btn') }}</div>

  </div>
  <div v-if="!users">
    <div class="h-screen flex flex-col justify-center items-center text-primary_text-light dark:text-primary_text-dark">{{$t('nothing-found')}}</div>
  </div>
</template>
