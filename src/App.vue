<template>
  <div id="app">
    <el-menu :router="true" mode="horizontal" default-active="/accounts">
      <el-menu-item>
        <img src="@/assets/logo_file.png" width="75" height="38"/>
      </el-menu-item>
      <el-menu-item index="/">
        Home
      </el-menu-item>
      <el-menu-item index="/accounts">
        Accounts
      </el-menu-item>
      <div id="right-menu" style="text-align: right;">
        <img style="text-align:right; width: 30px; height: 30px;" class="menu-right" id="avatar" :src="avatarApi" />
        <span id="userName" v-if="user">
           {{user.name}}
        </span>
        <el-submenu index="4" class="menu-right" :router="false">
          <template slot="title">
            <i style="padding-right: 10px" class="el-icon-menu"></i>
          </template>
          <!-- <el-menu-item index="4-1">
            <i class="el-icon-setting"></i> Settings</el-menu-item>
          <el-menu-item index="4-2">
            <i class="el-icon-information"></i> About</el-menu-item> -->
          <el-menu-item @click="logout()">
            <i class="el-icon-circle-close"></i> Logout</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
    <el-container>
      <el-main>
        <router-view/>
        <div id="osw-container"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Accounts from "./components/Accounts.vue";
import {client} from "@/http-common.js";
const avatarBaseApi = "https://ui-avatars.com/api/";

export default {
  name: "app",
  data() {
    return {
      authenticated: false,
      user: {},
      avatarApi: ''
    };
  },
  methods: {
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
      this.user = await this.$auth.getUser();
      this.avatarApi = await avatarBaseApi + "?name=" + this.user.name
    },
    login() {
      this.$auth.loginRedirect("/");
    },
    async logout() {
      await this.$auth.logout();
      await this.isAuthenticated()

      this.$router.push({path: '/'})
    }
  },
  created() {
    this.isAuthenticated();
  },
  watch: {
    '$route': "isAuthenticated"
  },
  components: {
    Accounts
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #637c96;
}

.font {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: #f1f1f1;
  margin: 0px;
}

.menu-right {
  display: inline-block;
  vertical-align: middle;
}

*:focus { 
  outline: none;
}

#avatar {
  width:25px; 
  height: 25px;
}

#right-menu {
  height: 30px;
}

#right-menu {

}
</style>
