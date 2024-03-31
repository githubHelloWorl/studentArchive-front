<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :inline="true">
        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input v-model="ruleForm.noticeTitle" />
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
    </el-card>

    <el-dialog v-model="dialogFormVisible1" title="通知" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-table :data="tableData" border stripe style="width: 100%;;max-height: 200px;overflow: auto;">
        <el-table-column prop="createTime" label="时间" width="180">
          <template #default="scope">
            <el-date-picker
              v-model="scope.row.noticeTime"
              type="date"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="noticeTitle" label="标题" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-popover
              placement="bottom"
              title=""
              :width="200"
              trigger="click"
            >
              <template #reference>
                <el-button type="text">点击查看</el-button>
              </template>
              <template #default>
                <div style="margin-top: 20px;">
                  <p>
                    {{ scope.row.noticeContent }}
                  </p>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">确认</el-button>
          <!--          <el-button type="primary" @click="updatePass">-->
          <!--            修改-->
          <!--          </el-button>-->
        </div>
      </template>
    </el-dialog>

    <teacher-notice-list :rule-form="ruleForm"></teacher-notice-list>
  </div>
</template>

<script setup lang="ts">
import teacherNoticeList from "@/views/teacher/teacherNotice/teacherNoticeList.vue";
import { ref, reactive, getCurrentInstance } from "vue";

const context = getCurrentInstance()?.appContext.config.globalProperties;
let dialogFormVisible1 = ref(<boolean>false);
const ruleForm = ref(<{}>{
  noticeTime: "",
  noticeTitle: ""
});


</script>

<style scoped>

</style>