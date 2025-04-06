<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import router from "@/router/index.js";
import UserListChild from "@/components/UserList.vue";
import TagPanel from "@/components/TagPanel.vue";
import LocationPanel from "@/components/LocationPanel.vue";
import PostList from "@/components/PostList.vue";

export default {
  name: "Search",
  components: {PostList, LocationPanel, TagPanel, UserListChild, LayoutWithSidebar},

  beforeMount() {
  },

  data() {
    return {
      selectedMenu: "profile",
      profileName: "",
      searchResult: "",
      postText: "",
      tags: [],
      selectedTag: "",
      location: "",
      selectedLocation: "",
      key: 0
    };
  },

  methods: {
    changeType(menu) {
      this.selectedMenu = menu
    },

    loadResult(type) {
      this.searchResult = type
      this.key += 1
    },

    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
    },

    addLocation(location) {
      this.location = location
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

    searchProps() {
      let obj = {}
      obj.user = this.profileName
      obj.text = this.postText
      obj.tags = this.tags
      obj.location = this.location
      return obj
    }

  }
}

</script>

<template>
  <LayoutWithSidebar :page="'Search'">

    <div class="w-full md:w-3/4 my-3 md:my-5 mx-3 md:mx-5 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">
      <div class="flex flex-row items-center justify-center"> <!-- Theme -->
        <div class="flex flex-col">
          <div class="text-primary_text-light dark:text-primary_text-dark text-center">{{ $t('what-find') }}</div>
          <div class="flex items-center text-primary_text-light dark:text-primary_text-dark">
            <label class="flex items-center space-x-2 hover:cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="Profile"
                checked
                @change="() => changeType('profile')"
                class=" bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span>{{$t('profile')}}</span>
            </label>
            <label class="flex items-center space-x-2 ms-2 hover:cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="Post"
                @change="() => changeType('posts')"
                class="bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span>{{$t('post')}}</span>
            </label>
          </div>
        </div>
      </div> <!-- Theme -->

      <div v-if="selectedMenu === 'profile'">
         <input v-model="profileName" :placeholder="$t('user-placeholder')" class="w-full mb-1 py-3 ps-3 pe-3 h-8 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"/>

        <div @click.prevent="loadResult('profiles')" class="w-1/4 py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{$t('search')}}</div>

        <div v-if="searchResult === 'profiles'" class="w-full">
          <UserListChild :page="'search'" :id="profileName" :key="key"/>
        </div>
      </div>
      <div v-else>
        <input v-model="postText" :placeholder="$t('post-text-placeholder')" class="w-full mb-1 py-3 ps-3 pe-3 h-8 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"/>
        <div class="mt-3 flex flex-col md:flex-row justify-around">
          <input v-model="profileName" :placeholder="$t('user-placeholder')" class="w-60 mb-1 py-3 ps-3 pe-3 h-8 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"/>

          <div class="flex flex-col mt-1 md:mt-0">
            <location-panel @location-selected="addLocation" :search="true"></location-panel>
            <div v-if="location !== ''" @click.prevent="selectLocation()"
                 class="relative my-1 mx-3 w-full text-secondary_text-light dark:text-secondary_text-dark hover:cursor-pointer underline">
              {{ location }}
              <div v-if="selectedLocation === location" @click.prevent="deleteLocation()" class="absolute px-2 left-5 bottom-5 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1 hover:underline">
                {{ $t('delete-btn') }}
              </div>
            </div>
          </div>

          <div class="flex flex-col mt-2 md:mt-0">
            <tag-panel @tag-selected="addTag" :search="true"></tag-panel>
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
          </div>

        </div>
        <div @click.prevent="loadResult('posts')" class="w-1/4 mt-3 py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{$t('search')}}</div>
        <div v-if="searchResult === 'posts'" class="w-full">
          <PostList :page="'search'" :isOwner="false" :searchRequest="searchProps()" :key="key"/>
        </div>

      </div>
    </div>
  </LayoutWithSidebar>
</template>

<style>

</style>
