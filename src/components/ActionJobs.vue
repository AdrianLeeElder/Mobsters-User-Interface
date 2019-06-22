<template>
    <div>
        <h1>Action Jobs</h1>
        <el-table :data="actionJobsResponse.content" v-loading="loading" stripped border>
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
        </el-table>
    </div>
</template>

<script>
import api from "@/api.js";
import TimeAgo from "vue2-timeago";
import "vue2-timeago/dist/vue2-timeago.css";
import Status from "./Status.vue";
import Actions from "./Actions.vue";
const prettyMilliseconds = require("pretty-ms");

const running = 'running';
const idle = 'idle';
const complete = 'complete';
const queued = 'queued';

export default {
  props: {
    name: "ActionJobs",
    mobster: Object
  },
  data() {
    return {
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
