<script>
  import debounce from 'lodash/debounce';
  export default {
    name: "Sidebar",
    data(){
      return {
        tags: [],
        tag: "",
      }
    },

    watch: {
      tag: debounce(function(newValue, oldValue) {
        this.getTags()
      }, 700),
    },

    methods: {
      addTag(tag){
        this.$emit("tag-selected", tag);
      },
      selectTag(tag) {
        this.tag = tag
      },
      getTags() {
        this.axios.get(this.$store.getters.serverPath + '/api/search-tags', {
          params: {
            'search-text': this.tag
          }
        })
          .then(response => {
            this.tags = response.data.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

  }
</script>
<template>

  <div class="absolute w-60 left-3 bottom-0 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1">
    <div class="flex flex-col flex-wrap justify-center">

      <div v-if="tags.length > 0" class="my-1 mx-3">
        <div v-for="tag in tags" class="flex flex-row flex-wrap hover:cursor-pointer hover:underline" @click.prevent="selectTag(tag.name)">
          <div class="w-3/4 break-words pe-2 text-secondary_text-light dark:text-secondary_text-dark"><span>{{tag.name}}</span></div>
          <div class="w-1/4 text-secondary_text-light dark:text-secondary_text-dark">{{tag.count}}</div>
        </div>
      </div>

      <div class="px-3 my-1 flex flex-row w-full">
        <input v-model="tag" :placeholder="$t('post-placeholder')" class="w-5/6 p-1 mb-1 rounded-lg text-primary_text-light dark:text-primary_text-dark
          border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-primary_back-dark placeholder-gray-a9 focus:outline-none"/>
        <div @click.prevent="addTag(tag)" class="p-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:scale-110">Add</div>
      </div>
    </div>

  </div>
</template>


