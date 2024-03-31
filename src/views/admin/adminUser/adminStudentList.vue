<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="userAccount" label="学号" width="120" />
        <el-table-column prop="userName" label="姓名" width="80" />
        <el-table-column prop="cardId" label="身份证号" width="180" />
        <el-table-column prop="phone" label="手机号码" width="140" />
        <el-table-column prop="department" label="院系" width="180" />
        <el-table-column prop="classes" label="班级" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" style="width: 80px;" @click="handleClick(scope.row)">修改
            </el-button>
            <el-popconfirm
              title="确定删除?"
              @confirm="deleteUser(scope.row)"
            >
              <template #reference>
                <el-button type="danger" style="width: 80px;">删除学生
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
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
    <!--      <el-form :model="student" :inline="true">-->
    <!--        <el-form-item label="学号" prop="archiveId">-->
    <!--          <el-input v-model="student.userAccount" size="large" :width="100" disabled />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="密码" prop="address">-->
    <!--          <el-input v-model="student.userPassword" placeholder="请输入密码" size="large" :width="100" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="确认密码" prop="health">-->
    <!--          <el-input v-model="student.checkRePassword" placeholder="请输入确认密码" size="large" :width="100" />-->
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


    <el-dialog v-model="dialogFormVisible" title="修改个人信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="student">
        <el-form-item label="学号" prop="userAccount">
          {{ student.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ student.userName }}
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="student.department" placeholder="请输入院系" size="default" />
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="student.classes" placeholder="请输入班级" size="default" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="student.phone" placeholder="请输入手机号" size="default" />
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
import { ref, reactive, getCurrentInstance, onMounted, watch, toRef } from "vue";


export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {

    const context = getCurrentInstance()?.appContext.config.globalProperties;
    const user = context?.$store.state.loginUser;
    // let student = ref(<{}>{
    //   checkRePassword: ""
    // });
    let form = ref({});
    let dialogFormVisible = ref(false);
    let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
    let total = ref(0);
    const pageSize = ref(10);
    let tmpList = ref(<[]>[]);
    let tableData = ref([]);
    let student = ref(<{}>{});

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
      console.log(student.value);
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
     *
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
          // console.log("total = ")
          // console.log(total)
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
    /**
     * 监听
     * 得到学生信息
     */
    watch(props.ruleForm, (newValue, oldValue) => {
      if (props.ruleForm.flag === 0) {
        return;
      }
      getTable();

    }, { immediate: true, deep: true });

    /**
     * 修改学生信息
     * @param row
     */
    const updateUser = () => {
      console.log(student.value);
      context?.$myRequest({
        url: "/api/user/updateUser",
        method: "POST",
        data: student.value
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

          // console.log(archive);
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
     *
     * @param row
     */
    const handleClick = (row: {}) => {
      student.value = row;
      // (student as any).value.userPassword = "";
      // (student as any).value.checkRePassword = "";
      dialogFormVisible.value = true;
    };

    /**
     * 修改档案
     */
    const updatePass = () => {

      context?.$myRequest({
        url: "/api/user/updatePass",
        method: "POST",
        data: student.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "密码修改成功"
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

    return {
      tableData, handleClick, dialogFormVisible, student, updatePass, changePage, total, tmpList, pageSize, updateUser, deleteUser
    };
  }
};

</script>

<style scoped>

</style>