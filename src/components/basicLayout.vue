<!--主体页面的宽度-->
<template>
  <div class="common-layout">
    <el-container>
      <!--      左侧栏宽度-->
      <el-aside width="auto">
        <RAside></RAside>
      </el-aside>
      <el-container>
        <!--        头像栏高度-->
        <el-header height="auto">
          <Header></Header>
        </el-header>
        <el-main>
          <!--          主体内容-->
          <div style="width: 100%;height: auto;margin: 10px auto auto auto;">
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