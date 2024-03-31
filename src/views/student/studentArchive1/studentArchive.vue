<template>
  <div>
    <el-card class="box-card all">
      <template #header>
        <div class="card-header">
          <span style="font-family: 隶书;font-size: 24px;text-align: center;">档案资料</span>
          <el-button class="button" type="text" @click="dialogFormVisible1 = true"
                     style="float: right;margin-right: 0px;"
          >修改信息
          </el-button>
          <el-button class="button" type="text" @click="dialogFormVisible = true"
                     style="float: right;margin-right: 20px;"
          >修改档案
          </el-button>
        </div>
      </template>
      <div>
        <el-descriptions title="" direction="vertical" :column="3" border>
          <el-descriptions-item label="编号档案"
          >{{ archive.archiveId }}
          </el-descriptions-item>
          <el-descriptions-item label="学号"
          >{{ user1.userAccount }}
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
          <el-descriptions-item label="班级"
          >{{ user1.classes }}
          </el-descriptions-item>

          <el-descriptions-item label="性别"
          >{{ archive.sex }}
          </el-descriptions-item>
          <el-descriptions-item label="民族"
          >{{ archive.nation }}
          </el-descriptions-item>
          <el-descriptions-item label="出生日期">
            <!--            <el-date-picker-->
            <!--              v-model="archive.createTime"-->
            <!--              type="date"-->
            <!--              :disabled="false"-->
            <!--            />-->
            {{ new Date(archive.createTime).toLocaleDateString() }}
          </el-descriptions-item>
          <el-descriptions-item label="家庭地址"
          >{{ archive.address }}
          </el-descriptions-item>
          <el-descriptions-item label="健康状况"
          >{{ archive.health }}
          </el-descriptions-item>
          <el-descriptions-item label="生源地"
          >{{ archive.origin }}
          </el-descriptions-item>
          <el-descriptions-item label="角色"
          ><span v-if="user1.userRole === 'student'">学生</span>
            <span v-else>教师</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="archive" label-width="auto">
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="archive.sex">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="家庭地址" prop="address">
          <el-input v-model="archive.address" placeholder="请输入家庭住址" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="健康状况" prop="health">
          <el-input v-model="archive.health" placeholder="请输入健康状况" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="生源地" prop="origin">
          <el-input v-model="archive.origin" placeholder="请输入生源地" size="large" />
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="archive.nation" placeholder="请输入民族" size="large" />
        </el-form-item>
        <el-form-item label="出生日期" prop="createTime">
          <el-date-picker
            v-model="archive.createTime"
            type="date"
            placeholder="请输入日期"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateArchive">
            修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogFormVisible1" title="修改个人信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="user1" label-width="auto">
        <el-form-item label="学号" prop="userAccount">
          {{ user1.userAccount }}
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          {{ user1.userName }}
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="user1.department" placeholder="请输入院系" size="default" />
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-input v-model="user1.classes" placeholder="请输入班级" size="default" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user1.phone" placeholder="请输入手机号" size="default" />
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
import { ref, reactive, getCurrentInstance, onMounted } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
// const user = context?.$store.state.loginUser;
let user = JSON.parse(localStorage.getItem("loginUser") as string);
let user1 = ref(<{}>{
  userAccount: user.userAccount,
  userName: user.userName,
  userRole: user.userRole,
  cardId: user.cardId,
  phone: user.phone,
  department: user.department,
  classes: user.classes
});
let archive = ref({});
let dialogFormVisible = ref(false);
let dialogFormVisible1 = ref(false);

/**
 * 修改档案
 */
const updateArchive = () => {
  context?.$myRequest({
    url: "/api/archive/updateArchive",
    method: "POST",
    data: archive.value
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "档案修改成功"
      });
      // const date = new Date(archive.value.createTime);
      // console.log(date.toLocaleDateString());

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
    dialogFormVisible1.value = false;
  });
};

/**
 * 得到档案
 */
const getArchive = () => {
  context?.$myRequest({
    url: "/api/archive/getArchive?userAccount=" + user.userAccount,
    method: "GET"
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      archive.value = res.data.data;
      // console.log(archive);
    } else {
      context?.$message({
        type: "error",
        messag: res.data.message
      });
    }
  });
};

/**
 * 初始化
 */
onMounted(async () => {
  await getArchive();
});

</script>

<style scoped>

</style>