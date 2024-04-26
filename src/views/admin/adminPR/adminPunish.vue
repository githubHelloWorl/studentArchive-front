<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-form :model="ruleForm" :inline="true" style="width: 100%; margin-left:1%;margin-bottom: -13px;margin-top: 5px" class="demo-form-inline">
        <el-form-item label="学生学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="学生班级" prop="classes">
          <el-input v-model="ruleForm.classes"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime">
          <el-input v-model="ruleForm.stime"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5px;">
        <el-button type="primary" @click="handlerQuery" style="width: 100px">查询</el-button>
      </div>
    </el-card>

    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 94%;margin-left: 3%">
        <el-table-column prop="fileId" label="处分编号" width="160" align="center"/>
        <el-table-column prop="fileName" label="处分名称" width="180" align="center"/>
        <el-table-column prop="sid" label="学号" width="120" align="center"/>
        <el-table-column prop="userName" label="姓名" width="120" align="center"/>
        <el-table-column prop="classes" label="班级" width="180" align="center"/>
        <el-table-column prop="tname" label="发布教师" width="160" align="center"/>
        <el-table-column prop="submitTime" label="创建时间" width="160" align="center">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button @click="handlerFind(scope.row)" type="primary" style="width: 80px">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          style="margin-top: 20px;margin-left: 3%"
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
        direction="vertical"
        :column="3"
        :size="'default'"
        border
      >
        <el-descriptions-item label="处分编号">{{ file.fileId }}</el-descriptions-item>
        <el-descriptions-item label="处分名称">{{ file.fileName }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ file.sid }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ file.userName }}</el-descriptions-item>
        <el-descriptions-item label="创建教师">{{ file.tname }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ new Date(file.submitTime).toLocaleDateString() }}
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
<!--        <el-descriptions-item label="颁发时间">-->
<!--          {{ new Date(file.fileTime).toLocaleDateString() }}-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="审核时间">-->
<!--          <span v-if="file.checkTime !== null">{{ new Date(file.checkTime).toLocaleDateString() }}</span>-->
<!--          <span v-else>...</span>-->
<!--        </el-descriptions-item>-->
        <el-descriptions-item label="学年学期 :" :span="2">{{ file.stime }}</el-descriptions-item>
        <el-descriptions-item label="处分图片" :span="3">
          <el-image
            v-if="file.filePath"
            style="max-width: 300px; max-height: 300px"
            :src="imageUrl"
            fit="contain">
          </el-image>
        </el-descriptions-item>
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
import {getCurrentInstance, ref, watch} from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let ruleForm = ref({
  userAccount: "",
  userName: "",
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
let punishInfo = ref({});
let imageUrl = ref();

/**
 * 查看
 */
const handlerFind = (row: {}) => {
  file.value = row;

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

/**
 * 得到数据
 */
const getTable = () => {
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
}

const handlerQuery = async () => {
  await getTable();
}

</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}
</style>