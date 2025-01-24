<script>
  import UserListChild from "/src/components/UserList.vue";
  import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";

  export default {
    name: 'UserList',
    components: {LayoutWithSidebar, UserListChild },
    props: ['id'],
  }
</script>

<template>
  <LayoutWithSidebar :page="''">
    <UserListChild :id="this.id" :typeId="'user'" :page="'subscriptions'"/>
  </LayoutWithSidebar>
</template>
