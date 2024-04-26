<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

      <div>
        <el-form :model="ruleForm" :inline="true" class="demo-form-inline"
                 style="width: 100%;margin-left: 1%;margin-top: 10px">
          <el-form-item label="学生学号" prop="userAccount">
            <el-input v-model="ruleForm.userAccount" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="学生班级" prop="classes">
            <el-input v-model="ruleForm.classes" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="学生院系" prop="department">
            <el-input v-model="ruleForm.department" style="width: 200px"/>
          </el-form-item>
          <br>
          <el-form-item label="学生姓名" prop="userName">
            <el-input v-model="ruleForm.userName" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="ruleForm.cardId" style="width: 200px"/>
          </el-form-item>
        </el-form>

        <div style="margin-top: 5px">
          <el-row :gutter="10">
            <el-col :span="8"></el-col>
            <el-col :span="2">
              <el-button @click="archiveQuery" type="primary">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="changeQuery" type="primary">批量导出</el-button>
            </el-col>
            <el-col :span="2">
              <el-upload
                ref="upload"
                action="#"
                :on-change="handleFileChange"
                :before-upload="beforeUpload"
              >
                <el-button slot="trigger" type="primary">批量导入</el-button>
              </el-upload>
            </el-col>
            <el-col :span="2">
              <el-button @click="changeDelete" type="primary">批量删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <admin-student-list :ruleForm="ruleForm" :allDelete="allDelete" :query="query"></admin-student-list>
  </div>
</template>

<script setup lang="ts">
import adminStudentList from "@/views/admin/adminUser/adminStudentList.vue";
import * as XLSX from "xlsx";
import {getCurrentInstance, ref} from "vue";

// 修改
interface student {
  userAccount: string,
  userName: string,
  userRole: string,
  userPassword: string,
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
  department: null,
  classes: "",
  flag: 0
});
let query = ref({ a: 0 });
const allDelete = ref({ a: 0 });
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
 * 使用批量删除
 */
const changeDelete = () => {
  allDelete.value.a += 1;
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