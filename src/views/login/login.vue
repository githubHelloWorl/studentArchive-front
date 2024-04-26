<!--登录-->
<template>
  <div>
    <div class="login_view">
      <el-card style="height: 400px; width: 500px; border-radius: 5%;">
        <template #header>
          <div style="margin: auto;">
            <span><el-text type="primary"
                           style="font-family: 隶书;font-size: 45px;text-align: center;">学生档案管理</el-text></span>
          </div>
        </template>

        <el-form :model="loginForm" class="login_form" style="border: solid 0px red; margin-top: 0px;"
                 label-width="auto">
          <el-form-item prop="username" label="账号">
            <el-input v-model="loginForm.userAccount" placeholder="请输入账号" size="large" />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="loginForm.userPassword" type="password" placeholder="请输入密码" size="large"
                      show-password/>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="sidentifyMode" clearable placeholder="请输入验证码" style="width: 65%;"
                      size="large"></el-input>
            <SIdentify :identifyCode="identifyCode" @click="refreshCode" class="captcha"></SIdentify>
          </el-form-item>
          <el-form-item prop="" style="margin: auto;">
            <el-space :size="30" style="margin: auto;">
              <el-button class="login" type="success" @click="handleLogin">登录</el-button>
              <el-button class="login" type="success" @click="toRegister">注册</el-button>
            </el-space>
            <div style="margin-left: 20px;border: solid 0px red;">
              <el-button type="text" @click="dialogFormVisible = true">忘记密码</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog v-model="dialogFormVisible" title="找回密码" label-position="left" label-width="auto"
               style="width: 500px; border-radius: 20px; padding: 20px 30px 20px 30px;">
      <el-form :model="passForm" label-width="auto">
        <el-form-item label="学/工号" prop="cardId">
          <el-input v-model="passForm.userAccount" placeholder="请输入学号/工号" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="姓名" prop="cardId">
          <el-input v-model="passForm.userName" placeholder="请输入姓名" size="large" :width="100" />
        </el-form-item>
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
          <el-button @click="dialogFormVisible = false" style="width: 100px">取消</el-button>
          <el-button type="primary" @click="updatePass" style="width: 100px">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 引入组件
 */
import SIdentify from "@/views/login/Sidentify.vue";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";

const loginForm = ref({
  userAccount: "",
  userPassword: ""
});
const passForm = ref({
  userAccount: "",
  userName: "",
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


let sidentifyMode = ref(""); //输入框验证码
let identifyCode = ref(""); //图形验证码
let identifyCodes = ref("1234567890abcdefjhijklinopqrsduvwxyz"); //验证码出现的数字和字母

//组件挂载
onMounted(() => {
  identifyCode.value = "";
  makeCode(identifyCodes.value, 4);
});

// 生成随机数
const randomNum = (min: number, max: number) => {
  max = max + 1;
  return Math.floor(Math.random() * (max - min) + min);
};

// 随机生成验证码字符串
const makeCode = (o: string, l: number) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += o[randomNum(0, o.length)];
  }
  if (identifyCode.value.length !== 4) {
    refreshCode();
  }
};
// 更新验证码
const refreshCode = () => {
  identifyCode.value = "";
  makeCode(identifyCodes.value, 4);
  console.log(identifyCode.value);
};

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

  if (sidentifyMode.value !== identifyCode.value) {
    context?.$message({
      type: "error",
      message: "验证码不正确,请重新输入"
    });
    refreshCode();
    return;
  }

  context?.$myRequest({url: "/api/user/login", method: "POST", data: form}).then(function (res) {
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

const aaa = () => {
  console.log(identifyCode.value);
};

/**
 * 忘记密码
 */
const updatePass = () => {
  context?.$myRequest({
    url: "/api/user/updatePass",
    method: "POST",
    data: passForm.value
  }).then(function(res: { data: { code: number; message: any; }; }) {
    if (res.data.code === 0) {
      context?.$message({ type: "success", message: "密码重置成功" });
    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
    dialogFormVisible.value = false;
  });
};
</script>
//登录页面背景
<style scoped>
.login_view {
  flex-direction: column;
  display: flex;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url("@/assets/background6.png");
  background-size: cover;


  .login_form {
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, .5);
    background: #ffff;
    justify-content: center;
    flex-wrap: wrap;
    padding: 20px 25px;
  }

  .captcha {
    border-radius: 10px;
    margin-left: 3%;
    border: #e3dede 1px solid;
    height: 76%;
  }
}

.login {
  border-radius: 15px;
  cursor: pointer;
  padding: 0 25px;
  outline: none;
  color: #fff;
  background: rgb(29, 137, 197);
  font-weight: bold;
  width: 135px;
  font-size: 20px;
  height: 40px;
}
</style>