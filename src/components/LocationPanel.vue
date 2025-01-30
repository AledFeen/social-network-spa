<script>
  import debounce from 'lodash/debounce';
  export default {
    name: "AddLocation",
    data(){
      return {
        locations: [],
        location: "",
      }
    },

    watch: {
      location: debounce(function(newValue, oldValue) {
        this.getLocations()
      }, 700),
    },

    methods: {
      addLocation(tag){
        this.$emit("location-selected", tag);
      },
      selectLocation(tag) {
        this.location = tag
      },
      getLocations() {
        this.axios.get(this.$store.getters.serverPath + '/api/locations', {
          params: {
            'search-text': this.location
          }
        })
          .then(response => {
            this.locations = response.data.data
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

      <div v-if="locations.length > 0" class="my-1 mx-3">
        <div v-for="location in locations" class="flex flex-row flex-wrap hover:cursor-pointer hover:underline" @click.prevent="selectLocation(location.name)">
          <div class="w-full break-words pe-2 text-secondary_text-light dark:text-secondary_text-dark"><span>{{location.name}}</span></div>
        </div>
      </div>

      <div class="px-3 my-1 flex flex-row w-full">
        <input v-model="location" :placeholder="$t('search-placeholder')" class="w-5/6 p-1 rounded-lg text-primary_text-light dark:text-primary_text-dark
          border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-primary_back-dark placeholder-gray-a9 focus:outline-none"/>
        <div @click.prevent="addLocation(location)" class="p-1 text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:scale-110">{{$t('save-btn')}}</div>
      </div>
    </div>

  </div>
</template>


