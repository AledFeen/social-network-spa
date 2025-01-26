<script>
  import UserListChild from "/src/components/UserList.vue";
  import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";

  export default {
    name: 'Subscribers',
    components: {LayoutWithSidebar, UserListChild },
    props: ['id'],
  }
</script>

<template>
  <LayoutWithSidebar :page="''">
    <UserListChild :id="this.id" :typeId="'user'" :page="'subscribers'"/>
  </LayoutWithSidebar>
</template>
