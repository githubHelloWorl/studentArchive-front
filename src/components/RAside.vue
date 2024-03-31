<template>
  <div>
    <el-aside
      width="200px"
      style="
        background-color: #ffffff;
        height: 810px;
        border: 1px solid #eee;
      "
    >
      <el-menu
        background-color="#608fbe"
        text-color="#f0f2f4"
        active-text-color="#8B7765"
        router
        :default-active="context?.$route.path"
      >
        <div
          v-for="(item, index) in context?.$router.options.routes"
          :index="index + ''"
          :key="index"
        >
          <div v-if="item.name === user.userRole">
            <el-sub-menu
              v-for="(item2, index2) in item.children"
              :index="item2.path"
              :key="item2.path"
            >
              <template #title>
                <el-icon>
                  <fold />
                </el-icon>

                {{ item2.name }}
              </template>
              <el-menu-item
                v-for="(item3, index3) in item2.children"
                :index="item3.path"
                :key="item3.path"
              >
                <el-icon>
                  <promotion />
                </el-icon>
                {{ item3.name }}
              </el-menu-item>
            </el-sub-menu>
          </div>
        </div>
      </el-menu>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import {
  ref, watch,
  getCurrentInstance,
  onMounted
} from "vue";
import { Fold } from "@element-plus/icons-vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = JSON.parse(localStorage.getItem("loginUser") as string);

</script>

<style scoped>

</style>