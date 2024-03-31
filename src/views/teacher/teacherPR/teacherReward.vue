<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-form :model="ruleForm">
        <el-form-item label="学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="ruleForm.state">
            <el-option label="未审核" value="0">未审核</el-option>
            <el-option label="不通过" value="1">不通过</el-option>
            <el-option label="审核通过" value="2">审核通过</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <!--          <el-table-column prop="id" ></el-table-column>-->
        <el-table-column prop="submitTime" label="时间" width="90">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="fileId" label="证书编号" width="90" />
        <el-table-column prop="fileName" label="证书名称" width="90" />
        <el-table-column prop="fileUnit" label="颁发单位" width="90" />
        <el-table-column label="状态" width="90" fixed="right">
          <template #default="scope">
            <el-tag v-if="scope.row.state === '0'" type="danger" effect="dark">未审核</el-tag>
            <el-tag v-else-if="scope.row.state === '1'" type="info" effect="dark">不通过</el-tag>
            <el-tag v-else-if="scope.row.state === '2'" type="danger" effect="dark">审核通过</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="新增信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="reward">
        <el-form-item label="证书名称" prop="address">
          <el-input v-model="reward.fileName" placeholder="请输入证书名称" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="审核教师" prop="health">
          <el-select v-model="reward.tid" placeholder="请输入审核教师" @click="handlerGetTeacher">
            <el-option v-for="teacher in teacherList" :key="teacher.userAccount" :label="teacher.userName"
                       :value="teacher.userAccount">
              {{ teacher.userAccount }} -- {{ teacher.userName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颁发单位" prop="fileUnit">
          <el-input v-model="reward.fileUnit" placeholder="请输入颁发单位" size="large" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerCreateReward">
            创建
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let ruleForm = ref({
  userAccount: "",
  state: ""
});
let dialogFormVisible = ref(<boolean>false);
let reward = ref(<{}>{
  sid: user.sid,
  tid: null,
  fileId: null,
  fileName: null,
  state: "0",
  fileInfo: "1",
  tname: null,
  fileUnt: null
});
let teacherList = reactive(<[]>[]);
let tableData = ref(<[]>[]);

/**
 * 创建证书
 */
const handlerCreateReward = () => {
  (reward as any).value.sid = user.userAccount;

  context?.$myRequest({
    url: "/api/PR/createPR",
    method: "POST",
    data: reward.value
  }).then(function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "上传成功"
      });

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
};

/**
 * 得到教师
 */
const handlerGetTeacher = () => {
  context?.$myRequest({
    url: "/api/user/queryUserByRole?userRole=teacher",
    method: "GET"
  }).then(function(res: any) {
    if (res.data.code === 0) {
      // context?.$message({
      //   type: "success",
      //   message: "档案修改成功"
      // });

      teacherList.splice(0);
      teacherList.push(...res.data.data);

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
};

watch(ruleForm, (newValue, oldValue) => {
  context?.$myRequest({
    url: "/api/PR/queryPRByTeacher",
    method: "POST",
    data: ruleForm.value
  }).then(function(res: any) {
    if (res.data.code === 0) {
      // context?.$message({
      //   type: "success",
      //   message: "档案修改成功"
      // });

      tableData.value.splice(0);
      tableData.value.push(...res.data.data);


    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
}, { immediate: true, deep: true });

/**
 * 初始化
 */
onMounted(() => {

  context?.$myRequest({
    url: "/api/PR/queryPR?fileInfo=1",
    method: "GET"
  }).then(function(res: any) {
    if (res.data.code === 0) {
      // context?.$message({
      //   type: "success",
      //   message: "档案修改成功"
      // });

      tableData.value.splice(0);
      tableData.value.push(...res.data.data);


    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
});
</script>

<style scoped>

</style>