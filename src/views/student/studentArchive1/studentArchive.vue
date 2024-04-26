<template>
  <div>
    <el-card class="box-card all">
      <template #header>
        <div class="card-header" style="width: 100%;">
          <span style="font-family: 隶书;font-size: 35px;text-align: center;margin-left: 13%;">档案资料</span>
          <el-button class="button" type="text" @click="dialogFormVisible = true"
                     style="float: right;margin-right:44px;margin-top: 5px"
          >修改档案
          </el-button>
          <el-button class="button" type="text" @click="dialogFormVisible1 = true"
                     style="float: right;margin-right:55px;margin-top: 5px"
          >修改信息
          </el-button>
        </div>
      </template>
      <div>
        <el-descriptions title="" direction="vertical" :column="3" border style="width: 94%;margin-left: 3%">
          <el-descriptions-item label="档案编号" align="center" width="30%"
          >{{ archive.archiveId }}
          </el-descriptions-item>
          <el-descriptions-item label="学号" align="center" width="30%"
          >{{ user1.userAccount }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名" align="center" width="30%"
          >{{ user1.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号" align="center" width="30%"
          >{{ user1.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号" align="center" width="30%"
          >{{ user1.cardId }}
          </el-descriptions-item>
          <el-descriptions-item label="所属院系" align="center" width="30%"
          >{{ user1.department }}
          </el-descriptions-item>
          <el-descriptions-item label="班级" align="center" width="30%"
          >{{ user1.classes }}
          </el-descriptions-item>
          <el-descriptions-item label="性别" align="center" width="30%"
          >{{ archive.sex }}
          </el-descriptions-item>
          <el-descriptions-item label="民族" align="center" width="30%"
          >{{ archive.nation }}
          </el-descriptions-item>
          <el-descriptions-item label="出生日期" align="center" width="30%">
            {{ new Date(archive.createTime).toLocaleDateString() }}
          </el-descriptions-item>
          <el-descriptions-item label="健康状况" align="center" width="30%"
          >{{ archive.health }}
          </el-descriptions-item>
          <el-descriptions-item label="生源地" align="center" width="30%"
          >{{ archive.origin }}
          </el-descriptions-item>
          <el-descriptions-item label="家庭地址" :span="2" align="center" width="30%"
          >{{ archive.address }}
          </el-descriptions-item>
          <el-descriptions-item label="用户角色" align="center" width="30%"
          ><span v-if="user1.userRole === 'student'">学生</span>
            <span v-else>教师</span>
          </el-descriptions-item>
          <el-descriptions-item label="学生获奖信息" :span="3" align="center">
            <el-text v-for="(reward,index) in studentPR.reward" :key="index" :label="reward" :value="reward">
              {{ (index === 0 ? "" : " , ") + reward }}
            </el-text>
          </el-descriptions-item>
          <el-descriptions-item label="学生处分信息" :span="3" align="center">
            <el-text v-for="(punish,index) in studentPR.punish" :key="index" :label="punish" :value="punish">
              {{ (index === 0 ? "" : " , ") + punish }}
            </el-text>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="archive2" label-width="auto">
        <el-form-item label="性别 :" prop="sex">
          <el-radio-group v-model="archive2.sex">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="家庭地址 :" prop="address">
          <el-input v-model="archive2.address" placeholder="请输入家庭住址" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="健康状况 :" prop="health">
          <el-input v-model="archive2.health" placeholder="请输入健康状况" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="生源地 :" prop="origin">
          <el-input v-model="archive2.origin" placeholder="请输入生源地" size="large" />
        </el-form-item>
        <el-form-item label="民族 :" prop="nation">
          <el-input v-model="archive2.nation" placeholder="请输入民族" size="large" />
        </el-form-item>
        <el-form-item label="出生日期 :" prop="createTime">
          <el-date-picker
            v-model="archive2.createTime"
            type="date"
            placeholder="请输入日期"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateArchive">修改</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogFormVisible1" title="修改个人信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="user2" label-width="auto">
        <el-form-item label="学号 :" prop="userAccount">
          {{ user2.userAccount }}
        </el-form-item>
        <el-form-item label="姓名 :" prop="userName">
          {{ user2.userName }}
        </el-form-item>
        <el-form-item label="身份证号 :" prop="cardId">
          {{ user2.cardId }}
        </el-form-item>
        <el-form-item label="手机号 :" prop="phone">
          <el-input v-model="user2.phone" placeholder="请输入手机号" size="default"/>
        </el-form-item>
        <el-form-item label="院系 :" prop="department">
          <el-input v-model="user2.department" placeholder="请输入院系" size="default" />
        </el-form-item>
        <el-form-item label="班级 :" prop="classes">
          <el-input v-model="user2.classes" placeholder="请输入班级" size="default" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";

interface PR {
  punish: [string],
  reward: [string]
};

const context = getCurrentInstance()?.appContext.config.globalProperties;
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
let user2 = ref<{}>({
  userAccount: user.userAccount,
  userName: user.userName,
  userRole: user.userRole,
  cardId: user.cardId,
  phone: user.phone,
  department: user.department,
  classes: user.classes
});
let archive = ref({});
let archive2 = ref<{}>({});
let dialogFormVisible = ref(false);
let dialogFormVisible1 = ref(false);
let studentPR = ref<PR>({ punish: [""], reward: [""] });

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
        message: "档案修改成功"
      });
      localStorage.setItem("loginUser", JSON.stringify(res.data.data));
      user.value = { ...res.data.data };
      user1.value = { ...res.data.data };
      user2.value = { ...res.data.data };
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
      archive.value = { ...res.data.data };
      archive2.value = { ...res.data.data };
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
 * 修改档案
 */
const updateArchive = () => {
  context?.$myRequest({
    url: "/api/archive/updateArchive",
    method: "POST",
    data: archive2.value
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "档案修改成功"
      });
      archive.value = { ...archive2.value };

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
 * 得到用户PR
 */
const getPRByuserAccount = (userAccount: string) => {
  context?.$myRequest({
    url: "/api/PR/getPRByAccountState?userAccount=" + userAccount,
    method: "GET"
  }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
    if (res.data.code === 0) {
      studentPR.value.reward.splice(0);
      studentPR.value.punish.splice(0);
      res.data.data.forEach((item: any, index) => {
        if ((item as any).fileInfo === "1") {
          studentPR.value.reward.push(item.fileName);
        } else {
          studentPR.value.punish.push(item.fileName);
        }
      });
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
  await getPRByuserAccount(user.userAccount);
});

</script>

<style scoped>

</style>