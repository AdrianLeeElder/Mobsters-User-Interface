<template>
  <div>
    <v-layout column justify-end>
      <v-layout justify-center>
        <v-flex xs12 md4>
          <ActionJobStatistics />
        </v-flex>
      </v-layout>
      <v-layout justify-center>
        <v-flex xs12 md8>
          <v-data-table :headers="accountHeaders" :items="mobsters" class="elevation-1" :loading="loading" hide-actions>
            <template v-slot:items="props">
              <td>
                <Status :status="props.item.status" />
              </td>
              <td class="text-xs-left">
                {{props.item.username}}
              </td>
              <td class="text-xs-left">
                {{getPriority(props.item.priority)}}
              </td>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination v-model="pageNumber" :length="totalPages" @input="(number) => {this.pageNumber === number; this.loadMobsters()}"></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import api from "@/api.js";
import ActionJobs from "@/components/ActionJobs.vue";
import ActionJobStatistics from "./ActionJobStatistics.vue";
import Priority from "./Priority.vue";
import Status from "./Status.vue";

export default {
  name: "Accounts",
  data() {
    return {
      mobsters: [],
      totalPages: 0,
      pageNumber: 1,
      loading: false,
      accountHeaders: [
        { text: "Status", value: "status" },
        { text: "Username", value: "username" },
        { text: "Priority", value: "priority"}
      ]
    };
  },
  methods: {
    async loadMobsters() {
      this.loading = true;
      this.mobsters = await api.getMobsters(this.pageNumber - 1);
      this.loading = false;
    },
    async setTotalPages() {
      this.loading = true;
      this.totalPages = await api.getTotalMobsterPages();
      this.loading = false;
    },
    getPriority(priority) {
      switch(priority) {
        case 0: return "Low";
        case 1: return "Normal";
        case 2: return "High";
      }
    }
  },
  created() {
    this.setTotalPages();
    this.loadMobsters();
  },
  components: {
    ActionJobs,
    Priority,
    ActionJobStatistics,
    Status
  }
};
</script>

<style>
</style>
