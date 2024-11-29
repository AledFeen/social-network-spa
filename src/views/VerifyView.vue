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
        console.log(err)
      })
    }

  }
}

</script>

<template>
  <main>
    <p>{{ message }}</p>
  </main>

</template>

<style>

</style>
