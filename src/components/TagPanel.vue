<script>
  import debounce from 'lodash/debounce';
  export default {
    name: "AddTag",
    props: ['search'],
    data(){
      return {
        tags: [],
        tag: "",
        ignoreWatch: false,
      }
    },

    watch: {
      tag: debounce(function(newValue, oldValue) {
        if (this.ignoreWatch) return; // Используем локальную переменную
        this.getTags();
      }, 700),
    },

    methods: {
      addTag(tag){
        if(tag !== '') {
          this.ignoreWatch = true;
          this.tag = "";
          this.tags = [];
          this.$emit("tag-selected", tag);

          setTimeout(() => {
            this.ignoreWatch = false;
          }, 800);
        }
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

  <div class="w-60 rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none bg-secondary_back-light dark:bg-secondary_back-dark z-10 mx-1" :class="{'absolute left-3 bottom-0': !search}">
    <div class="flex flex-col flex-wrap justify-center">

      <div v-if="tags.length > 0" class="my-1 mx-3">
        <div v-for="tag in tags" class="flex flex-row flex-wrap hover:cursor-pointer hover:underline" @click.prevent="selectTag(tag.name)">
          <div class="w-3/4 break-words pe-2 text-secondary_text-light dark:text-secondary_text-dark"><span>{{tag.name}}</span></div>
          <div class="w-1/4 text-secondary_text-light dark:text-secondary_text-dark">{{tag.count}}</div>
        </div>
      </div>

      <div class="px-3 my-1 flex flex-row w-full">
        <input v-model="tag" :placeholder="$t('search-tag-placeholder')" class="w-5/6 p-1 rounded-lg text-primary_text-light dark:text-primary_text-dark
          border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-primary_back-dark placeholder-gray-a9 focus:outline-none"/>
        <div @click.prevent="addTag(tag)" class="p-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:scale-110">{{$t('add-btn')}}</div>
      </div>
    </div>
  </div>

</template>


