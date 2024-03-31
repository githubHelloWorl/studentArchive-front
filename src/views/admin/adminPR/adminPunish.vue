<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-form :model="ruleForm" :inline="true" style="width: 100%; margin-left: 0%;" class="demo-form-inline">
        <el-form-item label="学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="ruleForm.classes"></el-input>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime">
          <el-input v-model="ruleForm.stime"></el-input>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <!--          <el-table-column prop="id" ></el-table-column>-->

        <el-table-column prop="fileId" label="处分编号" width="150" />
        <el-table-column prop="sid" label="学号" width="100" />
        <el-table-column prop="userName" label="姓名" width="120" />
        <el-table-column prop="stime" label="学年学期" width="100" />
        <el-table-column prop="fileName" label="处分名称" width="100" />
        <el-table-column prop="department" label="院系" width="180" />
        <el-table-column prop="classes" label="班级" width="180" />
        <el-table-column prop="tname" label="发布教师" width="160" />
        <el-table-column prop="submitTime" label="创建时间" width="160">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button @click="handlerFind(scope.row)" type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="处分信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-descriptions
        :title="file.userName"
        direction="vertical"
        :column="3"
        :size="'default'"
        border
      >
        <el-descriptions-item label="处分编号">{{ file.fileId }}</el-descriptions-item>
        <el-descriptions-item label="处分名称">{{ file.fileName }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ file.sid }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ file.userName }}</el-descriptions-item>
        <el-descriptions-item label="审核教师">{{ file.tname }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">
          {{ new Date(file.submitTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="颁发时间">
          {{ new Date(file.fileTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="审核时间">
          <span v-if="file.checkTime !== null">{{ new Date(file.checkTime).toLocaleDateString() }}</span>
          <span v-else>...</span>
        </el-descriptions-item>
        <el-descriptions-item label="学年学期">{{ file.stime }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">确定</el-button>
          <!--          <el-button @click="handlerToReward('1')" :disabled="file.state === '2'">等待</el-button>-->
          <!--          <el-button type="primary" @click="handlerToReward('2')">-->
          <!--            批准-->
          <!--          </el-button>-->
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
  fileInfo: "0",
  classes: "",
  stime: ""
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
let tmpList = ref(<[]>[]);
let total = ref(0);
let pageSize = ref(10);
let file = ref(<{}>{});
let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);

/**
 * 查看
 */
const handlerFind = (row: {}) => {
  file.value = row;
  dialogFormVisible.value = true;
};

/**
 * 分页
 * @param page
 */
const changePage = (page: number) => {
  page = page - 1;
  let start = page * pageSize.value,
    end = pageSize.value * (page + 1);
  let length = tmpList.value.length;

  let ans = end < length ? end : length;
  tableData.value.splice(0);
  tableData.value.push(...tmpList.value.slice(start, ans));
};

// /**
//  * 创建证书
//  */
// const handlerCreateReward = () => {
//   (reward as any).value.sid = user.userAccount;
//
//   context?.$myRequest({
//     url: "/api/PR/createPR",
//     method: "POST",
//     data: reward.value
//   }).then(function(res: any) {
//     if (res.data.code === 0) {
//       context?.$message({
//         type: "success",
//         message: "上传成功"
//       });
//
//     } else {
//       context?.$message({
//         type: "error",
//         message: res.data.message
//       });
//     }
//   });
// };

/**
 * 得到数据
 */
watch(ruleForm, (newValue, oldValue) => {
  context?.$myRequest({
    url: "/api/PR/queryPRByTeacher",
    method: "POST",
    data: ruleForm.value
  }).then(function(res: any) {
    if (res.data.code === 0) {

      // 将教师姓名添加上去
      res.data.data.forEach((item: {}, index: number) => {
        (item as any).tname = "";
        teacherList.forEach((teacher: {}, index: number) => {
          if (item.tid === teacher.userAccount) {
            item.tname = teacher.userName;
          }
        });
      });

      // 分页
      tmpList.value.splice(0);
      tmpList.value.push(...(res.data.data as []));
      total.value = res.data.data.length;
      let start = 0,
        end = pageSize.value;
      let length = tmpList.value.length;
      let ans = end < length ? end : length;
      tableData.value.splice(0);
      tableData.value.push(...tmpList.value.slice(start, ans));

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
}, { immediate: true, deep: true });

// /**
//  * 初始化
//  */
// onMounted(() => {
//
//
// });
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}
</style>