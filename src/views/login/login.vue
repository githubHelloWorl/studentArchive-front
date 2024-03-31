<template>
  <div>
    <div class="login_view">
      <el-card style="height: 280px;width: 400px; border-radius: 5%;">
        <template #header>
          <div style="margin-right: 5px;margin-left: 75%;">
<!--            <el-button type="text" @click="handlerNotice">查看通知</el-button>-->
          </div>
        </template>

        <el-form :model="loginForm" class="login_form" style="border: solid 0px red;margin-top: 0px;">
          <!--        <div class="title_view">学生档案管理系统登录</div>-->
          <el-form-item prop="username" label="账号">
            <el-input v-model="loginForm.userAccount" placeholder="请输入账号" size="large" />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="loginForm.userPassword" type="password" placeholder="请输入密码" size="large"
                      show-password />
          </el-form-item>
          <el-form-item prop="" style="margin: auto;">
            <el-space :size="10" style="margin-left:30%;">
              <el-button class="login" type="success" @click="handleLogin">登录</el-button>
              <el-button class="login" type="success" @click="toRegister">注册</el-button>
            </el-space>
            <div style="margin-left: 10px;border: solid 0px red;">
              <el-button type="text" @click="dialogFormVisible = true">忘记密码</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog v-model="dialogFormVisible" title="找回密码" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="passForm">
        <el-form-item label="身份证号" prop="cardId">
          <el-input v-model="passForm.cardId" placeholder="请输入身份证号" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="  密码" prop="userPassword">
          <el-input v-model="passForm.userPassword" placeholder="请输入密码" size="large" type="password"
                    show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkRePassword">
          <el-input v-model="passForm.checkRePassword" placeholder="请输入确认密码" size="large" type="password"
                    show-password />
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

<script setup lang="ts">
/**
 * 引入组件
 */

import {
  ref, watch, reactive,
  getCurrentInstance,
  onMounted
} from "vue";

const loginForm = ref({
  userAccount: "",
  userPassword: ""
});
const passForm = ref({
  cardId: "",
  userPassword: "",
  checkRePassword: ""
});

let dialogFormVisible = ref(false);
let dialogFormVisible1 = ref(<boolean>false);
let tableData: {}[] = reactive([]);
let teacherList = reactive(<[]>[]);
let studentList = reactive(<[]>[]);
const context = getCurrentInstance()?.appContext.config.globalProperties;

/**
 * 得到通知
 */
const handlerNotice = () => {

  dialogFormVisible1.value = true;

  context?.$myRequest({
    url: "/api/notice/queryNotice?noticeTitle=",
    method: "GET"
  }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
    if (res.data.code === 0) {

      // 进行赋值
      tableData.splice(0);
      tableData.push(...res.data.data);

    } else {
      context?.$message({
        type: "error",
        messag: res.data.message
      });
    }
  });

};

/**
 * 登录
 */
const handleLogin = () => {
  const form = {
    userAccount: loginForm.value.userAccount,
    userPassword: loginForm.value.userPassword
  };

  context?.$myRequest({ url: "/api/user/login", method: "POST", data: form }).then(function(res) {
    if (res.data.code === 0) {
      context?.$store.dispatch("setUser", res.data.data);

      localStorage.setItem("loginUser", JSON.stringify(res.data.data));

      context?.$myRequest({
        url: "/api/user/queryUserByRole?userRole=teacher",
        method: "GET"
      }).then(function(res: any) {
        if (res.data.code === 0) {

          teacherList.splice(0);
          teacherList.push(...(res.data.data as []));
          localStorage.setItem("teacherList", JSON.stringify(teacherList));

        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
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

      context?.$message({ type: "success", message: "登录成功" });
      if (res.data.data.userRole === "student") {
        context?.$router.replace("/studentArchive2");
      } else if (res.data.data.userRole === "teacher") {
        context?.$router.replace("/teacherInfo");
      } else if (res.data.data.userRole === "admin") {
        context?.$router.replace("/adminInfo");
      }

    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
  });
};

/**
 * 去注册
 */
const toRegister = () => {
  context?.$router.push("/register");
};

/**
 * 忘记密码
 */
const updatePass = () => {
  const form = {
    cardId: passForm.value.cardId,
    userPassword: passForm.value.userPassword,
    checkRePassword: passForm.value.checkRePassword
  };

  context?.$myRequest({
    url: "/api/user/updatePass",
    method: "POST",
    data: form
  }).then(function(res) {
    if (res.data.code === 0) {
      context?.$message({ type: "success", message: "密码重置成功" });
    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
    dialogFormVisible.value = false;
  });
};

</script>

<style scoped>
.login_view {
  background-repeat: no-repeat;
  flex-direction: column;
  background-size: cover;
  background: url("@/assets/background.png");
  display: flex;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  background-position: center center;
  /* 表单盒子 */

  .login_form {
    border-radius: 50px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, .5);
    /*padding: 30px 100px;*/
    background: #fff;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

}

.login {
  border: 0;
  cursor: pointer;
  padding: 0 24px;
  margin: auto;
  outline: none;
  color: #fff;
  background: rgba(24, 140, 145, 1);
  font-weight: bold;
  width: 80px;
  font-size: 18px;
  height: 33px;
}
</style>