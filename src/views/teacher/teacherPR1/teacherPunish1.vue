<!--处分-->
<template>
  <div style="border: solid 0px red">
    <el-card
      class="box-card all"
      style="margin-bottom: 10px; margin-top: -20px"
    >
      <el-form
        :model="ruleForm"
        :inline="true"
        style="width: 100%; margin: 20px 0 0 1%"
      >
        <el-form-item label="学号" prop="userAccount">
          <el-input
            v-model="ruleForm.userAccount"
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <!--        <el-form-item label="姓名" prop="userName">-->
        <!--          <el-input v-model="ruleForm.userName" style="width: 180px;"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="班级" prop="classes">
          <el-input v-model="ruleForm.classes" style="width: 180px"></el-input>
        </el-form-item>
        <!--        <el-form-item label="处分名称" prop="fileName">-->
        <!--          <el-input v-model="ruleForm.fileName" style="width: 180px;"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
      <div>
        <el-button
          class="button"
          type="primary"
          @click="handlerCreatePunishDialog"
          style="width: 100px"
          >新增处分
          <!--          <el-icon style="margin-right: 5px;">-->
          <!--            <DocumentAdd />-->
          <!--          </el-icon>-->
        </el-button>
        <el-button type="primary" style="width: 100px" @click="handlerQuery"
          >查询
        </el-button>
      </div>
    </el-card>

    <!-- 表格 -->
    <el-card class="box-card all">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 94%; margin-left: 3%"
      >
        <el-table-column
          prop="fileId"
          label="处分编号"
          width="160"
          align="center"
        />
        <el-table-column
          prop="fileName"
          label="处分名称"
          width="90"
          align="center"
        />
        <el-table-column
          prop="stime"
          label="学年学期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="sid"
          label="学生学号"
          width="120"
          align="center"
        />
        <el-table-column
          prop="userName"
          label="学生姓名"
          width="100"
          align="center"
        />
        <el-table-column
          prop="department"
          label="院系"
          width="120"
          align="center"
        />
        <el-table-column
          prop="classes"
          label="班级"
          width="180"
          align="center"
        />
        <el-table-column
          prop="submitTime"
          label="创建时间"
          width="90"
          align="center"
        >
          <template #default="scope">
            {{ new Date(scope.row.submitTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="发布教师" width="100" align="center">
          <template #default="scope">
            {{ scope.row.tname }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" :width="200">
          <template #default="scope">
            <el-button type="primary" @click="handlerQueryPunish(scope.row)"
              >查看
            </el-button>
            <el-button type="warning" @click="handlerDeletePunish(scope.row)"
              >撤回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 20px 0 0 3%"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      v-model="dialogFormVisible"
      title="新增处分"
      label-position="left"
      label-width="auto"
      style="max-width: 800px"
    >
      <el-form :model="punish" label-width="auto" :inline="true">
        <el-form-item label="学生姓名" prop="userName" :width="150">
          <el-autocomplete
            v-model="punish.sid"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            clearable
            class="inline-input w-50"
            placeholder="请输入处分学生"
            @select="handleSelect"
            style="width: 200px"
          >
            <template #default="{ item }">
              <span class="link">{{
                item.userAccount + " - " + item.userName + " - " + item.cardId
              }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="学生学号" prop="" :width="150">
          <el-input
            v-model="studentPunish.userAccount"
            size="large"
            :width="100"
            :disabled="true"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="院系" prop="" :width="150">
          <el-input
            v-model="studentPunish.department"
            size="large"
            :width="100"
            :disabled="true"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="班级" prop="" :width="150">
          <el-input
            v-model="studentPunish.classes"
            size="large"
            :width="100"
            :disabled="true"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="处分名称" prop="fileName" :width="150">
          <el-input
            v-model="punish.fileName"
            placeholder="请输入处分名称"
            size="large"
            :width="100"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="处分原因" prop="" :width="150">
          <el-input
            type="textarea"
            v-model="punishInfoRequest.fileReason"
            placeholder="请输入处分原因"
            :row="2"
            :width="100"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="处分类别" prop="" :width="150">
          <el-select
            placeholder="请选择处分类别"
            v-model="punishInfoRequest.type"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileType"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处分级别" prop="" :width="150">
          <el-select
            placeholder="请选择处分级别"
            v-model="punishInfoRequest.level"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileLevel"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处分周期" prop="" :width="150">
          <el-select
            placeholder="请选择处分周期"
            v-model="punishInfoRequest.circle"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileCircle"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime" :width="150">
          <el-input
            v-model="punish.stime"
            placeholder="请输入学期"
            size="large"
            :width="100"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="/api/files/upload"
            list-type="picture"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
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

    <!-- 修改punish -->
    <el-dialog
      v-model="dialogFormPunishVisible"
      title="查看处分"
      label-position="left"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form :model="punish" label-width="auto" :inline="false">
        <el-form-item label="处分编号" prop="userName" :width="150">
          {{ queryRow.fileId }}
        </el-form-item>
        <el-form-item label="学生学号" prop="" :width="150">
          {{ queryRow.sid }}
        </el-form-item>
        <el-form-item label="学生姓名" prop="userName" :width="150">
          {{ queryRow.userName }}
        </el-form-item>
        <!--        <el-form-item label="院系" prop="" :width="150">-->
        <!--          {{ queryRow.department }}-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="班级" prop="" :width="150">-->
        <!--          {{ queryRow.classes }}-->
        <!--        </el-form-item>-->
        <el-form-item label="处分名称" prop="fileName" :width="150">
          <el-input v-model="queryRow.fileName"></el-input>
        </el-form-item>
        <el-form-item label="处分原因" prop="" :width="150">
          <el-input
            type="textarea"
            v-model="punishInfoRequest.filereason"
          />
        </el-form-item>
        <el-form-item label="处分类别" prop="" :width="150">
          <el-select
            placeholder="请选择处分类别"
            v-model="punishInfoRequest.type"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileType"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处分级别" prop="" :width="150">
          <el-select
            placeholder="请选择处分级别"
            v-model="punishInfoRequest.level"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileLevel"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处分周期" prop="" :width="150">
          <el-select
            placeholder="请选择处分周期"
            v-model="punishInfoRequest.circle"
            style="width: 200px"
            size="large"
          >
            <el-option
              v-for="(item, index) in store.state.fileCircle"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年学期" prop="stime" :width="150">
          <el-input
            v-model="queryRow.stime"
            placeholder="请输入学期"
            size="large"
          />
        </el-form-item>
        <el-form-item label="处分图片" >
          <el-image
            v-if="queryRow.filePath"
            style="max-width: 300px; max-height: 300px"
            :src="imageUrl"
            fit="contain">
          </el-image>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="/api/files/upload"
            list-type="picture"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary">更新图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormPunishVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerUpdatePunish">
            更新
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { DocumentAdd } from "@element-plus/icons-vue";
import type {
  UploadProps,
  UploadUserFile,
  UploadInstance,
  UploadRawFile,
} from "element-plus";
import { genFileId } from "element-plus";

interface studentPunishInter {
  userAccount: String;
  userName: String;
  department: String;
  classes: String;
}

interface punishInfo {
  fileReason: String;
  type: String;
  level: String;
  circle: String;
}

const imageUrl = ref();
const dialogFormPunishVisible = ref<boolean>(false);
const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = JSON.parse(localStorage.getItem("loginUser") as string);
let ruleForm = ref(<{}>{
  userAccount: "",
  userName: "",
  fileInfo: "0",
  fileName: "",
  classes: "",
});
let dialogFormVisible = ref(<boolean>false);
let dialogPdfVisible = ref<boolean>(false);
let punish = ref(<{}>{
  sid: null,
  tid: user.userAccount,
  fileId: null,
  fileName: null,
  filePath: null,
  state: "2",
  fileInfo: "0",
  tname: null,
  fileUnt: null,
  stime: null,
});
const teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
const studentList = JSON.parse(localStorage.getItem("studentList") as string);
let tableData = ref(<[]>[]);
let total = ref(0);
const pageSize = ref(10);
let tmpList = ref(<[]>[]);
const { proxy } = getCurrentInstance();
let studentPunish = ref<studentPunishInter>();
const store = useStore();
const punishInfoRequest = ref<punishInfo>({
  fileReason: "",
  type: "",
  level: "",
  circle: "",
});
const upload = ref<String>("");
const queryRow = ref({});

/**
 * @param item
 */
let student_list = ref<{}[]>([]);
/**
 *
 * @param queryString 输入的参数
 * @param cb
 */
// 智能搜索
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? student_list.value.filter(createFilter(queryString))
    : student_list.value;
  console.log(results);
  // call callback function to return suggestions
  cb(results);
};
/**
 *
 * @param queryString 自己输入的参数
 */
const createFilter = (queryString: string) => {
  // restaurant 例子中包含的对象
  return (restaurant: any) => {
    // return (
    //   restaurant.userName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    // );
    if (queryString.length <= 11) {
      return (
        restaurant.userAccount
          .toLowerCase()
          .indexOf(queryString.toLowerCase()) === 0
      );
    } else {
      return (
        restaurant.cardId.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    }
  };
};
const handleSelect = (item: any) => {
  console.log(item);
  studentPunish.value = { ...item };
};

const handlerCreatePunishDialog = () => {
  // 清空 upload
  upload.value = "";
  punish.value.sid = "";
  studentPunish.value = {
    userAccount: "",
    userName: "",
    department: "",
    classes: "",
  };
  punishInfoRequest.value = {
    fileReason: "",
    type: "",
    level: "",
    circle: ""
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
 * 创建处分
 */
const handlerCreatePunish = () => {
  console.log(punish.value);
  console.log(punishInfoRequest.value);

  let formData = new FormData();
  formData.append("reward", JSON.stringify((punish as any).value));
  formData.append("punishInfoRequest", JSON.stringify(punishInfoRequest.value));

  context
    ?.$myRequest({
      url: "/api/PR/createPR",
      method: "POST",
      data: formData,
    })
    .then(function (res: any) {
      if (res.data.code === 0) {
        context?.$message({
          type: "success",
          message: "上传成功",
        });
        getTable();
      } else {
        context?.$message({
          type: "error",
          message: res.data.message,
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
    fileId: row.fileId,
  };

  context
    ?.$myRequest({
      url: "/api/PR/deletePunish",
      method: "POST",
      data: form,
    })
    .then(async function (res: any) {
      if (res.data.code === 0) {
        context?.$message({
          type: "success",
          message: "撤回成功",
        });

        await getTable();
      } else {
        context?.$message({
          type: "error",
          message: res.data.message,
        });
      }
    });
};

/**
 * 得到数据
 */
const getTable = () => {
  context
    ?.$myRequest({
      url: "/api/PR/queryPRByTeacher",
      method: "POST",
      data: ruleForm.value,
    })
    .then(function (res: any) {
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
          message: res.data.message,
        });
      }
    });
};

/**
 * 更新处分
 */
const handlerUpdatePunish = () => {
  let formData = new FormData();
  queryRow.value.filePath = upload.value;
  formData.append("PR", JSON.stringify((queryRow as any).value));
  formData.append("punishInfoRequest", JSON.stringify(punishInfoRequest.value));

  context
    ?.$myRequest({
      url: "/api/PR/updatePR",
      method: "POST",
      data: formData,
    })
    .then(function (res: any) {
      if (res.data.code === 0) {
        context?.$message({
          type: "success",
          message: "更改成功",
        });
        getTable();
      } else {
        context?.$message({
          type: "error",
          message: res.data.message,
        });
      }

      dialogFormPunishVisible.value = false;
    });
}

/**
 * 搜寻到处分
 * @param row
 */
const handlerQueryPunish = (row: any) => {
  console.log(row);
  // queryRow.value = { ...row }
  upload.value = "";

  context
    ?.$myRequest({
      url: "/api/punish/getAllByFileid?fileId="+row.fileId,
      method: "GET"
    })
    .then(function (res: any) {
      if (res.data.code === 0) {
        queryRow.value = { ...row };

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

        punishInfoRequest.value = { ...res.data.data }
        upload.value = "";
        dialogFormPunishVisible.value = true;
      } else {
        context?.$message({
          type: "error",
          message: res.data.message,
        });
      }
    });
};

/**
 * 进行查询
 */
const handlerQuery = async () => {
  await getTable();
};

/**
 * 上传成功后的图片
 * @param response
 * @param file
 * @param fileList
 */
const handleAvatarSuccess = (response: any, file: any, fileList: []) => {
  console.log(response);
  if (response.code === 0) {
    upload.value = response.data;
    punish.value.filePath = response.data;
  } else {
    context?.$message({ type: "error", message: "文件上传失败" });
  }
};

/**
 * 上传图片组件->上传图片之前触发的钩子函数
 * @param rawFile
 */
const beforeAvatarUpload: UploadProps["beforeUpload"] = async (
  rawFile: any
) => {
  console.log("图片类型: ");
  console.log(rawFile.type);
  if (upload.value !== "") {
    context?.$message({ type: "error", message: "已选择了图片" });
    return false;
  }

  if (!["image/png", "image/jpg", "image/jpeg"].includes(rawFile.type)) {
    context?.$message({ type: "error", message: "上传文件格式务必PNG|JPG" });
    return false;
  } else if (rawFile.size / 1024 / 1024 > 4) {
    context?.$message({ type: "error", message: "上传文件大小小于4M" });
    return false;
  }
  // 取消默认的上传请求
  return true;
};

/**
 * 初始化
 */
onMounted(async () => {
  student_list.value.splice(0);
  studentList.forEach((item: any, index: number) => {
    student_list.value.push({
      value: item.userAccount,
      userAccount: item.userAccount,
      userName: item.userName,
      department: item.department,
      classes: item.classes,
      cardId: item.cardId,
    });
  });
});
</script>

<style scoped></style>
