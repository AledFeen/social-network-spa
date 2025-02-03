<script>
  import UserListChild from "/src/components/UserList.vue";
  import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";

  export default {
    name: 'Post Likes',
    components: {LayoutWithSidebar, UserListChild },
    props: ['id'],
  }
</script>

<template>
  <LayoutWithSidebar :page="''">
    <UserListChild :id="this.id" :typeId="'post'" :page="'likes'"/>
  </LayoutWithSidebar>
</template>
