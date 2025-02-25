<script>
  export default {
    name: "Complaint",
    props: ['id', 'user_id', 'type'],
    data() {
      return  {
        text: ""
      }
    },

    methods: {
      sendComplaint() {
        let ids = {
          post: null,
          comment: null,
          message: null
        };
        ids[this.type] = this.id;

        if(this.text.length > 10) {
          this.axios.post(this.$store.getters.serverPath + '/api/complaint', {
            user_id: this.user_id,
            post_id: ids.post,
            comment_id: ids.comment,
            message_id: ids.message,
            text: this.text
          }).then(res => {
            if (res.data.success) {
              this.$emit("complaint-sent", true);
            } else {
              alert(res.data.status)
            }
          }).catch(err => {
            console.log(err)
          })
        } else alert('Text must have more 10 symbols')

      },

      close() {
        this.$emit("complaint-sent", false);
      }

    }

  }
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div class="bg-secondary_back-light dark:bg-secondary_back-dark p-6 rounded-lg shadow-lg text-center max-w-sm w-full">

      <textarea v-model="text" :placeholder="$t('complain-placeholder')" class="mb-1 py-3 ps-3 pe-3 h-12 rounded-lg text-secondary_text-light dark:text-secondary_text-dark
      border border-gray-a9 border-solid border-opacity-50 dark:border-none dark:bg-secondary_back-dark placeholder-gray-a9 focus:outline-none"></textarea>

      <input @click.prevent="sendComplaint()" type="submit" :value="$t('complaint-btn')" class="w-40 me-3 mx-2 py-1 text-btn_text-light bg-btn_back-primary
        rounded-2xl hover:bg-btn_back-primary_hover hover:cursor-pointer drop-shadow-md">

      <input @click.prevent="close()" type="submit" :value="$t('close-btn')" class="w-40 mt-1 me-3 mx-2 py-1 text-btn_text-dark bg-btn_back-secondary
        rounded-2xl hover:bg-btn_back-secondary_hover hover:cursor-pointer drop-shadow-md">
    </div>
  </div>
</template>


