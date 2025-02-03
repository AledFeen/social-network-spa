<script>
  import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
  import PostList from "@/components/PostList.vue";

  export default {
    name: 'PostsByTag',
    components: {PostList, LayoutWithSidebar},
    props: ['id'],
  }
</script>

<template>
  <LayoutWithSidebar :page="''">
    <div class="block w-full mx-1 md:w-3/4 my-4 md:my-16 rounded-lg shadow-lg border border-gray-a9 border-solid">
      <PostList :id="this.id" :page="'tag'" :isOwner="false"/>
    </div>
  </LayoutWithSidebar>
</template>
