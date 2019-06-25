<template>
  <div>
    <v-card class="pa-3 mb-2">
      <v-flex xs12 align-self-end>
        <span>{{ statistics.completionProgress }}%</span>
        <v-progress-linear :value="statistics.completionProgress" color="blue">
        </v-progress-linear>
      </v-flex>
      <v-flex xs12>
        <div v-for="(status, index) in statuses" :key="index" style="display: inline-block;">
          <span style="margin-right: 10px;">
            <font-awesome-icon v-if="status.length > 0" :icon="getClass(status)" />
            <b style="margin-left: 5px">{{getValueForStatus(status)}}</b> {{status}}
          </span>
        </div>
      </v-flex>
    </v-card>
  </div>
</template>

<script>
import api from "@/api.js";
import { getIcon, getToolTip, Status } from "@/statuses";
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
      timer: setInterval(async () => this.loadTemplates(), 100000),
      statuses: [Status.IDLE, Status.QUEUED, Status.RUNNING, Status.COMPLETE],
      progressBarType: "line"
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
    },
    getToolTip(status) {
      return getToolTip(status);
    },
    getClass(status) {
      return getIcon(status);
    },
    getValueForStatus(status) {
      switch (status) {
        case Status.IDLE:
          return this.statistics.totalIdle;
        case Status.QUEUED:
          return this.statistics.totalQueued;
          break;
        case Status.RUNNING:
          return this.statistics.totalRunning;
        case Status.COMPLETE:
          return this.statistics.totalCompleted;
        default:
          throw "unknown status " + status;
      }
    }
  },
  destroyed: function() {
    window.removeEventListener("resize", this.handleResize);
  },
  created() {
    window.addEventListener("resize", this.handleResize);
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

#text-display {
  padding-top: 5px;
}
</style>
