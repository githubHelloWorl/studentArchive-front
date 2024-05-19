<!--获奖-->
<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-form :model="ruleForm" :inline="true" style="width: 100%;margin-left: 1%;margin-top: 9px;">
        <el-form-item label="学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="ruleForm.userName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="ruleForm.classes" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="ruleForm.state" style="width: 200px;">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="未审核" value="0">未审核</el-option>
            <el-option label="不通过" value="1">不通过</el-option>
            <el-option label="审核通过" value="2">审核通过</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <di>
        <el-button type="primary" style="width: 80px;" @click="handlerQuery">查询</el-button>
      </di>
    </el-card>

    <el-card>
      <el-table :data="tableData" border stripe style="width: 94%;margin-left: 3%">
        <el-table-column prop="fileId" label="证书编号" width="160" align="center"/>
        <el-table-column prop="fileName" label="证书名称" width="130" align="center"/>
        <el-table-column prop="sid" label="学生学号" width="120" align="center"/>
        <el-table-column prop="userName" label="学生姓名" width="120" align="center"/>
        <el-table-column prop="classes" label="学生班级" width="165" align="center"/>
        <el-table-column prop="tname" label="审核教师" width="120" align="center"/>
        <el-table-column prop="checkTime" label="审核时间" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.checkTime !== null">{{ new Date(scope.row.checkTime).toLocaleDateString() }}</span>
            <span v-else>...</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态" width="100" fixed="right" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.state === '0'" type="danger" effect="dark">未审核</el-tag>
            <el-tag v-else-if="scope.row.state === '1'" type="info" effect="dark">不通过</el-tag>
            <el-tag v-else-if="scope.row.state === '2'" type="success" effect="dark">审核通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handlerReward(scope.row)" style="width: 90px;">查看</el-button>
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

    <!-- 弹出框 -->
    <el-dialog
      title="pdf预览.pdf"
      v-model="openPdf"
      @close="onClose"
      :close-on-click-modal="false"
      width="1050px"
    >
      <!-- 预览pdf文件 -->
      <embed
        src=""
        type="application/pdf"
        width="1010px"
        height="600px"
      />
    </el-dialog>

    <el-dialog v-model="dialogFormVisible" title="证书信息" label-position="left" label-width="auto"
               style="max-width: 600px;">

      <el-descriptions
        direction="vertical"
        :column="4"
        :size="'default'"
        border
      >
        <el-descriptions-item label="证书编号" width="25%" align="center">{{ file.fileId }}</el-descriptions-item>
        <el-descriptions-item label="学生学号" width="25%" align="center">{{ file.sid }}</el-descriptions-item>
        <el-descriptions-item label="学生姓名" width="25%" align="center">{{ file.userName }}</el-descriptions-item>
        <el-descriptions-item label="学年学期" width="25%" align="center">{{ file.stime }}</el-descriptions-item>
        <el-descriptions-item label="证书名称" width="25%" align="center">{{ file.fileName }}</el-descriptions-item>
        <el-descriptions-item label="颁发单位" width="25%" align="center">{{ file.fileUnit }}</el-descriptions-item>
        <el-descriptions-item label="颁发时间" width="25%" align="center">
          {{ new Date(file.fileTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="提交时间" width="25%" align="center">
          {{ new Date(file.submitTime).toLocaleDateString() }}
        </el-descriptions-item>
        <el-descriptions-item label="审核教师" width="25%" align="center">{{ file.tname }}</el-descriptions-item>
        <el-descriptions-item label="审核时间" align="center">  <!-- TODO 4 文件审核时间  -->
          <span v-if="file.checkTime !== null">{{ new Date(file.checkTime).toLocaleDateString() }}</span>
          <span v-else>...</span>
        </el-descriptions-item>
        <el-descriptions-item label="获奖证书" :span="2" align="center">
          <el-image v-if="file.filePath" :src="imageUrl" fit="contain"
                    style="max-width: 200px;max-height: 300px;"/>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlerToReward('1')" :disabled="file.state === '2'">不通过</el-button>
          <el-button type="primary" @click="handlerToReward('2')" :disabled="file.state === '2'">
            通过
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref, watch} from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
let ruleForm = ref({
  userAccount: "",
  userName: "",
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
  fileUnt: null
});
let tableData = ref(<[]>[]);
let file = ref(<{}>{});
let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
let total = ref(0);
const pageSize = ref(10);
let tmpList = ref(<[]>[]);
const loading = ref<string>("0");
const imageUrl = ref("");

// 是否打开弹窗
const openPdf = ref(false);
// 关闭弹窗
const onClose = () => {
  openPdf.value = false;
};

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
 * 查看信息
 */
const handlerReward = (row: any) => {
  loading.value = "0";
  file.value = { ...row };

  let image = row.filePath;
  if (image) {
    try{
      imageUrl.value = require("@/assets/image/" + image);
    }catch(e){
      imageUrl.value = require("@/assets/image/error.png")
    }
  }
  dialogFormVisible.value = true;
};

/**
 * 改变页码
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
 * 证书 改变状态
 */
const handlerToReward = (state: String) => {
  file.value.state = state;
  file.value.tid = user.userAccount;

  context?.$myRequest({
    url: "/api/PR/setFileState",
    method: "POST",
    data: file.value
  }).then(async function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "修改成功"
      });

      await getTable();
      // tableData.value.splice(0);
      // tableData.value.push(...res.data.data);

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
          } else {
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
};

/**
 * 进行查询
 */
const handlerQuery = async () => {
  await getTable();
}

// watch(ruleForm, async (newValue, oldValue) => {
//   await getTable();
// }, { immediate: true, deep: true });

</script>

<style scoped>

</style>