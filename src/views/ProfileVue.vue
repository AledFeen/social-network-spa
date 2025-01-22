<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import {data} from "autoprefixer";

export default {
  name: "Profile",
  components: {LayoutWithSidebar},
  props: ['id'],

  data() {
    return {
      profile: null,
      theme: localStorage.getItem('theme'),
      isDropdownOpen: false,
      isSubscriber: null
    }
  },

  watch: {
    $route(to, from) {
      this.getProfile()
    }
  },

  mounted() {
    this.getProfile()
    this.checkIsSubscriber()
  },

  computed: {
    isMyProfile() {
      return this.profile.name === this.$store.getters.user.name;
    },
  },

  methods: {
    getProfile() {
      this.axios.get(this.$store.getters.serverPath + '/api/profile', {
        params: {
          'user_id': this.id
        }
      }).then(response => {
        if (response.status === 200) {
          this.profile = response.data.data
        } else {
          //нужно добавить мультиязычные сообщения об ошибке
        }
      })
    },

    openDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },

    checkIsSubscriber() {
      this.axios.get(this.$store.getters.serverPath + '/api/check-subscription', {
        params: {
          'user_id': this.id
        }
      })
        .then(response => {
          this.isSubscriber = response.data.success
        })
        .catch(err => {
          console.log(err)
        })
    },

  }
}

</script>

<template>
  <LayoutWithSidebar :page="''">
    <div class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <div class="w-full rounded-lg bg-secondary_back-light dark:bg-secondary_back-dark">
        <div v-if="profile" class="w-full p-3 rounded-lg">
          <div class="w-full p-1 rounded-lg bg-primary_back-light dark:bg-primary_back-dark">
            <div class="flex flex-row">
              <div class="w-1/3 flex flex-col justify-center items-center py-3">
                <img v-if="profile.image === 'default_avatar'" src="/src/assets/default_avatar.jpg"
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

              <div class="w-1/3 flex flex-col">
                <div class="flex flex-row justify-between">
                  <div>
                    <div class="mb-2 mt-3 p-1 md:px-3 bg-btn_back-primary rounded-lg">
                      <div class="text-primary_text-dark font-semibold hover:cursor-pointer hover:underline">Підписки:
                        {{ profile.countFollowings }}
                      </div>
                      <div class="text-primary_text-dark font-semibold hover:cursor-pointer hover:underline">Підписники:
                        {{ profile.countFollowers }}
                      </div>
                    </div>

                    <div>
                      <div v-if="isMyProfile" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">
                        <router-link to="/edit-account">Редагувати</router-link>
                      </div>
                      <template v-else>
                        <div v-if="!isSubscriber && profile.accountType === 'private'" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">Підписатись
                        </div>
                        <div v-else-if="!isSubscriber" class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">Підписатись
                        </div>
                        <div v-else class="py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">Відписатись
                        </div>
                      </template>
                    </div>
                  </div>

                  <div>
                    <div class="relative" @click.prevent="openDropdown">
                      <img v-if="theme === 'light'" src="/src/assets/options-light.svg" alt="Settings"
                           class="w-8 h-8 md:block image-class rounded  hover:opacity-75 hover:cursor-pointer "/>
                      <img v-else src="/src/assets/options-dark.svg" alt="Settings"
                           class="w-8 h-8 md:block image-class rounded hover:opacity-75 hover:cursor-pointer"/>

                      <div v-show="isDropdownOpen" class="absolute top-1 w-40 right-12 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10">
                        <ul class="py-1 text-primary_text-light dark:text-primary_text-dark">
                          <li>
                            <div class="block px-4 py-2 hover:cursor-pointer hover:underline hover:opacity-75">
                              Пункт меню
                            </div>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="flex flex-row mb-2">
              <div v-if="profile.about" class="w-2/3 ms-2 mt-1 mb-2 text-primary_text-light dark:text-primary_text-dark break-words">
                {{ profile.about }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </LayoutWithSidebar>

</template>

<style>

</style>
