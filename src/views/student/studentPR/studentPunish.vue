<template>
  <div>
    <el-card class="box-card all" style="margin-bottom: 10px;">

      <el-button class="button" @click="dialogFormVisible = true"
      >新增通知
      </el-button>
    </el-card>

    <!--    <el-card class="box-card all">-->
    <!--      <el-table :data="tableData" border stripe style="width: 100%;" :key="tableKey">-->
    <!--        &lt;!&ndash;          <el-table-column prop="id" ></el-table-column>&ndash;&gt;-->
    <!--        <el-table-column prop="createTime" label="时间" width="180">-->
    <!--          <template #default="scope">-->
    <!--            &lt;!&ndash;            {{ new Date(scope.row.createTime).toLocaleDateString() }}&ndash;&gt;-->
    <!--            <el-date-picker-->
    <!--              v-model="scope.row.noticeTime"-->
    <!--              type="date"-->
    <!--              :disabled="true"-->
    <!--            />-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column prop="noticeTitle" label="标题" width="180" />-->
    <!--        <el-table-column label="操作" width="180">-->
    <!--          <template #default="scope">-->
    <!--            <el-button type="primary" @click="handleClick(scope.row)">查看-->
    <!--            </el-button>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->
    <!--    </el-card>-->

    <el-dialog v-model="dialogFormVisible" title="新增信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="reward">
        <el-form-item label="证书名称" prop="address">
          <el-input v-model="reward.fileName" placeholder="请输入证书名称" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="审核教师" prop="health">
          <el-select v-model="reward.tid" placeholder="请输入审核教师">
            <el-option v-for="teacher in teacherList" :key="teacher.userAccount" :label="teacher.userName"
                       :value="teacher.userAccount">
              {{ teacher.userAccount }} -- {{ teacher.userName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颁发单位" prop="fileUnit">
          <el-input v-model="reward.fileUnit" placeholder="请输入颁发单位" size="large" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerCreateReward">
            创建
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
let ruleForm = ref({
  title: ""
});
let dialogFormVisible = ref(<boolean>false);
let reward = ref(<{}>{
  sid: user.sid,
  tid: null,
  fileId: null,
  fileName: null,
  state: "0",
  fileInfo: "0",
  tname: null,
  fileUnt: null
});
let teacherList = reactive(<[]>[]);

/**
 * 创建证书
 */
const handlerCreateReward = () => {
  (reward as any).value.sid = user.userAccount;

  context?.$myRequest({
    url: "/api/PR/createPR",
    method: "POST",
    data: reward.value
  }).then(function(res: any) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "上传成功"
      });

      // teacherList.splice(0);
      // teacherList.push(...res.data.data);

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
    url: "/api/user/queryUserByRole?userRole=teacher",
    method: "GET"
  }).then(function(res: any) {
    if (res.data.code === 0) {
      // context?.$message({
      //   type: "success",
      //   message: "档案修改成功"
      // });

      teacherList.splice(0);
      teacherList.push(...res.data.data);

    } else {
      context?.$message({
        type: "error",
        message: res.data.message
      });
    }
  });
});
</script>

<style scoped>

</style>