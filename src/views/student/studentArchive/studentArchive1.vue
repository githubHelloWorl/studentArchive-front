<template>
fasfdsa
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let archive = ref({});
let dialogFormVisible = ref(false);

/**
 * 修改档案
 */
const updateArchive = () => {
  context?.$myRequest({
    url: "/api/archive/updateArchive",
    method: "POST",
    data: archive.value
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "档案修改成功"
      });
      // const date = new Date(archive.value.createTime);
      // console.log(date.toLocaleDateString());

      // console.log(archive);
    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
};

/**
 * 初始化
 */
onMounted(() => {
  context?.$myRequest({
    url: "/api/archive/getArchive?userAccount=" + user.userAccount,
    method: "GET"
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      archive.value = res.data.data;
      // console.log(archive);
    } else {
      context?.$message({
        type: "error",
        messag: res.data.message
      });
    }
  });
});

</script>

<style scoped>

</style>