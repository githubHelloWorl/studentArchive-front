<template>
  <div>
    <el-card class="box-card all">
      <template #header>
        <div class="card-header">
          <span style="font-family: 隶书;font-size: 24px;text-align: center;">档案资料</span>
          <el-button class="button" type="text" @click="dialogFormVisible = true"
                     style="float: right;margin-right: 0px;"
          >修改信息
          </el-button>
        </div>
      </template>
      <div>
        <el-descriptions title="" direction="vertical" :column="3" border>
          <el-descriptions-item label="教师工号"
          >{{ user.userAccount }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名"
          >{{ user1.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号"
          >{{ user1.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号"
          >{{ user1.cardId }}
          </el-descriptions-item>
          <el-descriptions-item label="所属院系"
          >{{ user1.department }}
          </el-descriptions-item>
          <!--          <el-descriptions-item label="专业"-->
          <!--          >{{ user.classes }}-->
          <!--          </el-descriptions-item>-->
          <el-descriptions-item label="职务"
          >{{ user1.job }}
          </el-descriptions-item>
          <el-descriptions-item label="职称"
          >{{ user1.duty }}
          </el-descriptions-item>
          <el-descriptions-item label="单位"
          >{{ user1.unity }}
          </el-descriptions-item>
          <el-descriptions-item label="角色"
          ><span v-if="user1.userRole === 'student'">学生</span>
            <span v-else>教师</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改个人信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="user2" label-width="auto">
        <el-form-item label="学号" prop="userAccount">
          {{ user2.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ user2.userName }}
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user2.phone" placeholder="请输入手机号" size="default" />
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="user2.department" placeholder="请输入院系" size="default" />
        </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input v-model="user2.job" placeholder="请输入职务" size="default" />
        </el-form-item>
        <el-form-item label="职称" prop="duty">
          <el-input v-model="user2.duty" placeholder="请输入职称" size="default" />
        </el-form-item>
        <el-form-item label="单位" prop="unity">
          <el-input v-model="user2.unity" placeholder="请输入单位" size="default" />
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

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, computed } from "vue";

const instance = getCurrentInstance();

const context = getCurrentInstance()?.appContext.config.globalProperties;
let user = JSON.parse(localStorage.getItem("loginUser") as string);
let user1 = ref(<{}>{
  userAccount: user.userAccount,
  userName: user.userName,
  userRole: user.userRole,
  cardId: user.cardId,
  phone: user.phone,
  department: user.department,
  classes: user.classes,
  job: user.job,
  duty: user.duty,
  unity: user.unity
});
let user2 = ref(<{}>{
  userAccount: user.userAccount,
  userName: user.userName,
  userRole: user.userRole,
  cardId: user.cardId,
  phone: user.phone,
  department: user.department,
  classes: user.classes,
  job: user.job,
  duty: user.duty,
  unity: user.unity
});
let dialogFormVisible = ref(false);

/**
 * 修改信息
 */
const updateUser = () => {
  console.log(user1.value);
  context?.$myRequest({
    url: "/api/user/updateUser",
    method: "POST",
    data: user2.value
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "修改成功"
      });
      localStorage.setItem("loginUser", JSON.stringify(res.data.data));
      user2.value = { ...res.data.data };
      user1.value = { ...user2.value };

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