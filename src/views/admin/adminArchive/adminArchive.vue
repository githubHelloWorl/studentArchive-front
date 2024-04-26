<!--学生档案-->
<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <div>
        <el-form
            label-position="left" :model="ruleForm" :inline="true"
            class="demo-form-inline" style="width: 100%;margin-left:1%;">
          <el-form-item label="档案编号" prop="archiveId">
            <el-input v-model="ruleForm.archiveId" style="width: 220px; margin: auto"/>
          </el-form-item>
          <el-form-item label="学生学号" prop="userAccount">
            <el-input v-model="ruleForm.userAccount" style="width: 220px; margin: auto"/>
          </el-form-item>
          <el-form-item label="学生班级" prop="classes">
            <el-input v-model="ruleForm.classes" style="width: 220px; margin: auto"/>
          </el-form-item>

          <el-form-item label="学生姓名" prop="userName">
            <el-input v-model="ruleForm.userName" style="width: 220px; margin: auto"/>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="ruleForm.cardId" style="width: 220px; margin: auto"/>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" style="width: 220px; margin: auto"/>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="archiveQuery" type="primary" style="width: 120px">查询</el-button>
    </el-card>

    <adminArchiveList :flag="flag" :ruleForm="ruleForm"></adminArchiveList>
    <!--    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"-->
    <!--               style="max-width: 600px;">-->
    <!--      <el-form :model="archive">-->
    <!--        <el-form-item label="性别" prop="sex">-->
    <!--          <el-radio-group v-model="archive.sex">-->
    <!--            <el-radio value="男">男</el-radio>-->
    <!--            <el-radio value="女">女</el-radio>-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="家庭地址" prop="address">-->
    <!--          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="健康状况" prop="health">-->
    <!--          <el-input v-model="archive.health" placeholder="请输入健康状况" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="生源地" prop="origin">-->
    <!--          <el-input v-model="archive.origin" placeholder="请输入生源地" size="large" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="民族" prop="nation">-->
    <!--          <el-input v-model="archive.nation" placeholder="请输入民族" size="large" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="出生日期" prop="createTime">-->
    <!--          <el-date-picker-->
    <!--            v-model="archive.createTime"-->
    <!--            type="date"-->
    <!--            placeholder="请输入日期"-->
    <!--            size="large"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button @click="dialogFormVisible = false">取消</el-button>-->
    <!--          <el-button type="primary" @click="updateArchive">-->
    <!--            修改-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script setup lang="ts">
import adminArchiveList from "./adminArchiveList.vue";

import {getCurrentInstance, ref} from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let ruleForm = ref({
  archiveId: null,
  userName: null,
  userAccount: null,
  cardId: null,
  phone: null,
  classes: null,
  flag: 0
});
let dialogFormVisible = ref(false);
let flag = ref({ a: 0 });

/**
 * 修改档案
 */
const archiveQuery = () => {
  // context?.$emit('archive_to',ruleForm);
  // console.log(context)
  ruleForm.value.flag += 1;
};

/**
 * 初始化
 */
// onMounted(() => {
//   context?.$myRequest({
//     url: "/api/archive/getArchive?userAccount=" + user.userAccount,
//     method: "GET"
//   }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
//     if (res.data.code === 0) {
//       archive.value = res.data.data;
//       // console.log(archive);
//     } else {
//       context?.$message({
//         type: "error",
//         messag: res.data.message
//       });
//     }
//   });
// });

</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>