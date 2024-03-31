<template>
  <el-card class="box-card all">
    <el-table :data="tableData" border stripe style="width: 80%;margin-left: 10%;" :key="tableKey">
      <!--          <el-table-column prop="id" ></el-table-column>-->
      <el-table-column prop="createTime" label="时间" width="300">
        <template #default="scope">
          {{ new Date(scope.row.noticeTime).toLocaleDateString() }}
          <!--          <el-date-picker-->
          <!--            v-model="scope.row.noticeTime"-->
          <!--            type="date"-->
          <!--            :disabled="true"-->
          <!--          />-->
        </template>
      </el-table-column>
      <el-table-column prop="noticeTitle" label="标题" width="300" />
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button type="primary" @click="handleClick(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin: 20px 0 0 10%;"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
  </el-card>

  <!--  <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"-->
  <!--             style="max-width: 600px;">-->
  <!--    <el-input-->
  <!--      v-model="notice.noticeTitle"-->
  <!--      style="width: 240px"-->
  <!--      autosize-->
  <!--      type="textarea"-->
  <!--      placeholder="Please input"-->
  <!--    />-->
  <!--    <div style="margin: 20px 0" />-->
  <!--    <el-input-->
  <!--      v-model="notice.noticeContent"-->
  <!--      style="width: 240px"-->
  <!--      :autosize="{ minRows: 2, maxRows: 4 }"-->
  <!--      type="textarea"-->
  <!--      placeholder="Please input"-->
  <!--    />-->
  <!--    <template #footer>-->
  <!--      <div class="dialog-footer">-->
  <!--        <el-button type="primary" @click="">-->
  <!--          修改-->
  <!--        </el-button>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </el-dialog>-->

  <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
             style="max-width: 600px;">
    <el-form :model="notice" :inline="false">
      <el-form-item label="标题" prop="noticeTitle">
        <el-input type="text" v-model="notice.noticeTitle" size="large" :width="100" disabled />
      </el-form-item>
      <el-form-item label="内容" prop="noticeContent">
        <el-input v-model="notice.noticeContent" type="textarea" :width="100" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, watch, toRef } from "vue";


export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {

    const context = getCurrentInstance()?.appContext.config.globalProperties;
    const user = JSON.parse(localStorage.getItem("loginUser") as string);
    let notice = reactive(<{}>{
      noticeTitle: "",
      noticeContent: ""
    });
    let form = ref({});
    let dialogFormVisible = ref(false);
    let tmpList = ref(<[]>[]);
    let total = ref(0);
    let pageSize = ref(10);
    let tableKey = ref(0);
    let tableData = ref(<[]>[]);

    /**
     * 改变页码
     */
    const changePage = (page: number) => {
      console.log(page);
      console.log(tmpList.value);
      page = page - 1;
      let start = page * pageSize.value,
        end = pageSize.value * (page + 1);
      let length = tmpList.value.length;

      let ans = end < length ? end : length;
      tableData.value.splice(0);
      tableData.value.push(...tmpList.value.slice(start, ans));
      console.log(start, ans);
      console.log(tableData.value);
    };

    /**
     * 监听
     * 得到通知
     */
    watch(props.ruleForm, (newValue, oldValue) => {
      form.value = props.ruleForm;

      context?.$myRequest({
        url: "/api/notice/queryNotice",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {

          tmpList.value.splice(0);
          tmpList.value.push(...(res.data.data as []));
          total.value = res.data.data.length;
          // console.log("total = ")
          // console.log(total)
          let start: number = 0,
            end: number = pageSize.value;
          let length: number = tmpList.value.length;
          let ans = end < length ? end : length;
          tableData.value.splice(0);
          tableData.value.push(...tmpList.value.slice(start, ans));

          // 进行赋值
          // tableData.splice(0);
          // tableData.push(...res.data.data);

        } else {
          context?.$message({
            type: "error",
            messag: res.data.message
          });
        }
      });

    }, { immediate: true, deep: true });

    /**
     * 查看通知
     * @param row
     */
    const handleClick = (row: {}) => {
      (notice as any).noticeTitle = (row as any).noticeTitle;
      (notice as any).noticeContent = (row as any).noticeContent;

      // console.log(notice);
      // notice = row;
      // notice = { ...row };
      // console.log(notice);

      dialogFormVisible.value = true;
    };

    return {
      tableData, tableKey, handleClick, dialogFormVisible, notice, pageSize, total, changePage
    };
  }
};

</script>

<style scoped>

</style>