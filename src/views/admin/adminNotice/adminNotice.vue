<template>
  <div>
    <!--    新增通知按钮    -->
    <el-card class="box-card all" style="margin-bottom: 10px;">
      <el-button class="button" type="text" @click="dialogFormVisible = true"
                 style="float: right;margin-right: 11%;"
      >新增通知
      </el-button>
      <!--通知搜索-->
      <div>
        <el-form :model="ruleForm" :inline="true">
          <el-form-item label="标题内容" prop="userName">
            <el-input v-model="ruleForm.noticeTitle" style="width: 220px;"/>
          </el-form-item>
          <el-form-item label="通知时间" prop="noticeTime">
            <el-date-picker
              v-model="ruleForm.noticeTime"
              type="date"
              placeholder="请选择一个日期"
              size="default"
            />
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="handlerQuery" style="width: 100px">查询</el-button>
        </div>
      </div>
    </el-card>
    <!--新增通知-->
    <el-dialog v-model="dialogFormVisible" title="新增通知" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="notice">
        <el-form-item label="标题" prop="address">
          <el-input v-model="notice.noticeTitle" placeholder="请输入通知标题" size="large" :width="100" />
        </el-form-item>
        <el-form-item label="内容" prop="health">
          <el-input v-model="notice.noticeContent" placeholder="请输入通知内容" size="large" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createNotice">
            创建
          </el-button>
        </div>
      </template>
    </el-dialog>

    <adminNoticeList :rule-form="ruleForm"></adminNoticeList>
  </div>
</template>

<script setup lang="ts">
import adminNoticeList from "./adminNoticeList.vue";

import {getCurrentInstance, ref} from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
const user = context?.$store.state.loginUser;
let ruleForm = ref({
  noticeTitle: "",
  noticeTime: "",
  noticeContent: "",
  flag: 0
});
let dialogFormVisible = ref(<boolean>false);
let notice = ref(<{}>{
  noticeTitle: null,
  noticeTontent: null,
  noticeTime: null,
  updateTime: null
});

/**
 * 创建通知
 */
const createNotice = () => {

  context?.$myRequest({
    url: "/api/notice/createNotice",
    method: "POST",
    data: notice.value
  }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
    if (res.data.code === 0) {
      context?.$message({
        type: "success",
        message: "通知创建成功"
      });
      (ruleForm as any).value.noticeContent += "1";
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
 * 进行查询
 */
const handlerQuery = () => {
  ruleForm.value.flag += 1;
}

</script>

<style scoped>

</style>