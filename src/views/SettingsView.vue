<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import router from "@/router/index.js";
import TagPanel from "@/components/TagPanel.vue";

export default {
  name: "Settings",
  components: {TagPanel, LayoutWithSidebar},

  beforeMount() {
    this.getPrivacy()
    this.getTags()
  },

  data() {
    return {
      currentLocale: this.$i18n.locale,
      currentTheme: localStorage.getItem('theme'),
      privacySettings: null,
      tags: [],
      selectedTag: "",
    };
  },

  methods: {
    getTags() {
      this.axios.get(this.$store.getters.serverPath + '/api/preferredTags')
        .then(response => {
          this.tags = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    changeLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem('appLocale', locale);
    },

    changeTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('theme', theme)
      location.reload();
    },

    getPrivacy() {
      this.axios.get(this.$store.getters.serverPath + '/api/privacy-settings')
        .then(response => {
          this.privacySettings = response.data.data
        })
        .catch(async err => {
          const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
            err,
            locale: this.$i18n.locale
          });
          alert(translatedMessage);
        })
    },

    changePrivacy() {
      this.axios.put(this.$store.getters.serverPath + '/api/privacy-settings', {
        'account_type': this.privacySettings.account_type,
        'who_can_comment': this.privacySettings.who_can_comment,
        'who_can_repost': this.privacySettings.who_can_repost,
        'who_can_message': this.privacySettings.who_can_message,
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    selectTag(tag) {
      this.selectedTag = this.selectedTag === tag ? "" : tag
    },

    deleteTag(tag) {
      this.axios.delete(this.$store.getters.serverPath + '/api/preferredTag', {
        params: {
          'id': tag.id
        }
      }).then(res => {
        if (res.data.success) {
          this.tags.splice(this.tags.indexOf(tag), 1)
        }
      }).catch(async err => {
        const translatedMessage = await this.$store.dispatch('handleErrorMessage', {
          err,
          locale: this.$i18n.locale
        });
        alert(translatedMessage);
      })
    },

    addTag(tag)
    {
      this.axios.post(this.$store.getters.serverPath + '/api/preferredTag', {
        'text': tag
      }).then(res => {
        if(res.data.success) {
          this.getTags()
        }
      }).catch(async err => {
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
  <LayoutWithSidebar :page="'Settings'">
    <div class="block w-full mx-1 md:w-2/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">

      <div class="flex flex-row">
        <div class="flex flex-row items-center w-1/2 justify-center"> <!-- Theme -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{$t('theme-text')}}</div>
            <div class="flex items-center text-primary_text-light dark:text-primary_text-dark">
              <label class="flex items-center space-x-2 hover:cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  :checked="currentTheme === 'light'"
                  @change="() => changeTheme('light')"
                  class=" bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span>{{$t('light')}}</span>
              </label>
              <label class="flex items-center space-x-2 ms-2 hover:cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  :checked="currentTheme=== 'dark'"
                  @change="() => changeTheme('dark')"
                  class="bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span>{{$t('dark')}}</span>
              </label>
            </div>
          </div>


        </div> <!-- Theme -->

        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- Language-->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{ $t('language-text') }}</div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Choose language</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="currentLocale"
                @change="changeLocale(currentLocale)">

                <option value="en" class="hover:cursor-pointer hover:opacity-75">{{ $t('english') }}</option>
                <option value="ua" class="hover:cursor-pointer hover:opacity-75">{{ $t('ukrainian') }}</option>
              </select>
            </div>
          </div>
        </div> <!-- Language-->
      </div>

      <div v-if="privacySettings" class="mt-2 flex flex-row">
        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- Account type -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{ $t('account-type') }}</div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Choose account type</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="privacySettings.account_type"
                @change="changePrivacy()">

                <option value="public" class="hover:cursor-pointer hover:opacity-75">{{ $t('public-text') }}</option>
                <option value="private" class="hover:cursor-pointer hover:opacity-75">{{ $t('private-text') }}</option>
              </select>
            </div>
          </div>
        </div> <!--  Account type  -->

        <div v-if="privacySettings"  class="flex flex-row items-center  justify-center w-1/2"> <!-- Can comment -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{ $t('who-can-comment') }}</div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Choose who can comment</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="privacySettings.who_can_comment"
                @change="changePrivacy()">

                <option value="all" class="hover:cursor-pointer hover:opacity-75">{{ $t('all') }}</option>
                <option value="only_subscribers" class="hover:cursor-pointer hover:opacity-75">{{ $t('subscribers') }}</option>
                <option value="none" class="hover:cursor-pointer hover:opacity-75">{{$t('none')}}</option>
              </select>
            </div>
          </div>
        </div> <!--  Can comment  -->
      </div>

      <div v-if="privacySettings"  class="mt-2 flex flex-row">
        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- Can repost -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{ $t('who-can-repost') }}</div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Choose who can repost</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="privacySettings.who_can_repost"
                @change="changePrivacy()">

                <option value="all" class="hover:cursor-pointer hover:opacity-75">{{ $t('all') }}</option>
                <option value="only_subscribers" class="hover:cursor-pointer hover:opacity-75">{{ $t('subscribers') }}</option>
                <option value="none" class="hover:cursor-pointer hover:opacity-75">{{$t('none')}}</option>
              </select>
            </div>
          </div>
        </div> <!--  Can repost  -->

        <div v-if="privacySettings"  class="flex flex-row items-center  justify-center w-1/2"> <!-- Can message -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{ $t('who-can-message') }}</div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Choose who can send messages</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="privacySettings.who_can_message"
                @change="changePrivacy()">

                <option value="all" class="hover:cursor-pointer hover:opacity-75">{{ $t('all') }}</option>
                <option value="only_subscribers" class="hover:cursor-pointer hover:opacity-75">{{ $t('subscribers') }}</option>
                <option value="only_my_subscriptions" class="hover:cursor-pointer hover:opacity-75">{{ $t('subscriptions') }}</option>
                <option value="none" class="hover:cursor-pointer hover:opacity-75">{{$t('none')}}</option>
              </select>
            </div>
          </div>
        </div> <!--  Can message  -->

      </div>

      <div class="flex flex-col mt-5 md:mt-0">
        <div class="mt-2 relative flex flex-row justify-center">
          <tag-panel @tag-selected="addTag" :search="true"></tag-panel>
        </div>

        <div v-if="tags.length > 0" class="flex flex-row flex-wrap my-1 ms-1">
          <template v-for="tag in tags">
            <div @click.prevent="selectTag(tag)"
                 class="relative mx-2 px-3 p-1 mt-1 text-primary_text-light dark:text-primary_text-dark bg-secondary_back-light dark:bg-secondary_back-dark hover:cursor-pointer rounded-2xl">
              {{ tag.tag }}
              <div v-if="selectedTag === tag" @click.prevent="deleteTag(tag)" class="absolute px-2 left-5 bottom-8 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1 hover:underline">
                {{ $t('delete-btn') }}
              </div>
            </div>
          </template>
        </div>
      </div>





    </div>
  </LayoutWithSidebar>
</template>

<style>

</style>
