<template>
  <div>
    <el-card
      style="width: 100%;margin-bottom: 10px; height: 84px;background-color: #293642;text-align: center;padding-top: 0px;">
      <el-row>
        <el-col :span="10" class="gird"></el-col>
        <el-col :span="10" class="gird"></el-col>
        <el-col :span="4" class="gird" :wrap="true">
          <el-dropdown>
            <el-avatar :size="60"
                       style="margin-top: -5px;"
                       src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button type="warning" @click="dialogFormVisible = true" style="width: 110px;">修改密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="danger" style="width: 110px;" @click="logout">退出</el-button>
<!--                  <el-popconfirm-->
<!--                    title="确定退出?"-->
<!--                    @confirm="logout"-->
<!--                  >-->
<!--                    <template #reference>-->
<!--                      -->
<!--                    </template>-->
<!--                  </el-popconfirm>-->
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <!--        <el-col :span="4" class="gird">-->
        <!--          <span style="color: white;line-height: 64px;">当前角色:&nbsp;</span>-->
        <!--          <el-text>{{ context?.$store.state.loginUser.userRole === "student" ? "学生" : "教师" }}</el-text>-->
        <!--        </el-col>-->
      </el-row>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="找回密码" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="passForm" :inline="true">
        <!--        <el-form-item label="身份证号" prop="cardId">-->
        <!--          <el-input v-model="passForm.cardId" placeholder="请输入身份证号" size="large" :width="100" />-->
        <!--        </el-form-item>-->
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
import { getCurrentInstance, ref } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = JSON.parse(localStorage.getItem("loginUser") as string) || {};
// const user = localStorage.getItem("user");
// console.log(user)

let dialogFormVisible = ref(<boolean>false);
let passForm = ref(<{}>{
  cardId: user.cardId,
  userPassword: "",
  checkRePassword: ""
});

/**
 * 忘记密码
 */
const updatePass = () => {
  const form = {
    cardId: (passForm as any).value.cardId,
    userPassword: (passForm as any).value.userPassword,
    checkRePassword: (passForm as any).value.checkRePassword
  };

  context?.$myRequest({
    url: "/api/user/updatePass",
    method: "POST",
    data: form
  }).then(function(res: { data: { code: number; message: any; }; }) {
    if (res.data.code === 0) {
      context?.$message({ type: "success", message: "密码重置成功" });
    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
    dialogFormVisible.value = false;
  });
};

/**
 * logout
 */
const logout = () => {
  context?.$myRequest({
    url: "/api/user/logout",
    method: "GET"
  }).then(function(res: { data: { code: number; message: any; }; }) {
    if (res.data.code === 0) {
    } else {
      context?.$message({ type: "error", message: res.data.message });
    }
    dialogFormVisible.value = false;
    localStorage.removeItem("loginUser");
    localStorage.removeItem("studentList");
    localStorage.removeItem("teacherList");
    context?.$router.replace("/");
  });
};
</script>

<style scoped>

.gird {
  border: solid 0px red;
}
</style>