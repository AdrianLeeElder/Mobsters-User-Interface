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
          <v-card>
            <v-card-title>
              <h3 class="headline">
                Accounts
              </h3>
              <v-spacer></v-spacer>
              <v-text-field v-model="accountSearch" label="Search accounts">
              </v-text-field>
              <v-btn @click="searchByMobster" small>
                <v-icon>search</v-icon>
              </v-btn>
            </v-card-title>
            <v-container>
              <v-layout justify-start>
                <v-flex xs1 class="mt-2">
                  <h3>Filter By:</h3>
                </v-flex>
                <v-flex xs1>
                  <v-btn-toggle v-model="accountStatuses" @change="accountStatusChanged">
                    <v-btn flat small fab :disabled="loading">
                      <font-awesome-icon class="mr-1" :icon="getComplete().icon"></font-awesome-icon>
                      {{getComplete().name}}
                    </v-btn>
                    <v-btn flat small fab :disabled="loading">
                      <font-awesome-icon class="mr-1" :icon="getRunning().icon"></font-awesome-icon>
                      {{getRunning().name}}
                    </v-btn>
                    <v-btn flat small fab :disabled="loading">
                      <font-awesome-icon class="mr-1" :icon="getQueue().icon"></font-awesome-icon>
                      {{getQueue().name}}
                    </v-btn>
                    <v-btn flat small fab :disabled="loading">
                      <font-awesome-icon class="mr-1" :icon="getIdle().icon"></font-awesome-icon>
                      {{getIdle().name}}
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
              </v-layout>
            </v-container>
            <v-data-table :headers="accountHeaders" :items="mobsters" class="elevation-1" :loading="loading" hide-actions expand>
              <template v-slot:items="props">
                <td style="width: 5%">
                    <v-btn small @click="props.expanded = !props.expanded">
                      {{props.expanded ? 'Hide' : 'View'}}
                    </v-btn>
                  </td>
                  <td style="width: 10%">
                    <Status :status="props.item.actionJobStatus" />
                  </td>
                  <td class="text-xs-left">
                    {{props.item.username}}
                  </td>
                  <td class="text-xs-left">
                    {{getPriority(props.item.priority)}}
                  </td>
              </template>
              <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning">
                  No accounts found by the username of "{{ search }}" found.
                </v-alert>
              </template>
              <template slot="expand" slot-scope="props">
                <ActionJobs :mobster="props.item"/>
              </template>
            </v-data-table>
          </v-card>
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
import {
  getIdle,
  getQueued,
  getRunning,
  getComplete,
  Status as StatusConstants
} from "@/statuses";

export default {
  name: "Accounts",
  data() {
    return {
      mobsters: [],
      totalPages: 0,
      pageNumber: 1,
      loading: false,
      accountHeaders: [
        { text: "View", value: "view", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Username", value: "username", sortable: false },
        { text: "Priority", value: "priority", sortable: false }
      ],
      accountStatuses: -1,
      accountSearch: ""
    };
  },
  methods: {
    async loadMobsters() {
      this.loading = true;
      var result = await api.getMobsters(
        this.pageNumber - 1,
        this.getStatusFromToggle(this.accountStatuses)
      );
      this.mobsters = result.content;
      this.totalPages = result.totalPages;
      this.loading = false;
    },
    accountStatusChanged(value) {
      this.loadMobsters();
    },
    getPriority(priority) {
      switch (priority) {
        case 0:
          return "Low";
        case 1:
          return "Normal";
        case 2:
          return "High";
      }
    },
    searchByMobster() {},
    getIdle() {
      return getIdle();
    },
    getRunning() {
      return getRunning();
    },
    getQueue() {
      return getQueued();
    },
    getComplete() {
      return getComplete();
    },
    getStatusFromToggle(toggle) {
      switch (toggle) {
        case -1:
          return "";
        case 0:
          return StatusConstants.COMPLETE;
        case 1:
          return StatusConstants.RUNNING;
        case 2:
          return StatusConstants.QUEUED;
        case 3:
          return StatusConstants.IDLE;
        default:
          throw Error("unrecognized toggle: " + toggle);
      }
    }
  },
  created() {
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
