<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <RAside></RAside>
      </el-aside>
      <el-container>
        <el-header height="70px">
          <Header></Header>
        </el-header>
        <el-main>
          <div style="margin-top: 10px;width: 90%;margin-left: 5%;">
            <router-view></router-view>
          </div>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import RAside from "./RAside.vue";
import Header from "./Header.vue";
</script>

<style scoped>

</style>