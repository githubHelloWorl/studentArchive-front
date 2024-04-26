<template>
  <div>
    <el-card class="box-card all">
      <!--分页-->
      <el-pagination
          style="margin-bottom: 20px;margin-left: 3%"
        ref="myPage"
        background
        layout="sizes, prev, pager, next"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
          :page-sizes="[10,20,30,50,100,1000,5000]"
        @size-change="handleSizeChange"
        @current-change="changePage"
      >
      </el-pagination>
      <el-table
        :data="tableData"
        border
        stripe style="width: 94%;margin-left: 3%"
        @select="onSelect"
        @select-all="selectAllChange"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="49" align="center"/>
        <el-table-column prop="userAccount" label="学号" width="120" align="center"/>
        <el-table-column prop="userName" label="姓名" width="140" align="center"/>
        <el-table-column prop="phone" label="手机号" width="140" align="center"/>
        <el-table-column prop="cardId" label="身份证号" width="180" align="center"/>
        <el-table-column prop="department" label="院系" width="180" align="center"/>
        <el-table-column prop="classes" label="班级" width="180" align="center"/>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
<!--            <el-button type="primary" style="width: 80px;" @click="handleClick(scope.row)">修改-->
<!--            </el-button>-->
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
    </el-card>

    <!--修改学生信息-->
    <el-dialog v-model="dialogFormVisible" title="修改学生信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="student" label-width="auto">
        <el-form-item label="学号" prop="userAccount">
          {{ student.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ student.userName }}
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input type="password" v-model="student.userPassword" placeholder="请输入密码" size="default"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkRePassword">
          <el-input type="password" v-model="student.checkRePassword" placeholder="请输入确认密码"
                    size="default"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePass">
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
  props: ["ruleForm", "query", "allDelete"],
  setup(props: any, content: any) {
    interface student {
      userAccount: "",
      userName: "",
      cardId: "",
      phone: "",
      department: "",
      classes: "",
      archiveId: "",
      sex: "",
      address: "",
      health: "",
      origin: "",
      nation: "",
      createTime: ""
    }

    const context = getCurrentInstance()?.appContext.config.globalProperties;
    const user = context?.$store.state.loginUser;
    let form = ref({});
    let dialogFormVisible = ref(false);
    let teacherList = JSON.parse(localStorage.getItem("teacherList") as string);
    let studentList = JSON.parse(localStorage.getItem("studentList") as string);
    let total = ref(0);
    const pageSize = ref(10);
    let tmpList = ref(<[]>[]);
    let tableData = ref([]);
    let student = ref(<{}>{});
    const studentInfoList = ref<student[]>([]);
    let currentPage = ref<number>(1);
    const { proxy }: any = getCurrentInstance();

    /**
     * 改变页码
     */
    const changePage = (page: number) => {
      currentPage.value = page;
      getTable();
    };

    /**
     * 条码更改
     */
    const handleSizeChange = (val: number) => {
      pageSize.value = val;
      getTable();
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
     *
     */
    const getTable = () => {
      form.value = {
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
        data: props.ruleForm
      };

      context?.$myRequest({
        url: "/api/user/queryUserArchive",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: { list: [], total: number }; message: String; }; }) {
        if (res.data.code === 0) {

          tableData.value.splice(0);
          tableData.value.push(...(res.data.data.list as []));
          total.value = res.data.data.total;

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
     * 监听 进行导出
     */
    watch(props.query, (newValue, oldValue) => {
      if (studentInfoList.value.length === 0) {
        context?.$message({ type: "warning", message: "您未选择任何数据" });
        return;
      }

      const headers = ["学号", "姓名", "身份证号", "手机号码", "院系", "班级", "档案编号", "性别", "地址", "健康", "生源地", "民族", "出生年月"];
      const data = studentInfoList.value.map(
        item => [item.userAccount, item.userName, item.cardId,
          item.phone, item.department, item.classes, item.archiveId,
          item.sex, item.address, item.health, item.origin,
          item.nation, item.createTime]);
      const value = { userRole: "student", headers: headers, data: data };
      context?.$store.dispatch("exportExcel", value);
    }, { immediate: false, deep: true });

    /**
     * 批量删除
     */
    const allDelete = () => {
      if (studentInfoList.value.length === 0) {
        context?.$message({ type: "warning", message: "您未选择任何数据" });
        return;
      }
      context?.$myRequest({
        url: "/api/user/allDelete",
        method: "POST",
        data: studentInfoList.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "档案修改成功"
          });

          context?.$myRequest({
            url: "/api/user/queryPostStudent",
            method: "POST",
            data: {}
          }).then(function(res: any) {
            if (res.data.code === 0) {

              studentList.splice(0);
              studentList.push(...(res.data.data as []));
              localStorage.setItem("studentList", JSON.stringify(studentList));

            } else {
              context?.$message({
                type: "error",
                message: res.data.message
              });
            }
          });

          getTable();

        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    };
    watch(props.allDelete, (newValue, oldValue) => {
      if (props.allDelete.a === 0) {
        return;
      }

      allDelete();

    }, { immediate: true, deep: true });

    /**
     * 监视选中的数据
     * @param rows
     * @param row
     */
    const onSelect = (rows: any, row: any) => {
    };

    const selectAllChange = (selection: any) => {
      //处理数据
    };

    const handleSelectionChange = (val: any) => {
      (studentInfoList as any).value.splice(0);
      (studentInfoList as any).value.push(...(val as []));
      console.log("studentIn")
      console.log(studentInfoList)
      // 这里输出所有已选中的proxy列表
    };

    /**
     * 修改学生信息
     * @param row
     */
    const updateUser = () => {
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

    /**
     *
     * @param row
     */
    const handleClick = (row: {}) => {
      student.value = { ...row };
      dialogFormVisible.value = true;
    };

    /**
     * 修改个人档案
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
      tableData,
      handleClick,
      dialogFormVisible,
      student,
      updatePass,
      changePage,
      handleSizeChange,
      total,
      tmpList,
      pageSize,
      currentPage,
      updateUser,
      deleteUser,
      onSelect,
      selectAllChange,
      handleSelectionChange
    };
  }
};

</script>

<style scoped>

</style>