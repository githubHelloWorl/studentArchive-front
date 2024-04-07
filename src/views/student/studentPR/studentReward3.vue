<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-button class="button" type="primary" @click="handlerCreate"
      >新增证书
        <el-icon style="margin-right: 5px;">
          <DocumentAdd />
        </el-icon>
      </el-button>
    </el-card>

    <!-- 表格信息 -->
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="fileId" label="证书编号" width="150" />
        <el-table-column prop="submitTime" label="上传时间" width="100">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="stime" label="学期" width="80" />
        <el-table-column prop="fileName" label="证书名称" width="120" />
        <el-table-column prop="fileUnit" label="颁发单位" width="120" />
        <el-table-column prop="fileTime" label="颁发时间" width="120">
          <template #default="scope">
            {{ new Date(scope.row.fileTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="tname" label="审核教师" width="120" />
        <el-table-column prop="checkTime" label="审核时间" width="120">
          <template #default="scope">
            <span v-if="scope.row.checkTime !== null">{{ new Date(scope.row.checkTime).toLocaleDateString() }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" fixed="right">
          <template #default="scope">
            <el-tag v-if="scope.row.state === '0'" type="danger" effect="dark">未审核</el-tag>
            <el-tag v-else-if="scope.row.state === '1'" type="info" effect="dark">不通过</el-tag>
            <el-tag v-else-if="scope.row.state === '2'" type="success" effect="dark">审核通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="success" @click="handlerFind(scope.row)">查看</el-button>
            <!--            <el-button type="primary" @click="openPdf = true">查看证书</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="title" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="reward">
        <el-form-item v-if="title === '查看证书'" label="证书编号" prop="address">
          <el-input v-model="reward.fileId" placeholder="请输入" size="large" :width="100" disabled />
        </el-form-item>
        <el-form-item label="证书名称" prop="address">
          <el-input v-model="reward.fileName" placeholder="请输入证书名称" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="颁发单位" prop="fileUnit">
          <el-input v-model="reward.fileUnit" placeholder="请输入颁发单位" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="颁发时间" prop="fileTime">
          <el-date-picker
            v-model="reward.fileTime"
            type="date"
            placeholder="请输入颁发时间"
            size="default"
          />
        </el-form-item>
        <el-form-item label="学年学期" prop="stime">
          <el-input v-model="reward.stime" placeholder="请输入学年学期" size="large" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="title === '新建证书'" @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="title === '新建证书'" type="primary" @click="handlerCreateReward">
            创建
          </el-button>
          <el-button v-if="title === '查看证书'" @click="handlerDeleteReward" :disabled="reward.state === '2'">撤回
          </el-button>
          <el-button v-if="title === '查看证书'" type="primary" @click="handlerUpdateReward"
                     :disabled="reward.state === '2'">修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { DocumentAdd } from "@element-plus/icons-vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
// const user = context?.$store.state.loginUser;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
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
  fileUnt: null,
  stime: "",
  fileTime: "",
  fileUnit: ""
});
let reward2 = ref(<{}>{
  sid: user.sid,
  tid: null,
  fileId: null,
  fileName: null,
  state: "0",
  fileInfo: "1",
  tname: null,
  fileUnt: null,
  stime: "",
  fileTime: "",
  fileUnit: ""
});
let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
let tableData = ref(<[]>[]);
let openPdf = ref(<boolean>false);
let title = ref("");

// 关闭弹窗
const onClose = () => {
  openPdf.value = false;
};

/**
 * 更改证书
 */
const handlerUpdateReward = () => {
  context?.$myRequest({
    url: "/api/PR/updatePR",
    method: "POST",
    data: reward.value
  }).then(async function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "修改成功"
      });
      getTable();

      // reward.value = { ...reward2.value };

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
 * 删除证书
 */
const handlerDeleteReward = () => {
  context?.$myRequest({
    url: "/api/PR/deleteReward",
    method: "POST",
    data: reward.value
  }).then(async function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "撤回成功"
      });

      await getTable();

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
 * 新建处理
 */
const handlerCreate = () => {
  title.value = "新建证书";
  dialogFormVisible.value = true;
};

/**
 * 查看处理
 */
const handlerFind = (row: {}) => {
  reward.value = { ...row };
  title.value = "查看证书";
  dialogFormVisible.value = true;
};

/**
 * 创建证书
 */
const handlerCreateReward = () => {
  (reward as any).value.sid = user.userAccount;

  context?.$myRequest({
    url: "/api/PR/createPR",
    method: "POST",
    data: reward.value
  }).then(async function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "上传成功"
      });

      await getTable();

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
 * 得到教师
 */
// const handlerGetTeacher = () => {
//   context?.$myRequest({
//     url: "/api/user/queryUserByRole?userRole=teacher",
//     method: "GET"
//   }).then(function(res: any) {
//     if (res.data.code === 0) {
//       // context?.$message({
//       //   type: "success",
//       //   message: "档案修改成功"
//       // });
//
//       teacherList.splice(0);
//       teacherList.push(...res.data.data);
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
 * 得到证书表格
 */
const getTable = () => {
  const form = {
    fileInfo: "1",
    userAccount: user.userAccount
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
          }
        });
      });

      console.log("res.data.data = ");
      console.log(res.data.data);

      tableData.value.splice(0);
      tableData.value.push(...res.data.data);

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
onMounted(async () => {
  await getTable();
});
</script>

<style scoped>
.button {
  width: 200px;

}
</style>