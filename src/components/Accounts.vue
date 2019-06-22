<template>
  <div>
    <el-col :span="24">
      <el-row>
        <ActionJobStatistics style="margin-bottom: 5px;" />
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-table :data="mobsters" v-loading="loading" class="mb-4" stripe border>
            <el-table-column type="expand">
              <template slot-scope="props">
                <ActionJobs :mobster="props.row" />
              </template>
            </el-table-column>
            <el-table-column label="Status" width="75">
              <template slot-scope="scope">
                <Status :status="scope.row.actionJobStatus" />
              </template>
            </el-table-column>
            <el-table-column label="Username" prop="username" width="90%">

            </el-table-column>
            <el-table-column label="Priority">
              <template slot-scope="scope">
                <Priority :value="scope.row.priority"></Priority>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="mt-3" background layout="prev, pager, next" :page-count="totalPages" :current-page.sync="pageNumber" @current-change="loadMobsters">

          </el-pagination>
        </el-col>
      </el-row>
    </el-col>
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
      loading: false
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

