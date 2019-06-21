<template>
  <div>
    <p align="right">
      <a href="" @click.prevent="toggleDisplay()" style="margin-bottom: 10px;">{{requestDisplay}}</a>
    </p>
    <el-card v-if="show" style="margin-bottom: 10px">
      <p id="loading" v-show="loading">
        <i class="el-icon-loading"></i>
      </p>
      <p v-if="statistics.averageCompletionTime" align="middle">Average Completion Time:
        <b>{{averageCompletionTime}}</b>
      </p>
      <el-row>
        <el-col :span="4">

        </el-col>
        <el-col :span="24">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="statistics.completionProgress"></el-progress>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <p align="left">Running: {{statistics.totalRunning}}</p>
          <p align="left">Completed: {{statistics.totalCompleted}}</p>
          <p align="left">Queued: {{statistics.totalQueued}}</p>
          <p align="left">Idle: {{statistics.totalIdle}}</p>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import api from "@/api.js";
const prettyMilliseconds = require("pretty-ms");

export default {
  name: "ActionJobStatistics",
  data() {
    return {
      loading: false,
      statistics: {},
      template: "",
      actionTemplates: [],
      show: true,
      timer: setInterval(async () => this.loadTemplates(), 100000)
    };
  },
  methods: {
    async loadStatistics() {
      this.loading = true;
      this.statistics = await api.getActionJobStatistics(this.template);
      this.loading = false;
    },
    async loadTemplates() {
      this.loading = true;
      this.actionTemplates = await api.getActionTemplates();
      this.setTemplate();
      this.loadStatistics();
      this.loading = false;
    },
    setTemplate() {
      if (this.actionTemplates && this.actionTemplates.length > 0) {
        this.template = this.actionTemplates[0].name;
      }
    },
    toggleDisplay() {
      this.show = !this.show;
    }
  },
  created() {
    this.loadTemplates();
  },
  computed: {
    requestDisplay() {
      return (this.show ? "Hide " : "Show ") + "Statistics";
    },
    averageCompletionTime() {
      return prettyMilliseconds(this.statistics.averageCompletionTime);
    }
  }
};
</script>

<style>
.clearfix:after {
  content: " "; /* Older browser do not support empty content */
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}

a {
  color: black;
  text-decoration: none;
}

#loading {
  top: 45px;
  right: 25px;
  position: absolute;
}
</style>
