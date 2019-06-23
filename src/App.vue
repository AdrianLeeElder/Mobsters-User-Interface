<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer v-model="drawer" fixed app>
        <v-list dense>
          <v-list-tile to="accounts">
            <v-list-tile-action>
              <v-icon>account_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Accounts</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="templates">
            <v-list-tile-action>
              <v-icon>schedule</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Templates</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Mobsters Bot v0.1 - By Adrian Elder</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container>
          <router-view/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Accounts from "./components/Accounts.vue";
import { client } from "@/http-common.js";
const avatarBaseApi = "https://ui-avatars.com/api/";

export default {
  name: "app",
  data() {
    return {
      authenticated: false,
      user: {},
      avatarApi: "",
      drawer: true
    };
  },
  methods: {
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
      this.user = await this.$auth.getUser();
      this.avatarApi = (await avatarBaseApi) + "?name=" + this.user.name;
    },
    login() {
      this.$auth.loginRedirect("/");
    },
    async logout() {
      await this.$auth.logout();
      await this.isAuthenticated();

      this.$router.push({ path: "/" });
    }
  },
  created() {
    this.isAuthenticated();
  },
  watch: {
    $route: "isAuthenticated"
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
  width: 25px;
  height: 25px;
}

#right-menu {
  height: 30px;
}

#right-menu {
}
</style>
