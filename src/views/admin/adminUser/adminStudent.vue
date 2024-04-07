<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

      <div>
        <el-form :model="ruleForm" :inline="true" class="demo-form-inline" style="width: 80%; margin-left: 10%;">
          <el-form-item label="学生学号" prop="userAccount">
            <el-input v-model="ruleForm.userAccount" />
          </el-form-item>
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
          <el-row :gutter="10">
            <el-col :span="9"></el-col>
            <el-col :span="2">
              <el-button @click="archiveQuery" type="primary">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="changeQuery" type="primary">导出</el-button>
            </el-col>
            <el-col :span="2">
              <el-upload
                ref="upload"
                action="#"
                :on-change="handleFileChange"
                :before-upload="beforeUpload"
              >
                <el-button slot="trigger" type="primary">导入</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <admin-student-list :ruleForm="ruleForm" :query="query"></admin-student-list>
  </div>
</template>

<script setup lang="ts">
import adminStudentList from "@/views/admin/adminUser/adminStudentList.vue";
import * as XLSX from "xlsx";
import { ref, reactive, getCurrentInstance, onMounted } from "vue";

interface student {
  userAccount: string,
  userName: string,
  userRole: string,
  userPassowrd: string,
  cardId: string,
  phone: string,
  department: string,
  classes: string,
  archiveId: string,
  sex: string,
  address: string,
  health: string,
  origin: string,
  nation: string,
  createTime: string
};

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
let query = ref({ a: 0 });
let dialogFormVisible = ref(false);
let flag = ref({ a: 0 });
let pageSize = ref({ a: 10 });

/**
 * 修改档案
 */
const archiveQuery = () => {
  ruleForm.value.flag += 1;
};

const changeQuery = () => {
  query.value.a += 1;
};

/**
 * 导入文件
 */
const beforeUpload = (file: any) => {
  // 可以在这里添加对上传文件的额外检查
  return false; // 阻止自动上传
};
const handleFileChange = (file: any, fileList: []) => {
  readExcel(file.raw);
};
const readExcel = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const studentInfoList = ref<student[]>([]);
    jsonData.forEach((item: any, index: number) => {
      if (index === 0) {
        return;
      }
      studentInfoList.value.push(<student><unknown>{
        userName: item[0],
        cardId: item[1],
        phone: item[2],
        // department: item[3],
        // classes: item[4],
        // userPassword: "12345678",
        // userRole: "student",
        // archiveId: item[5],
        // sex: item[6],
        // address: item[7],
        // health: item[8],
        // origin: item[9],
        // nation: item[10],
        // createTime: item[11]
      });
    });

    context?.$myRequest({
      url: "/api/user/importData",
      method: "POST",
      data: studentInfoList.value
    }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
      if (res.data.code === 0) {
        context?.$message({
          type: "success",
          message: "导入学生成功"
        });
        archiveQuery();
      } else {
        context?.$message({
          type: "error",
          message: res.data.message
        });
      }
    });
    studentInfoList.value.splice(0);
  };
  reader.readAsArrayBuffer(file);
};

</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>