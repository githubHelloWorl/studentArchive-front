<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 94%; margin-left: 3%" @select="onSelect">
        <!--        <el-table-column type="selection" width="50" />-->
        <el-table-column prop="userAccount" label="工号" width="109" align="center"/>
        <el-table-column prop="userName" label="姓名" width="100" align="center"/>
        <el-table-column prop="phone" label="手机号" width="120" align="center"/>
        <el-table-column prop="cardId" label="身份证号" width="180" align="center"/>
        <el-table-column prop="department" label="院系" width="180" align="center"/>
        <el-table-column prop="job" label="职务" width="100" align="center"/>
        <el-table-column prop="duty" label="职称" width="100" align="center"/>
        <el-table-column prop="unity" label="单位" width="100" align="center"/>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
<!--            <el-button type="primary" style="width: 80px;" @click="handleClick(scope.row)">修改-->
<!--            </el-button>-->
            <el-popconfirm
              title="确定删除?"
              @confirm="deleteUser(scope.row)"
            >
              <template #reference>
                <el-button type="danger" style="width: 80px;">删除教师
                </el-button>
              </template>
            </el-popconfirm>
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

    <!--    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"-->
    <!--               style="max-width: 600px;">-->
    <!--      <el-form :model="teacher" :inline="true">-->
    <!--        <el-form-item label="工号" prop="archiveId">-->
    <!--          <el-input v-model="teacher.userAccount" size="large" :width="100" disabled />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="密码" prop="address">-->
    <!--          <el-input v-model="teacher.userPassword" placeholder="请输入密码" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="确认密码" prop="health">-->
    <!--          <el-input v-model="teacher.checkRePassword" placeholder="请输入确认密码" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button @click="dialogFormVisible = false">取消</el-button>-->
    <!--          <el-button type="primary" @click="updatePass">-->
    <!--            确认-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->

    <el-dialog v-model="dialogFormVisible" title="修改教师信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="user1" label-width="auto">
        <el-form-item label="工号" prop="userAccount">
          {{ user1.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ user1.userName }}
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="user1.department" placeholder="请输入院系" size="default" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user1.phone" placeholder="请输入手机号" size="default" />
        </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input v-model="user1.job" placeholder="请输入职务" size="default" />
        </el-form-item>
        <el-form-item label="职称" prop="duty">
          <el-input v-model="user1.duty" placeholder="请输入职称" size="default" />
        </el-form-item>
        <el-form-item label="单位" prop="unity">
          <el-input v-model="user1.unity" placeholder="请输入单位" size="default" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">
            修改
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import {getCurrentInstance, ref, watch} from "vue";

export default {
  props: ["ruleForm", "query"],
  setup(props: any, content: any) {

    interface teacher {
      userAccount: "",
      userName: "",
      cardId: "",
      phone: "",
      department: "",
      job: "",
      duty: "",
      unit: ""
    }

    const teacherInfoList = ref<teacher[]>([]);
    const context = getCurrentInstance()?.appContext.config.globalProperties;
    const user = context?.$store.state.loginUser;
    let teacher = ref(<{}>{
      checkRePassword: "",
      userPassword: ""
    });
    let form = ref({});
    let dialogFormVisible = ref(false);
    let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
    let total = ref(0);
    const pageSize = ref(10);
    let tmpList = ref(<[]>[]);
    let tableKey = ref(0);
    let tableData = ref([]);
    let user1 = ref({});

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
     * 删除学生
     */
    const deleteUser = (row: {}) => {
      context?.$myRequest({
        url: "/api/user/deleteUser",
        method: "POST",
        data: row
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "删除成功"
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
     * 监听
     * 得到学生信息
     */
    const getTable = () => {
      form.value = props.ruleForm;

      context?.$myRequest({
        url: "/api/user/queryUser",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {
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
            messag: res.data.message
          });
        }

        props.ruleForm.flag = 0;
      });
    };
    watch(props.ruleForm, (newValue, oldValue) => {
      if (props.ruleForm.flag === 0) {
        return;
      }

      getTable();

      props.ruleForm.flag = 0;

    }, { immediate: true, deep: true });

    /**
     * 监视选中的数据
     * @param rows
     * @param row
     */
    const onSelect = (rows: any, row: any) => {
      (teacherInfoList as any).value.splice(0);
      (teacherInfoList as any).value.push(...(rows as []));
      console.log(teacherInfoList)
    };

    /**
     * 监听 进行导出
     */
    watch(props.query, (newValue, oldValue) => {
      // console.log("studentInfoList =")
      // console.log(studentInfoList.value)
      if (teacherInfoList.value.length === 0) {
        context?.$message({ type: "warning", message: "您未选择任何数据" });
        return;
      }

      const headers = ["学号", "姓名", "身份证号", "手机号码", "院系", "职务", "职称", "单位"];
      const data = teacherInfoList.value.map(item => [item.userAccount, item.userName, item.cardId, item.phone, item.department, item.job, item.duty, item.unit]);
      const value = { userRole: "teacher", headers: headers, data: data };
      context?.$store.dispatch("exportExcel", value);
      // console.log(...data)
      // const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      // const moment = require("moment");
      // const formattedTime = moment().format("YYYYMMDDHHmmss");
      // XLSX.writeFile(workbook, formattedTime + ".xlsx");
    }, { immediate: false, deep: true });

    const handleClick = (row: {}) => {
      user1.value = { ...row };
      dialogFormVisible.value = true;
    };

    /**
     * 修改信息
     */
    const updateUser = () => {
      console.log(user1.value);
      context?.$myRequest({
        url: "/api/user/updateUser",
        method: "POST",
        data: user1.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "档案修改成功"
          });
          // const date = new Date(archive.value.createTime);
          // console.log(date.toLocaleDateString());
          localStorage.setItem("loginUser", JSON.stringify(res.data.data));
          user.value = res.data.data;

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

    return {
      tableData, handleClick, dialogFormVisible, teacher, updateUser, changePage, total, tmpList, pageSize, user1, deleteUser, onSelect
    };
  }
};

</script>

<style scoped>

</style>