<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

      <el-form :model="ruleForm" :inline="true" style="width: 80%;margin: 20px 0 0 10%;">
        <el-form-item>
          <el-button class="button" type="primary" @click="dialogFormVisible = true"
          >新增处分
            <el-icon style="margin-right: 5px;">
              <DocumentAdd />
            </el-icon>
          </el-button>
        </el-form-item>
        <el-form-item label="学号" prop="userAccount">
          <el-input v-model="ruleForm.userAccount" style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="ruleForm.classes" style="width: 240px;"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <!--          <el-table-column prop="id" ></el-table-column>-->

        <el-table-column prop="fileId" label="处分编号" width="150" />
        <el-table-column prop="sid" label="学号" width="120" />
        <el-table-column prop="userName" label="姓名" width="90" />
        <el-table-column prop="stime" label="学年学期" width="90" />

        <el-table-column prop="fileName" label="处分名称" width="90" />

        <el-table-column prop="department" label="院系" width="90" />
        <el-table-column prop="classes" label="班级" width="180" />
        <el-table-column prop="submitTime" label="创建时间" width="90">
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="发布教师" width="90">
          <template #default="scope">
            {{ scope.row.tname }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="warning" @click="handlerDeletePunish(scope.row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 20px 0 0 0;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="新增处分" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="punish" label-width="auto">
        <el-form-item label="处分名称" prop="fileName">
          <el-input v-model="punish.fileName" placeholder="请输入处分名称" size="large" :width="100" />
        </el-form-item>
        <!--        <el-form-item label="学生姓名" prop="userName">-->
        <!--          <el-select v-model="punish.sid" placeholder="请输入处分学生">-->
        <!--            <el-option v-for="student in studentList" :key="student.userAccount" :label="student.userName"-->
        <!--                       :value="student.userAccount">-->
        <!--              {{ student.userAccount }} &#45;&#45; {{ student.userName }}-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="姓名" prop="userName">
          <el-autocomplete
            v-model="punish.sid"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            clearable
            class="inline-input w-50"
            placeholder="请输入处分学生"
            @select="handleSelect"
          >
            <template #default="{ item }">
              <span class="link">{{ item.account + " - " + item.name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime">
          <el-input v-model="punish.stime" placeholder="请输入学期" size="large" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerCreatePunish">
            创建
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--    <el-dialog title="PDF预览" :visible.sync="dialogPdfVisible" @opened="loadPdf">-->
    <!--      <div ref="pdfContainer" style="width: 100%; height: 500px;"></div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { DocumentAdd } from "@element-plus/icons-vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
// const user = context?.$store.state.loginUser;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
let ruleForm = ref(<{}>{
  userAccount: "",
  fileInfo: "0",
  classes: ""
});
let dialogFormVisible = ref(<boolean>false);
let dialogPdfVisible = ref<boolean>(false);
let punish = ref(<{}>{
  sid: null,
  tid: user.userAccount,
  fileId: null,
  fileName: null,
  state: "0",
  fileInfo: "0",
  tname: null,
  fileUnt: null,
  stime: null
});
const teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
const studentList = JSON.parse(localStorage.getItem("studentList") as string);
let tableData = ref(<[]>[]);
let total = ref(0);
const pageSize = ref(10);
let tmpList = ref(<[]>[]);
const { proxy } = getCurrentInstance();

/**
 * 加载pdf文件
 */
// const loadPdf = () => {
//   const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
//   loadingTask.promise.then(pdf => {
//     pdf.getPage(1).then(page => {
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = document.createElement("canvas");
//       canvas.style.width = `${viewport.width}px`;
//       canvas.style.height = `${viewport.height}px`;
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       const context = canvas.getContext("2d");
//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport
//       };
//       page.render(renderContext).promise.then(() => {
//         proxy.$refs.pdfContainer.appendChild(canvas);
//       });
//     });
//   }).catch(error => {
//     console.error("Error loading PDF: ", error);
//     console.log("---");
//   });
// };

/**
 *
 * @param item
 */
let student_list = ref<{}[]>([]);
// 智能搜索
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? student_list.value.filter(createFilter(queryString))
    : student_list.value;
  console.log(results);
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
const handleSelect = (item: any) => {
  console.log(item);
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
 * 创建处分
 */
const handlerCreatePunish = () => {
  console.log(punish.value);

  context?.$myRequest({
    url: "/api/PR/createPR",
    method: "POST",
    data: punish.value
  }).then(function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "上传成功"
      });
      getTable();
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
 * 删除文件
 */
const handlerDeletePunish = (row: any) => {
  const form = {
    fileId: row.fileId
  };

  context?.$myRequest({
    url: "/api/PR/deletePunish",
    method: "POST",
    data: form
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
  });
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
            // console.log("teacher.tname = ");
            // console.log(teacher.tname);
          } else {
            // console.log("teacher.userAccount = ");
            // console.log(teacher.userAccount);
          }
        });
      });

      // 分页
      tmpList.value.splice(0);
      tmpList.value.push(...(res.data.data as []));
      total.value = res.data.data.length;
      // console.log("total = ")
      // console.log(total)
      let start = 0,
        end = pageSize.value;
      let length = tmpList.value.length;
      let ans = end < length ? end : length;
      tableData.value.splice(0);
      tableData.value.push(...tmpList.value.slice(start, ans));
      console.log(tableData.value);

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
};

// watch(ruleForm, (a, b) => {
//   getTable();
// });

watch(ruleForm, async (newValue, oldValue) => {
  await getTable();
}, { immediate: true, deep: true });
/**
 * 初始化
 */
onMounted(async () => {
  student_list.value.splice(0);
  studentList.forEach((item: any, index: number) => {
    student_list.value.push({ value: item.userAccount, account: item.userAccount, name: item.userName });
  });
});
</script>

<style scoped>

</style>