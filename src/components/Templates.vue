<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary">
                        Action Templates
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="template" v-for="template in templates" :key="template.id">
                            {{template.name}}
                        </el-dropdown-item>
                        <el-dropdown-item command="new" divided icon="el-icon-circle-plus">
                            Create New
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p v-if="showingTemplate.lastRan" style="font-size: 15px">
                    Last Ran:
                    <time-ago :refresh="60" :datetime="showingTemplate.lastRan" locale="en" tooltip></time-ago> ago
                </p>
                <p v-else>
                    Never Ran
                </p>
            </el-col>
            <el-col :span="5">
                <el-alert v-if="successMessage.length > 0" :title="successMessage" type="success" style="margin-bottom: 10px">
                </el-alert>
                <el-alert v-if="errorMessage.length > 0" :title="errorMessage" type="error" style="margin-bottom: 10px">
                </el-alert>
                <el-card>
                    <el-form :model="showingTemplate" label-width="120px" size="mini">
                        <el-form-item label="Template Name" prop="name">
                            <el-input v-model="showingTemplate.name"></el-input>
                        </el-form-item>
                        <el-form-item label="Run Frequency">
                            <el-select v-model="showingTemplate.frequency">
                                <el-option v-for="(frequency, index) in frequences" :key="index" :value="frequency" :label="frequency"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Actions">
                            <el-card style="margin-top: 10px; height: 500px; overflow-y: scroll">
                                <template v-if="showingTemplate.actions && showingTemplate.actions.length > 0">
                                    <draggable v-model="showingTemplate.actions" draggable=".actionTemplateAction">
                                        <div v-for="ata in showingTemplate.actions" :key="ata.sequence" class="actionTemplateAction" style="display: flex; justify-content: space-between; align-items: center">
                                            <font-awesome-icon style="margin-right: 10px;cursor: move;" icon="bars" />
                                            <p align="left" style="cursor: move;">
                                                {{ata.name}}
                                            </p>
                                            <el-button size="small" type="danger" plain round style="margin-top: 2px; margin-bottom: 1px;" @click="removeAction(ata)">-</el-button>
                                        </div>
                                    </draggable>
                                </template>
                                <template v-else>
                                    <p>No actions for this template. <br/>Click the + from the available actions list.</p>
                                </template>
                            </el-card>
                        </el-form-item>
                        <el-form-item label="Run with Mobsters">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <el-select v-model="selectedMobsterId">
                                    <el-option v-for="(mobster, index) in showingTemplate.mobsters" :key="index" :value="mobster.id" :label="mobster.username"></el-option>
                                </el-select>
                                <el-button v-if="selectedMobsterId" style="margin-left: 5px" type="danger" plain>-</el-button>
                                <el-button v-if="showingTemplate.mobsters && showingTemplate.mobsters.length > 0" style="margin-left: 5px" type="danger" plain @click="removeMobsters">Remove All</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="Available Mobsters">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <el-select v-model="selectedAvailableMobsterId">
                                    <el-option v-for="(mobster, index) in mobsters" :key="index" :value="mobster.id" :label="mobster.username"></el-option>
                                </el-select>
                                <el-button v-if="selectedAvailableMobsterId && selectedAvailableMobsterId.length > 0" style="margin-left: 5px" type="success" plain @click="addMobster">+</el-button>
                                <el-button style="margin-left: 5px" type="success" plain @click="addMobsters">Add All</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
                <hr style="border-top: 1px solid #ccc;">
                <div style="float: left;">
                    <el-button @click="saveTemplate()" type="primary" plain>Save</el-button>
                    <el-button @click="reset()" type="info" plain>Reset</el-button>
                </div>
                <el-button v-if="showingTemplate.id" plain type="danger" icon="el-icon-delete" style="float: right" @click="showTemplateDelete"></el-button>
            </el-col>
            <el-col :offset="1" :span="4" v-if="actionConfigs">
                <el-card>
                    <template slot="header">
                        <p align="left" style="padding: 0; margin: 0;">
                            <b>Available Actions</b>
                        </p>
                    </template>
                    <div v-for="ata in actionConfigs" :key="ata.sequence" class="actionTemplateAction">
                        <el-row>
                            <el-col :span="6">
                                <el-button size="small" type="success" plain round style="margin-top: 2px; margin-bottom: 1px" @click="addAction(ata.name)">+</el-button>
                            </el-col>
                            <el-col :span="14" style="vertical-align: bottom">
                                <div style="text-align: left; margin-top: 10px">
                                    {{ata.name}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import api from "@/api.js";
import draggable from "vuedraggable";
import TimeAgo from "vue2-timeago";

export default {
  data() {
    return {
      templates: [],
      showingTemplate: {
        actions: [],
        name: "New Template",
        frequency: "",
        mobsters: []
      },
      selectedMobsterId: "",
      selectedAvailableMobsterId: "",
      mobsters: [],
      actionConfigs: [],
      originalTemplate: {},
      frequences: ["Daily", "Weekly", "Monthly"],
      offset: {
        bottom: 0
      },
      user: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
      this.user = await this.$auth.getUser();
    },
    async loadTemplates() {
      this.templates = await api.getActionTemplates();
    },
    handleCommand(command) {
      if (command === "new") {
        //todo: feature new

        return (this.showingTemplate = {
          actions: [],
          name: "New Template",
          frequency: "",
          mobsters: []
        });
      }

      this.showingTemplate = JSON.parse(JSON.stringify(command));
      this.originalTemplate = command;
    },
    async loadActionConfigs() {
      this.actionConfigs = await api.getActionConfigs();
    },
    async saveTemplate() {
      this.showingTemplate.user = this.user.email;
      var response = await api.saveActionTemplate(this.showingTemplate);

      if (response.id && response.id.length > 0) {
        this.setSuccessMessage("Successfully saved template.");
        this.showingTemplate = response;
      } else {
        this.setErrorMessage(response.data.message);
        console.log(response.data.message);
      }
    },
    setSuccessMessage(message) {
      this.errorMessage = "";
      this.successMessage = message;
    },
    setErrorMessage(message) {
      this.errorMessage = message;
      this.successMessage = "";
    },
    reset() {
      this.showingTemplate = JSON.parse(JSON.stringify(this.originalTemplate));
    },
    removeAction(action) {
      var actions = this.showingTemplate.actions;
      actions.splice(actions.indexOf(action), 1);
    },
    addAction(name) {
      var actions = this.showingTemplate.actions;
      actions.push({
        name: name
      });
    },
    removeMobsters() {
      this.showingTemplate.mobsters = [];
      this.selectedMobsterId = "";
      this.$forceUpdate();
    },
    addMobsters() {
      this.showingTemplate.mobsters = this.mobsters;
      this.$forceUpdate();
    },
    addMobster() {
      this.showingTemplate.mobsters.push(
        this.mobsters.find(
          mobster => mobster.id === this.selectedAvailableMobsterId
        )
      );
      this.$forceUpdate();
    },
    async loadMobsters() {
      this.loading = true;
      this.mobsters = await api.getMobsters();
      this.loading = false;
    },
    showTemplateDelete() {
      let thisObj = this;
      this.$confirm(
        "This will permanently delete the template. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      ).then(() => {
        var deletingTemplate = thisObj.showingTemplate;
        thisObj.deleteTemplate(deletingTemplate);

        this.$message({
          type: "success",
          message: "Deleted ActionTemplate '" + deletingTemplate.name + "'."
        });
      });
    },
    async deleteTemplate() {
      console.log(this.showingTemplate);
      var result = await api.deleteActionTemplate(this.showingTemplate.id);
      this.showingTemplate = {
        actions: [],
        name: "New Template",
        frequency: "",
        mobsters: []
      };
      this.loadTemplates();
      return result;
    }
  },
  created() {
    this.loadTemplates();
    this.loadActionConfigs();
    this.loadMobsters();
    this.isAuthenticated();
  },
  components: {
    draggable,
    TimeAgo
  }
};
</script>

<style>
.action-parent {
  -moz-column-count: 3;
  -moz-column-gap: 0%;
  -webkit-column-count: 3;
  -webkit-column-gap: 50%;
  column-count: 3;
  column-gap: 0%;
}
</style>
