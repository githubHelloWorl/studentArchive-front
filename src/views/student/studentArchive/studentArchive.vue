<template>
  <div>
    <el-card class="box-card all">
      <template #header>
        <div class="card-header">
          <span>我的资料</span>
          <el-button class="button" type="text" @click="dialogFormVisible = true"
                     style="float: right;margin-right: 20px;"
          >修改信息
          </el-button>
        </div>
      </template>
      <div>
        <el-descriptions title="" direction="vertical" :column="5" border>
          <el-descriptions-item label="编号档案"
          >{{ archive.archiveId }}
          </el-descriptions-item>
          <el-descriptions-item label="性别"
          >{{ archive.sex }}
          </el-descriptions-item>
          <el-descriptions-item label="家庭地址"
          >{{ archive.address }}
          </el-descriptions-item>
          <el-descriptions-item label="健康状况" :span="2"
          >{{ archive.health }}
          </el-descriptions-item>
          <el-descriptions-item label="生源地" :span="2"
          >{{ archive.origin }}
          </el-descriptions-item>
          <el-descriptions-item label="民族" :span="10"
          >{{ archive.nation }}
          </el-descriptions-item>
          <el-descriptions-item label="出生时间">
            <el-date-picker
              v-model="archive.createTime"
              type="date"
              :disabled="true"
            />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>


    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="archive">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let archive = ref({});
let dialogFormVisible = ref(false);

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
  });
};

/**
 * 初始化
 */
onMounted(() => {
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
});

</script>

<style scoped>

</style>