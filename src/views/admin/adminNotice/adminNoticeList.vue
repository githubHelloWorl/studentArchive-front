<template>
  <div>
    <el-card class="box-card all">
      <el-table :data="tableData" border stripe style="width: 80%;margin-left: 10%;" >
        <!--          <el-table-column prop="id" ></el-table-column>-->
        <el-table-column prop="createTime" label="时间" width="300">
          <template #default="scope">
            {{ new Date(scope.row.noticeTime).toLocaleDateString() }}
            <!--            <el-date-picker-->
            <!--              v-model="scope.row.noticeTime"-->
            <!--              type="date"-->
            <!--              :disabled="true"-->
            <!--            />-->
          </template>
        </el-table-column>
        <el-table-column prop="noticeTitle" label="标题" width="400" />
        <el-table-column label="操作" width="400">
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

    <el-dialog v-model="dialogFormVisible" title="修改档案信息" label-position="left" label-width="auto"
               style="max-width: 600px;">
      <el-form :model="notice" :inline="false">
        <el-form-item label="标题" prop="noticeTitle">
          <el-input type="text" v-model="notice.noticeTitle" size="large" :width="100" disabled />
        </el-form-item>
        <el-form-item label="内容" prop="noticeContent">
          <el-input v-model="notice.noticeContent" type="textarea" :width="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="" @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="danger" @click="deleteNotice">
            删除
          </el-button>
          <el-button type="primary" @click="updateNotice">
            修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, watch, toRef } from "vue";

export default {
  props: ["ruleForm"],
  setup(props: any, content: any) {

    const context = getCurrentInstance()?.appContext.config.globalProperties;
    // const user = context?.$store.state.loginUser;
    const user = JSON.parse(localStorage.getItem("loginUser") as string);
    // let archive: {} = reactive(<{}>{});
    let notice = ref(<{}>{});
    // let archive = {};
    let form = ref({});
    let dialogFormVisible = ref(false);
    let tmpList = ref([]);
    let total = ref(0);
    let pageSize = ref(10);
    let tableKey = ref(0);
    let tableData = ref([]);

    /**
     * 改变页码
     */
    const changePage = (page: number) => {
      page = page - 1;
      let start = page * pageSize.value,
        end = pageSize.value * (page + 1);
      let length = tmpList.value.length;

      let ans = end < length ? end : length;
      tableData.value.splice(0);
      tableData.value.push(...tmpList.value.slice(start, ans));
    };

    /**
     * 监听
     * 得到通知
     */
    const getTable = () => {
      form.value = props.ruleForm;
      console.log(form.value);
      context?.$myRequest({
        url: "/api/notice/queryNotice",
        method: "POST",
        data: form.value
      }).then(function(res: { data: { code: number; data: []; message: String; }; }) {
        if (res.data.code === 0) {

          // 分页
          tmpList.value.splice(0);
          tmpList.value.push(...(res.data.data as []));
          total.value = res.data.data.length;
          // console.log("total = ")
          // console.log(total)
          let start = 0,
            end = pageSize.value;
          let length = tmpList.value.length;
          let ans = end < length ? end : length;
          tableData.value.splice(0);
          tableData.value.push(...tmpList.value.slice(start, ans));

        } else {
          context?.$message({
            type: "error",
            messag: res.data.message
          });
        }
      });
    };
    watch(props.ruleForm, async (newValue, oldValue) => {

      await getTable();

    }, { immediate: true, deep: true });

    /**
     * 点击
     * @param row
     */
    const handleClick = (row: {}) => {
      notice.value = row;
      dialogFormVisible.value = true;
    };

    /**
     * 删除
     */
    const deleteNotice = () => {
      context?.$myRequest({
        url: "/api/notice/deleteNotice",
        method: "POST",
        data: notice.value
      }).then(async function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "通知删除成功"
          });
        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
        await getTable();
        dialogFormVisible.value = false;
      });
    };

    /**
     * 修改通知
     */
    const updateNotice = () => {
      context?.$myRequest({
        url: "/api/notice/updateNotice",
        method: "POST",
        data: notice.value
      }).then(function(res: { data: { code: number; data: {}; message: String; }; }) {
        if (res.data.code === 0) {
          context?.$message({
            type: "success",
            message: "通知修改成功"
          });
        } else {
          context?.$message({
            type: "error",
            message: res.data.message
          });
        }
        dialogFormVisible.value = false;
      });
    };

    return {
      tableData, tableKey, handleClick, dialogFormVisible, notice, pageSize, total, changePage, updateNotice, deleteNotice
    };
  }
};

</script>

<style scoped>

</style>