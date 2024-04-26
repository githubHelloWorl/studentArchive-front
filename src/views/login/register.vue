<!--注册-->
<template>
  <div>
    <div class="login_view">
      <el-card style="height: 450px; width: 500px; border-radius: 5%;">
        <el-form
            :model="loginForm"
            class="login_form"
            label-position="right"
            label-width="auto"
            style="border: solid 0px red"
        >
          <el-form-item prop="userAccount" label="账号">
            <el-input
                v-model="loginForm.userAccount"
                placeholder="请输入账号"
            />
          </el-form-item>
          <el-form-item prop="userPassword" label="密码">
            <el-input
                v-model="loginForm.userPassword"
                placeholder="请输入密码"
                show-password
                type="password"
            />
          </el-form-item>
          <el-form-item prop="checkRePassword" label="确认密码">
            <el-input
                v-model="loginForm.checkRePassword"
                placeholder="请输入确认密码"
                show-password
                type="password"
            />
          </el-form-item>
          <el-form-item prop="userName" label="姓名">
            <el-input v-model="loginForm.userName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item prop="cardId" label="身份证号">
            <el-input v-model="loginForm.cardId" placeholder="请输入身份证号" />
          </el-form-item>
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="userFole" label="角色">
            <el-radio-group v-model="loginForm.userRole">
              <el-radio value="student">学生</el-radio>
              <el-radio value="teacher">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-space :size="45" style="margin: auto;">
              <el-button class="login" type="success" @click="handleRegister">注册</el-button>
              <el-button class="login" type="success" @click="toLogin">返回</el-button>
            </el-space>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref} from "vue";

const aaa = () => {
};

const loginForm = ref({
  userAccount: "",
  userName: "",
  userPassword: "",
  checkRePassword: "",
  cardId: "",
  userRole: "",
  phone: "",
  department: "",
  classes: ""
});

let myDC: any = reactive({});
let myD: any[] = reactive([]);
var myC: any[] = reactive([]);

const context = getCurrentInstance()?.appContext.config.globalProperties;

/**
 * 登录
 */
const handleRegister = () => {
  const form = {
    userAccount: loginForm.value.userAccount,
    userName: loginForm.value.userName,
    userPassword: loginForm.value.userPassword,
    checkRePassword: loginForm.value.checkRePassword,
    cardId: loginForm.value.cardId,
    userRole: loginForm.value.userRole,
    phone: loginForm.value.phone,
    department: loginForm.value.department,
    classes: loginForm.value.classes
  };

  context?.$myRequest({ url: "/api/user/register", method: "POST", data: form }).then(function(res: any) {
    // if(res.data.code)
    if (res.data.code === 0) {
      context?.$message({ type: "success", message: "注册成功" });
      context?.$router.replace("/");
    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
  });

};

/**
 * 去注册
 */
const toLogin = () => {
  context?.$router.push("/");
};

const selectClass = () => {
  if (loginForm.value.department === "") {
    context?.$message({ type: "error", message: "请先选择院系" });
    return;
  }
  myC.splice(0);
  myDC[loginForm.value.department].forEach((item: any, index: any) => {
    myC.push({ label: item, value: item });
  });
};

/**
 * 初始化
 */
onMounted(() => {
  context?.$myRequest({
    url: "/api/user/getDC",
    method: "GET"
  }).then(function(res: any) {
    console.log(res.data.data);
    myD.splice(0);
    Object.keys(res.data.data).forEach((item, index) => {
      myD.push({ label: item, value: item });
    });
    myDC = res.data.data;
  });
});
</script>

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
}

.login {
  border-radius: 15px;
  cursor: pointer;
  padding: 0 25px;
  outline: none;
  color: #fff;
  background: rgb(29, 159, 164);
  font-weight: bold;
  width: 150px;
  font-size: 18px;
  height: 40px;
}

.login_form {
  border-radius: 50px;
  background: #fff;
  width: 100%;
  height: 100%;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 20px;
}
</style>
