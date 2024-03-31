<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 100%;" :key="tableKey">
        <el-table-column prop="userAccount" label="学号" width="120" />
        <el-table-column prop="userName" label="姓名" width="80" />
        <el-table-column prop="cardId" label="身份证号" width="180" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="department" label="院系" width="180" />
        <el-table-column prop="classes" label="班级" width="180" />
        <el-table-column prop="job" label="职务" width="100" />
        <el-table-column prop="duty" label="职称" width="100" />
        <el-table-column prop="unity" label="单位" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="handleClick(scope.row)">修改
            </el-button>
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
<!--      <el-form :model="teacher" :inline="true">-->
<!--        <el-form-item label="学号" prop="archiveId">-->
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

    <el-dialog v-model="dialogFormVisible" title="修改个人信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="user1">
        <el-form-item label="工号" prop="userAccount">
          {{ user1.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ user1.userName }}
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="user1.department" placeholder="请输入院系" size="default" />
        </el-form-item>
<!--        <el-form-item label="班级" prop="classes">-->
<!--          <el-input v-model="user1.classes" placeholder="请输入班级" size="default" />-->
<!--        </el-form-item>-->
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
import { ref, reactive, getCurrentInstance, onMounted, watch, toRef } from "vue";

export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {

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
     * 监听
     * 得到学生信息
     */
    watch(props.ruleForm, (newValue, oldValue) => {
      if (props.ruleForm.flag === 0) {
        return;
      }

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

    }, { immediate: true, deep: true });

    const handleClick = (row: {}) => {
      user1.value = row;
      // (teacher as any).value.userPassword = "";
      // (teacher as any).value.checkRePassword = "";
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

    return {
      tableData, handleClick, dialogFormVisible, teacher, updateUser, changePage, total, tmpList, pageSize,user1
    };
  }
};

</script>

<style scoped>

</style>