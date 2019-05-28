<template>
  <div id="app">
    <el-menu :router="true" mode="horizontal" default-active="2">
      <el-menu-item>
        <img src="@/assets/logo_file.png" width="75" height="40"/>
      </el-menu-item>
      <el-menu-item index="1">
        Home
      </el-menu-item>
      <el-menu-item index="/accounts">
        Accounts
      </el-menu-item>
      <div style="text-align: right;">
        <img class="menu-right" src="https://avatars.dicebear.com/v2/male/.svg" style="width:20px; height: 20px;" /> Tracy
        <el-submenu index="4" class="menu-right">
          <template slot="title">
            <i style="padding-right: 10px" class="el-icon-menu"></i>
          </template>
          <el-menu-item index="4-1">
            <i class="el-icon-setting"></i> Settings</el-menu-item>
          <el-menu-item index="4-2">
            <i class="el-icon-information"></i> About</el-menu-item>
          <el-menu-item index="4-3">
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

export default {
  name: "app",
  data() {
    return {
      authenticated: false
    };
  },
  methods: {
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
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

body {
  background: #f1f1f1;
  margin: 0px;
}

.menu-right {
  display: inline-block;
}
</style>
