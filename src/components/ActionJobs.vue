<template>
  <div>
    <h3>Action Jobs</h3>
    <!-- <el-table :data="actionJobsResponse.content" v-loading="loading" stripped border>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <Actions :actions="props.row.actionList" />
                </template>
            </el-table-column>
            <el-table-column label="Status" width="75">
                <template slot-scope="scope">
                    <Status :status="scope.row.status"></Status>
                </template>
            </el-table-column>
            <el-table-column prop="template.name" label="Template">
            </el-table-column>
            <el-table-column label="Completion Time">
                <template slot-scope="scope">
                    {{prettyMilliseconds(scope.row.completionTime)}}
                </template>
            </el-table-column>
            <el-table-column label="Created Date">
                <template slot-scope="scope">
                    <time-ago :refresh="60" :datetime="scope.row.createdDate" locale="en" tooltip></time-ago>
                </template>
            </el-table-column>
        </el-table> -->
    <v-data-table :headers="headers" :items="actionJobsResponse.content" class="elevation-1 ma-4" :loading="loading" hide-actions expand>
      <template v-slot:items="props">
        <td style="width: 5%">
          <v-btn small @click="props.expanded = !props.expanded">
            {{props.expanded ? 'Hide' : 'View'}}
          </v-btn>
        </td>
        <td style="width: 10%">
          <Status :status="props.item.status"></Status>
        </td>
        <td class="text-xs-left">
          {{props.item.name}}
        </td>
        <td class="text-xs-left">
          {{prettyMilliseconds(props.item.completionTime)}}
        </td>
        <td class="text-xs-left">
            <time-ago :refresh="60" :datetime="props.item.createdDate" locale="en" tooltip></time-ago>
        </td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          No accounts found by the username of "{{ search }}" found.
        </v-alert>
      </template>
      <template slot="expand" slot-scope="props">
        <Actions :actions="props.item.actionList" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/api.js";
import TimeAgo from "vue2-timeago";
import "vue2-timeago/dist/vue2-timeago.css";
import Status from "./Status.vue";
import Actions from "./Actions.vue";
const prettyMilliseconds = require("pretty-ms");

const running = "running";
const idle = "idle";
const complete = "complete";
const queued = "queued";

export default {
  props: {
    name: "ActionJobs",
    mobster: Object
  },
  data() {
    return {
      headers: [
        { text: "View", value: "view", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Template", value: "template", sortable: false },
        { text: "Completion Time", value: "completionTime", sortable: false },
         { text: "Created Date", value: "createdDate", sortable: false }
      ],
      actionJobsResponse: {
        content: []
      },
      limit: 5,
      loading: false,
      pageNumber: 0,
      pageSize: 5
    };
  },
  methods: {
    async loadActionJobs() {
      this.loading = true;
      this.actionJobsResponse = await api.getActionJobs(
        this.mobster.id,
        this.pageNumber,
        this.pageSize
      );
      this.loading = false;
    },
    getDateTime(datetime) {
      return datetime;
    },
    prettyMilliseconds(value) {
      var result = prettyMilliseconds(value);
      return result === "0ms" ? "" : result;
    }
  },
  created() {
    this.loadActionJobs();
  },
  components: {
    TimeAgo,
    Status,
    Actions,
    Status
  }
};
</script>
