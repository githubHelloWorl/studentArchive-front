<!--处罚 -->
<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
    </el-card>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 94%;margin-left: 3%">
        <el-table-column prop="fileId" label="处分编号" width="180" align="center"/>
        <el-table-column prop="fileName" label="处分名称" width="240" align="center"/>
        <el-table-column prop="stime" label="学年学期" width="180" align="center"/>
        <el-table-column prop="submitTime" label="创建时间" width="180" align="center">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="fileUnit" label="创建教师" width="180" align="center">
          <template #default="scope">
            {{ scope.row.tname }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handlerFind(scope.row)" style="width: 100px">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="查看处分信息" label-position="left" label-width="auto"
               style="max-width: 500px;">
      <el-descriptions
        direction="vertical"
        :column="3"
        :size="'default'"
        border
      >
        <el-descriptions-item label="处分编号">
          {{ reward.fileId }}
        </el-descriptions-item>
        <el-descriptions-item label="处分名称 :" prop="address">
          {{ reward.fileName }}
<!--          <el-input v-model="reward.fileName" size="large" :width="100" disabled/>-->
        </el-descriptions-item>
        <el-descriptions-item label="创建教师 :" prop="health">
          {{ reward.tname }}
<!--          <el-input v-model="reward.tname" size="large" :width="100" disabled/>-->
        </el-descriptions-item>
        <el-descriptions-item label="处分原因 :" prop="fileReason">
          {{ punishInfo.fileReason }}
        </el-descriptions-item>
        <el-descriptions-item label="处分类别 :" prop="type">
          {{ punishInfo.type }}
        </el-descriptions-item>
        <el-descriptions-item label="处分级别 :" prop="level">
          {{ punishInfo.level }}
        </el-descriptions-item>
        <el-descriptions-item label="处分周期 :" prop="circle">
          {{ punishInfo.circle }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间 :" :span="2">
          {{ new Date(reward.fileTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="处分图片" :span="3">
          <el-image
            v-if="reward.filePath"
            style="max-width: 300px; max-height: 300px"
            :src="imageUrl"
            fit="contain">
          </el-image>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false" style="width: 100px">返回</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";

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
let punishInfo = ref({});
let imageUrl = ref();

const handlerFind = (row: {}) => {
  reward.value = row;

  // upload
  if(row.filePath){
    try{
      imageUrl.value = require("@/assets/image/" + row.filePath);
    }catch(e){
      console.log("e =")
      console.log(e)
      imageUrl.value = require("@/assets/error.png");
    }
  }

  context
    ?.$myRequest({
      url: "/api/punish/getAllByFileid?fileId="+row.fileId,
      method: "GET"
    })
    .then(function (res: any) {
      if(res.data.code === 0){
        punishInfo.value = { ...res.data.data }
      }else{
        context?.$message({
          type: "error",
          message: res.data.message
        });
      }
    });

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