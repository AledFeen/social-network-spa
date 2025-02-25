<script>
import LayoutWithSidebar from "@/layouts/PageWithSidebarLayout.vue";
import router from "@/router/index.js";
import UserListChild from "@/components/UserList.vue";
import TagPanel from "@/components/TagPanel.vue";
import LocationPanel from "@/components/LocationPanel.vue";
import PostList from "@/components/PostList.vue";
import dayjs from "dayjs";
import {reactive, ref} from "vue";

export default {
  name: "Search",
  components: {PostList, LocationPanel, TagPanel, UserListChild, LayoutWithSidebar},

  beforeMount() {
    this.loadComplaints(1)
  },

  data() {
    return {
      type: 'all',
      status: '',
      measure_status: '',
      date: '',
      complaints: [],
      columns: [
        'ID', 'Sender ID', 'User ID', 'Post ID', 'Comment ID', 'Message ID',
        'Text', 'Status', 'Created At', 'Updated At', 'Measure', 'Measure Status'
      ],
      current_page: 1,
      last_page: 1,
      total: 0,
      links: [],
    };
  },

  methods: {
    loadComplaints(resetPage) {
      this.current_page = resetPage
      this.axios.get(this.$store.getters.serverPath + '/api/complaints', {
        params: {
          'type': this.type,
          'date': this.date,
          'status': this.status,
          'measure_status': this.measure_status,
          'page_id': this.current_page
        }
      })
        .then(response => {
          this.complaints = response.data.data
          this.current_page = response.data.current_page
          this.last_page = response.data.last_page
          this.total = response.data.total
          this.links = Array.from({length: this.last_page}, (_, i) => i + 1)
        })
        .catch(err => {
          console.log(err)
        })
    },

    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY HH:mm");
    },
  }
}

</script>

<template>
  <LayoutWithSidebar :page="'Admin'">

    <div
      class="w-full md:w-3/4 my-3 md:my-5 mx-3 md:mx-5 rounded-lg shadow-lg border border-gray-a9 border-solid px-3 py-3">
      <div class="flex flex-row items-center justify-between"> <!-- Filters -->

        <div class="flex flex-row items-center  justify-center w-1/2">
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{
                $t('date-text')
              }}
            </div>
            <input v-model="date" type="date"
                   class="py-2 ps-3 pe-3 rounded-lg text-secondary_text-light dark:text-secondary_text-dark bg-input_back-light dark:bg-input_back-dark placeholder-gray-a9 focus:outline-none drop-shadow-md">

          </div>
        </div>


        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- Type -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{
                $t('type-text')
              }}
            </div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Type</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="type">
                <option value="all" class="hover:cursor-pointer hover:opacity-75">{{ $t('all-option') }}</option>
                <option value="user" class="hover:cursor-pointer hover:opacity-75">{{ $t('user-option') }}</option>
                <option value="post" class="hover:cursor-pointer hover:opacity-75">{{ $t('post-option') }}</option>
                <option value="comment" class="hover:cursor-pointer hover:opacity-75">{{ $t('comment-option') }}
                </option>
                <option value="message" class="hover:cursor-pointer hover:opacity-75">{{ $t('message-option') }}
                </option>
              </select>
            </div>
          </div>
        </div> <!-- Type -->

        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- Status -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{
                $t('status-text')
              }}
            </div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Status</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="status">
                <option value="" class="hover:cursor-pointer hover:opacity-75">{{ $t('nothing-option') }}</option>
                <option value="checked" class="hover:cursor-pointer hover:opacity-75">{{ $t('checked-option') }}
                </option>
                <option value="non-checked" class="hover:cursor-pointer hover:opacity-75">
                  {{ $t('non-checked-option') }}
                </option>
              </select>
            </div>
          </div>
        </div> <!-- Status-->

        <div class="flex flex-row items-center  justify-center w-1/2"> <!-- measure_status -->
          <div class="flex flex-col">
            <div class="text-primary_text-light dark:text-primary_text-dark text-lg text-center">{{
                $t('measure-status-text')
              }}
            </div>
            <div class="relative">
              <label for="locale-select" class="sr-only">Measure status</label>
              <select
                id="locale-select"
                class="block w-full px-3 py-2 text-sm border rounded-md shadow-sm bg-secondary_back-light dark:bg-secondary_back-dark
              text-primary_text-light dark:text-primary_text-dark hover:cursor-pointer hover:opacity-75"
                v-model="measure_status">
                <option value="" class="hover:cursor-pointer hover:opacity-75">{{ $t('nothing-option') }}</option>
                <option value="accepted" class="hover:cursor-pointer hover:opacity-75">{{ $t('accepted-option') }}
                </option>
                <option value="rejected" class="hover:cursor-pointer hover:opacity-75">{{ $t('rejected-option') }}
                </option>
              </select>
            </div>
          </div>
        </div> <!-- measure_status -->

      </div> <!-- Filters -->
      <div @click.prevent="loadComplaints(1)" class="w-1/6 ms-10 mt-3 py-2 text-btn_text-dark text-center bg-btn_back-secondary rounded-2xl hover:bg-btn_back-secondary_hover
                  hover:cursor-pointer drop-shadow-md">{{ $t('search') }}
      </div>

      <div class="overflow-x-auto mt-3">
        <table class="min-w-full border border-gray-a9">
          <thead
            class="bg-secondary_back-light dark:bg-secondary_back-dark text-primary_text-light dark:text-primary_text-dark">
          <tr>
            <th v-for="(column, index) in columns" :key="index" class="border border-gray-300 px-4 py-2 text-left">
              {{ column }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="complaint in complaints" :key="complaint.id"
              class="bg-secondary_back-light dark:bg-secondary_back-dark text-secondary_text-light dark:text-secondary_text-dark text-start">
            <td class="border px-4 py-2 hover:cursor-pointer hover:underline"><router-link :to="'/complaint/'+ complaint.id">{{ complaint.id }}</router-link></td>
            <td class="border px-4 py-2">{{ complaint.sender_id ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.user_id ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.post_id ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.comment_id ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.message_id ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.text ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.status ?? '-' }}</td>
            <td class="border px-4 py-2">{{ formatDate(complaint.created_at) ?? '-' }}</td>
            <td class="border px-4 py-2">{{ formatDate(complaint.updated_at) ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.measure ?? '-' }}</td>
            <td class="border px-4 py-2">{{ complaint.measure_status ?? '-' }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="last_page > Number(1)" class="d-flex flex-row justify-content-center mt-5">
        <nav aria-label="Page navigation">
          <ul class="flex flex-row justify-center text-primary_text-light dark:text-primary_text-dark">
            <li v-if="current_page !== 1" class="mx-1">
              <div @click.prevent="loadComplaints(current_page - 1)" class="hover:cursor-pointer hover:underline"
                 aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </div>
            </li>
            <li v-for="link in links" class="mx-1">
              <template v-if="Number(link.label) &&
                                    (current_page - link < 2 &&
                                    current_page - link > -2) ||
                                    Number(link) === 1 || Number(link) === last_page">
                <div @click.prevent="loadComplaints(link)" :class="link.active ? 'active' : ''" class="hover:cursor-pointer hover:underline">{{ link }}</div>
              </template>
            </li>
            <li v-if="current_page !== last_page" class="mx-1">
              <div @click.prevent="loadComplaints(current_page + 1)" class="hover:cursor-pointer hover:underline" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>

    </div>

  </LayoutWithSidebar>
</template>

<style>

</style>
