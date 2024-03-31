<template>
  <div>
    <el-card class="box-card all">
      <template #header>
        <div class="card-header">
          <span>我的资料</span>
<!--          <el-button class="button" type="text" @click="dialogFormVisible = true"-->
<!--                     style="float: right;margin-right: 20px;"-->
<!--          >修改信息-->
<!--          </el-button>-->
        </div>
      </template>
      <div>
        <el-descriptions title="" direction="vertical" :column="5" border>
          <el-descriptions-item label="账号"
          >{{ user.userAccount }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名"
          >{{ user.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="角色"
          ><span v-if="user.userRole === 'student'">学生</span>
            <span v-else>教师</span>
          </el-descriptions-item>
          <el-descriptions-item label="身份证号" :span="2"
          >{{ user.cardId }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号" :span="2"
          >{{ user.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="所属院系" :span="2"
          >{{ user.department }}
          </el-descriptions-item>
          <el-descriptions-item label="专业" :span="2"
          >{{ user.classes }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">无</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>


<!--    <el-dialog v-model="dialogFormVisible" title="找回密码" label-position="left" label-width="auto"-->
<!--               style="max-width: 600px;">-->
<!--      <el-form :model="user">-->
<!--        <el-form-item label="身份证号" prop="cardId">-->
<!--          <el-input v-model="passForm.cardId" placeholder="请输入身份证号" size="large" :width="100" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="身份证号" prop="cardId">-->
<!--          <el-input v-model="passForm.cardId" placeholder="请输入身份证号" size="large" :width="100" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="  密码" prop="userPassword">-->
<!--          <el-input v-model="passForm.userPassword" placeholder="请输入密码" size="large" type="password"-->
<!--                    show-password />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码" prop="checkRePassword">-->
<!--          <el-input v-model="passForm.checkRePassword" placeholder="请输入确认密码" size="large" type="password"-->
<!--                    show-password />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button @click="dialogFormVisible = false">取消</el-button>-->
<!--          <el-button type="primary" @click="updatePass">-->
<!--            修改-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script setup lang="ts">
import { ref,reactive, getCurrentInstance } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
// const user = context?.$store.state.loginUser;



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


</script>

<style scoped>

</style>