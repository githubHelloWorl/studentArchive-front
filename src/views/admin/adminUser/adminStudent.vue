<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

      <div>
        <el-form :model="ruleForm" :inline="true" class="demo-form-inline" style="width: 80%; margin-left: 10%;">
          <el-form-item label="学生学号" prop="userAccount">
            <el-input v-model="ruleForm.userAccount" />
          </el-form-item>
<!--          <el-form-item label="学生姓名" prop="userName">-->
<!--            <el-input v-model="ruleForm.userName" />-->
<!--          </el-form-item>-->
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="ruleForm.cardId" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
          <el-form-item label="学生班级" prop="classes">
            <el-input v-model="ruleForm.classes" />
          </el-form-item>
        </el-form>
        <div style="margin: auto;">
          <el-button @click="archiveQuery" type="primary">查询</el-button>
        </div>
      </div>
    </el-card>

    <admin-student-list :flag="flag" :ruleForm="ruleForm"></admin-student-list>
  </div>
</template>

<script setup lang="ts">
import adminStudentList from "@/views/admin/adminUser/adminStudentList.vue";

import { ref, reactive, getCurrentInstance, onMounted } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let ruleForm = ref({
  userName: null,
  userAccount: null,
  userRole: "student",
  cardId: null,
  phone: null,
  classes: "",
  flag: 0
});
let dialogFormVisible = ref(false);
let flag = ref({ a: 0 });

/**
 * 修改档案
 */
const archiveQuery = () => {
  ruleForm.value.flag += 1;
};


</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>