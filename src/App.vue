<template>
  <div id="app">
     <el-container>
        <el-aside width="270px">
          <el-menu
            id="navbar"
            default-active="1"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span>Dashboard</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header id="app-header">
            <!-- <el-container> -->
              <el-row style="margin-top: 20px;">
                <el-col :span="6">
                  Mobsters Automated Solutions
                </el-col>
                <el-col :offset="10">
                  <img src="https://avatars.dicebear.com/v2/male/.svg" style="width:20px; height: 20px;"/>
                  Tracy
                </el-col>
              </el-row>
            <!-- </el-container> -->
          </el-header>
          <el-main>
            <Main/>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #637c96;
}

body {
  background: #f1f1f1;
  margin: 0px;
}

#app-header {
  background-color: white;
  border-bottom: 1px solid #e3e3e3;
}

header.el-header {
  padding: 0px;
}

</style>
