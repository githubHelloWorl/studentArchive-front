<!--奖励-->
<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-form :model="ruleForm" :inline="true" style="width: 100%;margin-left: 1%;margin-top: 5px;margin-bottom: -13px"
               class="demo-form-inline">
        <el-form-item label="学生学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="学生班级" prop="classes">
          <el-input v-model="ruleForm.classes" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime">
          <el-input v-model="ruleForm.stime" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="state">
          <el-select v-model="ruleForm.state" style="width: 200px;">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="未审核" value="0">未审核</el-option>
            <el-option label="不通过" value="1">不通过</el-option>
            <el-option label="审核通过" value="2">审核通过</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5px;">
        <el-button type="primary" @click="handlerQuery" style="width: 100px">查询</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table :data="tableData" border stripe style="width: 94%;margin-left: 3%">
        <el-table-column prop="fileId" label="证书编号" width="160" align="center"/>
        <el-table-column prop="sid" label="学生学号" width="120" align="center"/>
        <el-table-column prop="userName" label="姓名" width="120" align="center"/>
        <el-table-column prop="stime" label="学年学期" width="90" align="center"/>
        <el-table-column prop="fileName" label="证书名称" width="150" align="center"/>
        <el-table-column prop="tname" label="审核教师" width="130" align="center"/>
        <el-table-column prop="checkTime" label="审核时间" width="120" align="center">
          <template #default="scope">
            <span v-if="scope.row.checkTime !== null">{{ new Date(scope.row.checkTime).toLocaleDateString() }}</span>
            <span v-else>...</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态" width="150" fixed="right" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.state === '0'" type="danger" effect="dark">未审核</el-tag>
            <el-tag v-else-if="scope.row.state === '1'" type="info" effect="dark">不通过</el-tag>
            <el-tag v-else-if="scope.row.state === '2'" type="success" effect="dark">审核通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"align="center">
          <template #default="scope">
            <el-button type="primary" @click="handlerReward(scope.row)" style="width: 100px;">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 20px 0 0 3%;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="证书信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-descriptions
        direction="vertical"
        :column="3"
        :size="'default'"
        border
      >
        <el-descriptions-item label="证书编号">{{ file.fileId }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ file.sid }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ file.userName }}</el-descriptions-item>
        <el-descriptions-item label="学年学期">{{ file.stime }}</el-descriptions-item>
        <el-descriptions-item label="证书名称">{{ file.fileName }}</el-descriptions-item>
        <el-descriptions-item label="颁发单位">{{ file.fileUnit }}</el-descriptions-item>
        <el-descriptions-item label="审核教师">{{ file.tname }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">
          {{ new Date(file.submitTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="颁发时间">
          {{ new Date(file.fileTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="审核时间" :span="3">
          <span v-if="file.checkTime !== null">{{ new Date(file.checkTime).toLocaleDateString() }}</span>
          <span v-else>...</span>
        </el-descriptions-item>
        <el-descriptions-item label="获奖证书" :span="3">
          <el-image v-if="file.filePath" :src="imageUrl" fit="contain"
                    style="max-height: 200px; max-width: 200px;" />
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref, watch} from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
// const user = context?.$store.state.loginUser;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
let ruleForm = ref({
  userAccount: "",
  state: "",
  fileInfo: "1",
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
  fileUnt: null,
  checkTime: ""
});
let tableData = ref(<[]>[]);
let tmpList = ref(<[]>[]);
let total = ref(0);
let pageSize = ref(10);
let file = ref(<{}>{});
let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
const loading = ref<string>("0");
const imageUrl = ref("");
/**
 * 得到图片
 */
const getImg = () => {
  try {
    return require("@/assets/" + file.value.filePath);
    //图片地址
  } catch (e) {
    if (file.value.filePath === "") {
      loading.value = "2";
    }
    return require("@/assets/error.png");
    //图片找不到时，使用默认图片
  }
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
 * 查看信息
 */
const handlerReward = (row: any) => {
  file.value = { ...row };

  let image = row.filePath;
  if(image) {
    try{
      imageUrl.value = require("@/assets/image/" + image);
    }catch(e){
      console.log("e =")
      console.log(e)
      imageUrl.value = require("@/assets/image/error.png")
    }
  }

  dialogFormVisible.value = true;
};

/**
 * 证书
 */
const handlerToReward = (state: String) => {
  (file as any).value.state = state;

  context?.$myRequest({
    url: "/api/PR/setFileState",
    method: "POST",
    data: file.value
  }).then(function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "修改成功"
      });

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
    dialogFormVisible.value = false;
  });
};

/**
 * 搜寻信息S
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

/**
 * 进行查询
 */
const handlerQuery = async () => {
  await getTable();
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>