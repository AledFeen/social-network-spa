<script>
export default {
  name: "Verify",
  props: ['link'],

  data() {
    return {
      message: ""
    }
  },

  computed: {
    fullLink() {
      const queryString = new URLSearchParams(this.$route.query).toString();
      return queryString ? `${this.link}?${queryString}` : this.link;
    },
  },

  mounted() {
    this.verify()
  },

  methods: {

    verify() {
      this.axios.get('http://localhost:8000/email/verify/' + this.fullLink).then(res => {
        console.log(res)
        if (res.data.success === "true") {
          this.message = this.$t("success-verified")
        }
      }).catch(err => {
        this.message = this.$t('error-status') + " " + err.response.status
      })
    }

  }
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col sm:w-1/2 md:w-1/3 lg:w-1/4 pt-10 pb-10 ps-5 pe-5">
      <div class="text-xl text-center text-primary_text-light dark:text-primary_text-dark">{{ message }}</div>
      <RouterLink to="/" class="text-center mt-5 text-link-light dark:text-link-dark hover:cursor-pointer hover:underline">{{$t('back-link')}}</RouterLink>
    </div>
  </div>
</template>

<style>

</style>
