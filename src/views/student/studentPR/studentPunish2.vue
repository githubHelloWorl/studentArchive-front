<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

    </el-card>
    <!---->
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <!--          <el-table-column prop="id" ></el-table-column>-->
        <el-table-column prop="fileId" label="处分编号" width="180" />
        <el-table-column prop="stime" label="学期" width="180" />
        <el-table-column prop="submitTime" label="创建时间" width="160">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="处分名称" width="180" />
        <el-table-column prop="fileUnit" label="处分教师" width="160">
          <template #default="scope">
            {{ scope.row.tname }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="handlerFind(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="查看处分信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="reward">
        <el-form-item label="处分信息" prop="address">
          <el-input v-model="reward.fileName" size="large" :width="100" disabled/>
        </el-form-item>
        <el-form-item label="审核教师" prop="health">
          <el-input v-model="reward.tname" size="large" :width="100" disabled/>
          <!--          <el-select v-model="reward.tid" placeholder="请输入审核教师" @click="handlerGetTeacher">-->
          <!--            <el-option v-for="teacher in teacherList" :key="teacher.userAccount" :label="teacher.userName"-->
          <!--                       :value="teacher.userAccount">-->
          <!--              {{ teacher.userAccount }} &#45;&#45; {{ teacher.userName }}-->
          <!--            </el-option>-->
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item label="创建时间" prop="fileTime">
          {{ new Date(reward.fileTime).toLocaleDateString() }}
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
const teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
let ruleForm = ref({
  title: ""
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
let tableData = ref(<[]>[]);

const handlerFind = (row: {}) => {
  reward.value = row;
  dialogFormVisible.value = true;
};

/**
 * 初始化
 */
onMounted(() => {
  const form = {
    userAccount: user.userAccount,
    fileInfo: "0"
  };

  context?.$myRequest({
    url: "/api/PR/queryPRByTeacher",
    method: "POST",
    data: form
  }).then(function(res: any) {
    if (res.data.code === 0) {
      // context?.$message({
      //   type: "success",
      //   message: "档案修改成功"
      // });

      // 将教师姓名添加上去
      res.data.data.forEach((item: {}, index: number) => {
        (item as any).tname = "";
        teacherList.forEach((teacher: {}, index: number) => {
          if (item.tid === teacher.userAccount) {
            item.tname = teacher.userName;
            // console.log("teacher.tname = ");
            // console.log(teacher.tname);
          } else {
            // console.log("teacher.userAccount = ");
            // console.log(teacher.userAccount);
          }
        });
      });

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