<template>
    <div>
        <v-container>
            <v-layout column>
                <v-layout justify-center>
                    <v-flex xs12 md6 class="mb-3">
                        <v-alert :value="successMessage.length > 0" type="success">
                            {{successMessage}}
                        </v-alert>
                        <v-alert :value="errorMessage.length > 0" type="error">
                            {{errorMessage}}
                        </v-alert>
                        <v-card class="pa-3">
                            <v-card-title>
                                <h3>Select Template</h3>
                            </v-card-title>
                            <v-select v-model="showingTemplate" :items="templates" label="Templates" item-text="name" return-object @change="templateChanged">

                            </v-select>
                            <v-card-actions>
                                <v-btn @click="createNew" color="success">
                                    <v-icon left>
                                        add_circle
                                    </v-icon>
                                    Create New
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout justify-center>
                    <v-flex xs12 md6 v-if="Object.keys(showingTemplate).length > 0">
                        <v-card class="pa-3 mb-3">
                            <v-text-field v-model="showingTemplate.name" label="Edit Name"></v-text-field>
                            <v-select :items="frequencies" label="Run Frequency" v-model="showingTemplate.frequency"></v-select>
                            <p v-if="showingTemplate.lastRan" style="font-size: 15px" align="left">
                                Last Ran:
                                <time-ago :refresh="60" :datetime="showingTemplate.lastRan" locale="en" tooltip></time-ago> ago
                            </p>
                        </v-card>
                        <v-card class="pa-3">
                            <v-card-title primary-title>
                                <v-container grid-list-md>
                                    <v-layout :column="$vuetify.breakpoint.xsOnly">
                                        <v-layout>
                                            <v-flex xs12 md12>
                                                <h3 class="headline">Configured Actions</h3>
                                                <div v-if="showingTemplate.actions && showingTemplate.actions.length > 0" style="height: 450px; overflow-y: scroll">
                                                    <draggable v-model="showingTemplate.actions" draggable=".actionTemplateAction">
                                                        <div v-for="ata in showingTemplate.actions" :key="ata.sequence" class="actionTemplateAction" style="display: flex; justify-content: space-between; align-items: center">
                                                            <font-awesome-icon style="margin-right: 10px;cursor: move;" icon="bars" />
                                                            <p align="left" style="cursor: move;">
                                                                {{ata.name}}
                                                            </p>
                                                            <!-- <el-button size="small" type="danger" plain round style="margin-top: 2px; margin-bottom: 1px;" >-</el-button> -->
                                                            <v-btn fab small color="error" @click="removeAction(ata)">
                                                                <v-icon>remove</v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </draggable>
                                                </div>
                                                <div v-else>
                                                    <p>No actions for this template. <br/>Click the + from the available actions list.</p>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                        <v-divider vertical class="ml-3 mr-3"></v-divider>
                                        <v-layout>
                                            <v-flex xs12 md12>
                                                <h3 class="headline">Available Actions</h3>
                                                <div style="height: 450px; overflow-y: scroll">
                                                    <div v-for="config in actionConfigs" :key="config.sequence" class="actionTemplateAction" style="display: flex; justify-content: space-between; align-items: center">
                                                        <p align="left" style="cursor: move;">
                                                            {{config.name}}
                                                        </p>
                                                        <!-- <el-button size="small" type="danger" plain round style="margin-top: 2px; margin-bottom: 1px;" >-</el-button> -->
                                                        <v-btn fab small color="success" @click="addAction(config.name)">
                                                            <v-icon>add_circle</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-layout>
                                </v-container>
                            </v-card-title>
                            <v-divider class="mt-3 mb-3"></v-divider>
                            <v-btn style small color="success" @click="addMobsters">Add All</v-btn>
                            <v-btn style small color="error" @click="removeMobsters">Remove All</v-btn>
                            <v-select v-model="showingTemplate.mobsters" item-value="id" item-text="username" return-object :items="mobsters" attach chips label="Run With Mobsters" multiple>

                            </v-select>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn flat color="success" @click="saveTemplate()">Save</v-btn>
                                <v-btn flat color="info" @click="reset()">Reset</v-btn>
                                <v-dialog v-model="showingDeleteTemplate" persistent max-width="250">
                                    <template v-slot:activator="{ on }">
                                        <v-btn flat color="error" v-if="showingTemplate.id" v-on="on">Delete</v-btn>
                                    </template>
                                    <v-card class="pa-3">
                                        <b>Are you sure you want to delete the template '{{this.showingTemplate.name}}'?</b>
                                        <v-card-actions>
                                            <v-layout justify-center>
                                                <v-btn @click="deleteTemplate" color="error">
                                                    Yes
                                                </v-btn>
                                                <v-btn @click="hideDeleteDialog()">
                                                    No
                                                </v-btn>
                                            </v-layout>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import api from "@/api.js";
import draggable from "vuedraggable";
import TimeAgo from "vue2-timeago";

const newTemplate = {
  actions: [],
  name: "New Template",
  frequency: "",
  mobsters: []
};

export default {
  data() {
    return {
      templates: [],
      showingTemplate: {},
      selectedMobsterId: "",
      selectedAvailableMobsterId: "",
      mobsters: [],
      actionConfigs: [],
      originalTemplate: {},
      frequencies: ["Daily", "Weekly", "Monthly"],
      offset: {
        bottom: 0
      },
      user: "",
      errorMessage: "",
      successMessage: "",
      showingDeleteTemplate: false
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
    async loadActionConfigs() {
      this.actionConfigs = await api.getActionConfigs();
    },
    async saveTemplate() {
      window.scrollTo(0, 0);
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
      this.mobsters = await api.getAllMobsters();
      this.loading = false;
    },
    async deleteTemplate() {
      this.showingDeleteTemplate = false;
      window.scrollTo(0, 0);
      var result = await api.deleteActionTemplate(this.showingTemplate.id);
      this.setSuccessMessage(
        "Successfully deleted template '" + this.showingTemplate.name + "'."
      );
      this.showingTemplate = {
        actions: [],
        name: "New Template",
        frequency: "",
        mobsters: []
      };
      this.loadTemplates();
      return result;
    },
    createNew() {
      this.showingTemplate = JSON.parse(JSON.stringify(newTemplate));
    },
    templateChanged(template) {
      this.originalTemplate = JSON.parse(JSON.stringify(template));
    },
    hideDeleteDialog() {
        this.showingDeleteTemplate = false
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
