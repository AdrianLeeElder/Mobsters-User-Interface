<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="mobsters" v-loading="loading" class="mb-4" stripe>
          <el-table-column type="expand">
            <template slot-scope="props">
              <ActionJobs :mobster="props.row" />
            </template>
          </el-table-column>
          <el-table-column label="Username" prop="username" width="200">

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
      <el-col :span="12">
        <ActionJobStatistics class="mb-3" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api.js";
import ActionJobs from "@/components/ActionJobs.vue";
import ActionJobStatistics from "./ActionJobStatistics.vue";
import Priority from "./Priority.vue";

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
    ActionJobStatistics
  }
};
</script>

